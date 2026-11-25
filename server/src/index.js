import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Event, Winner, Champion, Download } from './models.js';
import { adminAuth } from './auth.js';

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '1mb' }));

const medalPoints = { '1st': 10, '2nd': 7, '3rd': 5, '4th': 3 };

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }
  const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, username });
});

app.get('/api/events', async (_, res) => res.json(await Event.find().sort({ name: 1 })));
app.get('/api/winners', async (_, res) => res.json(await Winner.find().sort({ season: -1, createdAt: -1 })));
app.get('/api/champions', async (_, res) => res.json(await Champion.find().sort({ season: -1 })));
app.get('/api/downloads', async (_, res) => res.json(await Download.find().sort({ title: 1 })));

app.get('/api/points', async (req, res) => {
  const season = req.query.season || '2026–27';
  const winners = await Winner.find({ season });
  const tally = {};
  winners.forEach(w => {
    tally[w.department] ||= { department: w.department, points: 0, gold: 0, silver: 0, bronze: 0, fourth: 0 };
    tally[w.department].points += w.points;
    if (w.position === '1st') tally[w.department].gold++;
    if (w.position === '2nd') tally[w.department].silver++;
    if (w.position === '3rd') tally[w.department].bronze++;
    if (w.position === '4th') tally[w.department].fourth++;
  });
  res.json(Object.values(tally).sort((a,b) => b.points - a.points));
});

app.get('/api/dashboard', async (req, res) => {
  const season = req.query.season || '2026–27';
  const [events, winners, points, champions] = await Promise.all([
    Event.countDocuments({ season }),
    Winner.countDocuments({ season }),
    Winner.find({ season }),
    Champion.find().sort({ season: -1 }).limit(1)
  ]);
  const departments = new Set(points.map(x => x.department)).size;
  const sum = points.reduce((n, x) => n + x.points, 0);
  res.json({ events, winners, departments, totalPoints: sum, champion: champions[0] || null });
});

// Admin CRUD
app.post('/api/events', adminAuth, async (req, res) => res.status(201).json(await Event.create(req.body)));
app.put('/api/events/:id', adminAuth, async (req, res) => res.json(await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })));
app.delete('/api/events/:id', adminAuth, async (req, res) => { await Event.findByIdAndDelete(req.params.id); res.json({ message: 'Event deleted.' }); });

app.post('/api/winners', adminAuth, async (req, res) => {
  const payload = { ...req.body, points: req.body.points ?? medalPoints[req.body.position] ?? 0 };
  res.status(201).json(await Winner.create(payload));
});
app.put('/api/winners/:id', adminAuth, async (req, res) => {
  const payload = { ...req.body };
  if (payload.position && payload.points == null) payload.points = medalPoints[payload.position] || 0;
  res.json(await Winner.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }));
});
app.delete('/api/winners/:id', adminAuth, async (req, res) => { await Winner.findByIdAndDelete(req.params.id); res.json({ message: 'Winner deleted.' }); });

app.post('/api/champions', adminAuth, async (req, res) => res.status(201).json(await Champion.create(req.body)));
app.put('/api/champions/:id', adminAuth, async (req, res) => res.json(await Champion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })));
app.delete('/api/champions/:id', adminAuth, async (req, res) => { await Champion.findByIdAndDelete(req.params.id); res.json({ message: 'Champion record deleted.' }); });

app.post('/api/downloads', adminAuth, async (req, res) => res.status(201).json(await Download.create(req.body)));
app.put('/api/downloads/:id', adminAuth, async (req, res) => res.json(await Download.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })));
app.delete('/api/downloads/:id', adminAuth, async (req, res) => { await Download.findByIdAndDelete(req.params.id); res.json({ message: 'Download removed.' }); });

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`Sports API running at http://localhost:${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
