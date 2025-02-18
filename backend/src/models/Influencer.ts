import { Schema, model, Document, Types } from 'mongoose';

export interface HealthClaim {
  id: string;
  text: string;
  category: string;
  verificationStatus: 'Verified' | 'Questionable' | 'Debunked';
  trustScore: number;
  date: string;
  analysis: string;
  scientificReference: string;
}

export interface IInfluencer extends Document {
  _id: Types.ObjectId;
  name: string;
  normalizedName: string;
  bio: string;
  category: string;
  trustScore: number;
  followers: number;
  yearlyRevenue: string;
  claims: HealthClaim[];
  lastUpdated: Date;
}

const healthClaimSchema = new Schema({
  id: String,
  text: String,
  category: String,
  verificationStatus: {
    type: String,
    enum: ['Verified', 'Questionable', 'Debunked']
  },
  trustScore: Number,
  date: String,
  analysis: String,
  scientificReference: String
});

const influencerSchema = new Schema<IInfluencer>({
  name: { type: String, required: true },
  normalizedName: { type: String, required: true, index: true },
  bio: String,
  category: String,
  trustScore: Number,
  followers: Number,
  yearlyRevenue: String,
  claims: [healthClaimSchema],
  lastUpdated: { type: Date, default: Date.now }
});

// Create indexes for efficient searching
influencerSchema.index({ normalizedName: 1 });
influencerSchema.index({ category: 1 });
influencerSchema.index({ trustScore: -1 });

export const Influencer = model<IInfluencer>('Influencer', influencerSchema); 