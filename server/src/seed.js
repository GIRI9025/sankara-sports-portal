import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Event, Winner, Champion, Download } from './models.js';
dotenv.config();

const events = [
  ['Kabaddi','Team Sport','Men / Women','Fast-paced team raid and defence'],
  ['Cricket','Team Sport','Men / Women','College cricket tournament'],
  ['Volleyball','Team Sport','Men / Women','Team competition'],
  ['Football','Team Sport','Men / Women','Football tournament'],
  ['Basketball','Team Sport','Men / Women','Court competition'],
  ['Badminton','Individual / Doubles','Men / Women','Singles and doubles'],
  ['Table Tennis','Individual / Doubles','Men / Women','Singles and doubles'],
  ['Chess','Individual','Open','Strategic board competition'],
  ['Carrom','Individual / Doubles','Men / Women','Indoor competition'],
  ['Athletics','Track & Field','Men / Women','Track and field events'],
  ['Throwball','Team Sport','Women','Team competition'],
  ['Kho-Kho','Team Sport','Men / Women','Team competition']
].map(([name,category,division,description]) => ({ name, category, division, description, season:'2026–27', status:'Upcoming' }));

const demoWinners = [
  {event:'Kabaddi',studentOrTeam:'Computer Science Team',department:'Computer Science',position:'1st',points:10,season:'2026–27',division:'Men'},
  {event:'Cricket',studentOrTeam:'Commerce Team',department:'Commerce',position:'1st',points:10,season:'2026–27',division:'Men'},
  {event:'Badminton',studentOrTeam:'Demo Player',department:'Mathematics',position:'1st',points:10,season:'2026–27',division:'Women'},
  {event:'Volleyball',studentOrTeam:'Computer Science Team',department:'Computer Science',position:'2nd',points:7,season:'2026–27',division:'Women'},
  {event:'Athletics 100m',studentOrTeam:'Demo Athlete',department:'English',position:'3rd',points:5,season:'2026–27',division:'Men'}
];
const champions = [
  {season:'2026–27',champion:'Computer Science',runnerUp:'Commerce',third:'Mathematics',totalPoints:85},
  {season:'2025–26',champion:'Department A',runnerUp:'Department B',third:'Department C',totalPoints:0},
  {season:'2024–25',champion:'Department A',runnerUp:'Department B',third:'Department C',totalPoints:0}
];
const downloads = [
  {title:'Sports Registration Form',type:'PDF',description:'Download and fill the student registration form',url:'#'},
  {title:'Sports Rules & Regulations',type:'PDF',description:'Official event rules and regulations',url:'#'},
  {title:'Results & Points Report',type:'PDF',description:'Season results and department points report',url:'#'},
  {title:'Tournament Schedule',type:'PDF',description:'Event dates, venues and fixtures',url:'#'}
];

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([Event.deleteMany({}),Winner.deleteMany({}),Champion.deleteMany({}),Download.deleteMany({})]);
await Event.insertMany(events);
await Winner.insertMany(demoWinners);
await Champion.insertMany(champions);
await Download.insertMany(downloads);
console.log('Seeded sample sports portal records. Replace demo records with real college data.');
await mongoose.disconnect();
