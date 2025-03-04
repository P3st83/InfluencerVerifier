import express, { Request, Response } from 'express';
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
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/influencer-verifier')
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('Database connection string:', process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://[hidden]@'));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit if we can't connect to the database
  });

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'http://localhost:4174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'https://p3st83.github.io',
  'https://influencer-verifier-frontend.onrender.com',
  'https://influencer-verifier-api.onrender.com'
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
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
app.get('/api/influencers', async (req: Request, res: Response) => {
  try {
    const influencers = await Influencer.find({})
      .sort({ trustScore: -1 })
      .select('-__v');
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch influencers' });
  }
});

app.post('/api/analyze-influencer', async (req: Request, res: Response) => {
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

app.post('/api/verify-claims', async (req: Request, res: Response) => {
  try {
    const { claims, journals } = req.body;
    const verificationResults = await verifyHealthClaims(claims, journals);
    res.json(verificationResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify claims' });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 