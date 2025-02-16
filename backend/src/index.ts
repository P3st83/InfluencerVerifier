import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { analyzeInfluencer } from './services/influencerAnalysis';
import { verifyHealthClaims } from './services/claimVerification';
import { Influencer } from './models/Influencer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/influencer-verifier')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get('/api/influencers', async (req, res) => {
  try {
    const influencers = await Influencer.find({})
      .sort({ trustScore: -1 })
      .select('-__v');
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch influencers' });
  }
});

app.post('/api/analyze-influencer', async (req, res) => {
  try {
    const { influencerName, timeRange, claimsToAnalyze } = req.body;

    if (!influencerName) {
      return res.status(400).json({ error: 'Influencer name is required' });
    }

    const analysis = await analyzeInfluencer(influencerName, timeRange, claimsToAnalyze);
    res.json(analysis);
  } catch (error: any) {
    console.error('Route Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze influencer',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post('/api/verify-claims', async (req, res) => {
  try {
    const { claims, journals } = req.body;
    const verificationResults = await verifyHealthClaims(claims, journals);
    res.json(verificationResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify claims' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 