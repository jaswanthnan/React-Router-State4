import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Candidate from './models/Candidate.js';
import Job from './models/Job.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hrms-dashboard';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/candidates', async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/candidates/:id', async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/candidates/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Jobs Routes
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed Initial Data Route (For testing)
app.post('/api/seed', async (req, res) => {
  try {
    await Candidate.deleteMany(); // Clear existing
    await Job.deleteMany();       // Clear existing jobs
    const seedData = [
      { name: 'John Doe', email: 'john.doe@gmail.com', role: 'Frontend Engineer', experience: '3 Years', status: 'In Review' },
      { name: 'Jane Smith', email: 'jane.smith@gmail.com', role: 'Backend Engineer', experience: '5 Years', status: 'Hired' },
      { name: 'Bob Johnson', email: 'bob.johnson@gmail.com', role: 'UI/UX Designer', experience: '2 Years', status: 'Pending' },
      { name: 'Alice Williams', email: 'alice.williams@gmail.com', role: 'Data Analyst', experience: '1 Year', status: 'In Review' },
      { name: 'Charlie Brown', email: 'charlie.brown@gmail.com', role: 'DevOps Engineer', experience: '4 Years', status: 'Hired' },
    ];
    await Candidate.insertMany(seedData);

    const seedJobs = [
      { title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Active' },
      { title: 'Product Manager', department: 'Product', location: 'New York', type: 'Full-time', status: 'Closed' },
      { title: 'Marketing Specialist', department: 'Marketing', location: 'London', type: 'Contract', status: 'Active' },
      { title: 'UX Designer', department: 'Design', location: 'Berlin', type: 'Full-time', status: 'Active' },
      { title: 'Data Scientist', department: 'Data', location: 'Remote', type: 'Full-time', status: 'Active' },
    ];
    await Job.insertMany(seedJobs);

    res.json({ message: 'Database seeded successfully with both candidates and jobs!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
