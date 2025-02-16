import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthClaim {
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
  name: string;
  normalizedName: string;  // For easier searching
  bio: string;
  category: string;
  trustScore: number;
  followers: number;
  yearlyRevenue: string;
  claims: IHealthClaim[];
  lastUpdated: Date;
  createdAt: Date;
}

const HealthClaimSchema = new Schema<IHealthClaim>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  category: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ['Verified', 'Questionable', 'Debunked'], 
    required: true 
  },
  trustScore: { type: Number, required: true },
  date: { type: String, required: true },
  analysis: { type: String, required: true },
  scientificReference: { type: String, required: true }
});

const InfluencerSchema = new Schema<IInfluencer>({
  name: { type: String, required: true },
  normalizedName: { type: String, required: true, index: true },
  bio: { type: String, required: true },
  category: { type: String, required: true },
  trustScore: { type: Number, required: true },
  followers: { type: Number, required: true },
  yearlyRevenue: { type: String, required: true },
  claims: [HealthClaimSchema],
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for efficient searching
InfluencerSchema.index({ normalizedName: 1 });
InfluencerSchema.index({ category: 1 });
InfluencerSchema.index({ trustScore: -1 });

export const Influencer = mongoose.model<IInfluencer>('Influencer', InfluencerSchema); 