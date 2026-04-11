import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['In Review', 'Hired', 'Pending', 'Rejected'] 
  },
  createdAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
