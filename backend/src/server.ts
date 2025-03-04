import cors from 'cors';

const app = require('express')();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://192.168.1.138:5173',
    'https://influencer-verifier-frontend.onrender.com'
  ],
  credentials: true
}));

// ... rest of the existing code ... 