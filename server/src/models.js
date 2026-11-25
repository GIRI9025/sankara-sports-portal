import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Team Sport' },
  division: { type: String, default: 'Men / Women' },
  description: { type: String, default: '' },
  season: { type: String, default: '2026–27' },
  image: { type: String, default: '' },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Ongoing'], default: 'Upcoming' }
}, { timestamps: true });

const winnerSchema = new mongoose.Schema({
  event: { type: String, required: true },
  studentOrTeam: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, enum: ['1st', '2nd', '3rd', '4th'], required: true },
  points: { type: Number, default: 0 },
  season: { type: String, default: '2026–27' },
  division: { type: String, default: 'Men' },
  note: { type: String, default: '' }
}, { timestamps: true });

const championSchema = new mongoose.Schema({
  season: { type: String, required: true, unique: true },
  champion: { type: String, required: true },
  runnerUp: { type: String, default: '' },
  third: { type: String, default: '' },
  totalPoints: { type: Number, default: 0 }
}, { timestamps: true });

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'PDF' },
  description: { type: String, default: '' },
  url: { type: String, default: '' }
}, { timestamps: true });

export const Event = mongoose.model('Event', eventSchema);
export const Winner = mongoose.model('Winner', winnerSchema);
export const Champion = mongoose.model('Champion', championSchema);
export const Download = mongoose.model('Download', documentSchema);
