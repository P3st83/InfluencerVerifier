import axios from 'axios';
import { Types, Document } from 'mongoose';
import { Request, Response } from 'express';
import { Influencer } from '../models/Influencer';

interface AnalysisResult {
  id: string;
  name: string;
  trustScore: number;
  claims: HealthClaim[];
  category: string;
  followers: number;
  yearlyRevenue: string;
  bio: string;
}

interface InfluencerDocument extends Document {
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

interface HealthClaim {
  id: string;
  text: string;
  category: string;
  verificationStatus: 'Verified' | 'Questionable' | 'Debunked';
  trustScore: number;
  date: string;
  analysis: string;
  scientificReference: string;
}

// Mock data for different influencers
const mockInfluencers: Record<string, Partial<AnalysisResult>> = {
  'unknown': {
    name: 'Unknown Influencer',
    bio: 'Health and wellness influencer focusing on evidence-based approaches.',
    trustScore: 83,
    category: 'General Health',
    followers: 638000,
    yearlyRevenue: '$1.4M',
    claims: [
      {
        id: '1',
        text: 'Regular cold exposure through ice baths or cold showers can boost immune system function and improve metabolic health.',
        category: 'Wellness',
        verificationStatus: 'Questionable',
        trustScore: 75,
        date: new Date().toISOString(),
        analysis: 'While some studies suggest potential benefits of cold exposure, the evidence is mixed and more research is needed to confirm the extent of immune and metabolic improvements. Current studies show modest effects on brown fat activation and inflammatory markers.',
        scientificReference: 'Journal of Clinical Medicine (2022) - "The Effects of Cold Exposure on Human Health: A Systematic Review" - DOI: 10.3390/jcm11030820'
      },
      {
        id: '2',
        text: 'Consuming green tea extract can significantly increase fat oxidation during exercise, leading to enhanced weight loss results when combined with regular physical activity. Studies show up to 17% increase in fat burning during moderate-intensity exercise.',
        category: 'Nutrition',
        verificationStatus: 'Verified',
        trustScore: 88,
        date: new Date().toISOString(),
        analysis: 'Multiple controlled trials have demonstrated that green tea catechins, particularly EGCG, can enhance fat oxidation during exercise. The combination of caffeine and catechins appears to have a synergistic effect on metabolism.',
        scientificReference: 'American Journal of Clinical Nutrition (2023) - "Green Tea Extract and Exercise Metabolism: A Meta-Analysis" - DOI: 10.1093/ajcn/nqy123'
      },
      {
        id: '3',
        text: 'Intermittent fasting for 16 hours daily can enhance cellular repair processes through autophagy, potentially extending lifespan and improving metabolic health markers. Research indicates significant improvements in insulin sensitivity and inflammatory markers after 12 weeks.',
        category: 'Nutrition',
        verificationStatus: 'Verified',
        trustScore: 85,
        date: new Date().toISOString(),
        analysis: 'Clinical studies support the benefits of intermittent fasting on cellular repair and metabolic health. The 16:8 fasting pattern has shown particular promise in improving various biomarkers of health.',
        scientificReference: 'Cell Metabolism (2023) - "Effects of Intermittent Fasting on Health, Aging, and Disease" - DOI: 10.1016/j.cmet.2023.06.018'
      },
      {
        id: '4',
        text: 'High-intensity interval training (HIIT) is more effective for fat loss than steady-state cardio, with studies showing up to 28.5% greater reduction in total fat mass over 12 weeks. Additionally, HIIT improves VO2 max and insulin sensitivity more effectively than traditional cardio.',
        category: 'Exercise',
        verificationStatus: 'Verified',
        trustScore: 90,
        date: new Date().toISOString(),
        analysis: 'Comprehensive research supports the superior effectiveness of HIIT for fat loss and cardiovascular fitness improvements. The time-efficient nature and metabolic benefits are well-documented across multiple studies.',
        scientificReference: 'Journal of Sports Medicine (2023) - "Comparative Effects of HIIT vs Steady-State Exercise: A Meta-Analysis" - DOI: 10.1007/s40279-023-01785-5'
      },
      {
        id: '5',
        text: 'Taking vitamin D supplements can prevent all types of viral infections and completely boost immune system function, making you resistant to colds and flu. A daily dose of 5000 IU is claimed to provide complete protection against viral infections.',
        category: 'Supplements',
        verificationStatus: 'Debunked',
        trustScore: 35,
        date: new Date().toISOString(),
        analysis: 'This claim significantly overstates the benefits of vitamin D supplementation. While vitamin D does play a role in immune function, it cannot prevent all viral infections. The claimed dose exceeds recommended daily allowances without proven additional benefits.',
        scientificReference: 'The Lancet Infectious Diseases (2023) - "Vitamin D Supplementation and Prevention of Acute Respiratory Infections" - DOI: 10.1016/S1473-3099(23)00023-4'
      }
    ]
  },
  'Andrew Huberman': {
    name: 'Andrew Huberman',
    bio: 'Stanford Professor of Neurobiology and Ophthalmology, focusing on neural development, brain plasticity, and neural regeneration. Host of the Huberman Lab Podcast.',
    trustScore: 94,
    category: 'Neuroscience & Health',
    followers: 4200000,
    yearlyRevenue: '$5.0M',
    claims: [
      {
        id: '1',
        text: 'Viewing sunlight within 30-60 minutes of waking enhances cortisol release and helps regulate circadian rhythm. Morning sunlight exposure, particularly through the eyes (without looking directly at the sun), can improve sleep quality and daytime alertness.',
        category: 'Sleep',
        verificationStatus: 'Verified',
        trustScore: 92,
        date: new Date().toISOString(),
        analysis: 'Research strongly supports the role of morning light exposure in circadian rhythm regulation. The timing and intensity of light exposure have been shown to significantly impact cortisol levels and sleep-wake cycles.',
        scientificReference: 'Nature Neuroscience (2023) - "Light Exposure Patterns and Circadian Rhythm Regulation" - DOI: 10.1038/nn.4923'
      },
      {
        id: '2',
        text: 'Cold exposure improves immune function and metabolism through norepinephrine release and brown fat activation. Regular cold exposure can increase metabolic rate by up to 350% during exposure.',
        category: 'Health',
        verificationStatus: 'Questionable',
        trustScore: 75,
        date: new Date().toISOString(),
        analysis: 'While cold exposure does activate brown fat and increase metabolism temporarily, the long-term immune benefits are still under investigation. The metabolic increase claims may be overstated.',
        scientificReference: 'Cell Metabolism (2023) - "Brown Adipose Tissue Activation by Cold Exposure" - DOI: 10.1016/j.cmet.2023.02.015'
      },
      {
        id: '3',
        text: 'Specific breathing patterns can alter autonomic nervous system function, with physiological breathing exercises showing measurable effects on heart rate variability, stress response, and cognitive performance.',
        category: 'Mental Health',
        verificationStatus: 'Verified',
        trustScore: 88,
        date: new Date().toISOString(),
        analysis: 'Multiple studies confirm the impact of controlled breathing on autonomic function. The mechanisms are well-documented and the effects are reproducible across different populations.',
        scientificReference: 'Frontiers in Neural Circuits (2023) - "Respiratory-Neural Circuit Interactions" - DOI: 10.3389/fncir.2023.12345'
      }
    ]
  },
  'Dr. Peter Attia': {
    name: 'Dr. Peter Attia',
    bio: 'Physician focusing on the science of longevity. Host of The Drive podcast, specializing in performance optimization and lifespan extension.',
    trustScore: 92,
    category: 'Longevity & Performance',
    followers: 1200000,
    yearlyRevenue: '$4.2M',
    claims: [
      {
        id: '1',
        text: 'Zone 2 cardio training improves mitochondrial function and longevity by increasing mitochondrial density and efficiency. Research shows consistent Zone 2 training can improve metabolic flexibility and reduce all-cause mortality risk by up to 25%.',
        category: 'Exercise',
        verificationStatus: 'Verified',
        trustScore: 95,
        date: new Date().toISOString(),
        analysis: 'Extensive research supports the benefits of Zone 2 training on mitochondrial function and longevity. The metabolic adaptations are well-documented in both athletic and general populations.',
        scientificReference: 'Journal of Applied Physiology (2023) - "Long-term Effects of Zone 2 Training on Mitochondrial Function" - DOI: 10.1152/jappl.2023.00123'
      }
    ]
  },
  'Dr. Rhonda Patrick': {
    name: 'Dr. Rhonda Patrick',
    bio: 'Expert in aging, cancer, and nutrition. Founder of Found My Fitness, focusing on the impact of micronutrients on health.',
    trustScore: 91,
    category: 'Nutrition & Aging',
    followers: 985000,
    yearlyRevenue: '$2.8M',
    claims: [
      {
        id: '1',
        text: 'Sulforaphane from cruciferous vegetables activates the NRF2 pathway, leading to enhanced antioxidant production and cellular defense mechanisms. Regular consumption can increase glutathione levels by up to 300% and reduce inflammatory markers.',
        category: 'Nutrition',
        verificationStatus: 'Verified',
        trustScore: 94,
        date: new Date().toISOString(),
        analysis: 'Molecular studies consistently demonstrate sulforaphane\'s role in NRF2 activation. The downstream effects on antioxidant production and cellular protection are well-established.',
        scientificReference: 'Proceedings of the National Academy of Sciences (2023) - "Sulforaphane-Mediated NRF2 Activation and Cellular Defense" - DOI: 10.1073/pnas.2023456118'
      }
    ]
  }
};

// Helper function to normalize names for comparison
function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .replace(/^dr\.?\s+/, '') // Remove "Dr." or "Dr" prefix
    .replace(/[^a-z0-9]/g, ' ') // Replace non-alphanumeric with spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
}

export async function analyzeInfluencer(
  influencerName: string,
  timeRange: string,
  claimsToAnalyze: number
): Promise<AnalysisResult> {
  try {
    if (!influencerName) {
      throw new Error('Influencer name is required');
    }

    console.log('Analyzing influencer:', influencerName);
    const normalizedSearchName = normalizeNameForComparison(influencerName);

    // First, check the database
    const dbInfluencer = await Influencer.findOne({ 
      normalizedName: normalizedSearchName 
    });

    // If found in database and less than 1 week old, return it
    if (dbInfluencer && 
        (Date.now() - dbInfluencer.lastUpdated.getTime()) < 7 * 24 * 60 * 60 * 1000) {
      console.log('Found recent data in database');
      return {
        id: dbInfluencer._id.toString(),
        name: dbInfluencer.name,
        bio: dbInfluencer.bio,
        category: dbInfluencer.category,
        trustScore: dbInfluencer.trustScore,
        followers: dbInfluencer.followers,
        yearlyRevenue: dbInfluencer.yearlyRevenue,
        claims: dbInfluencer.claims
      };
    }

    // Then check mock data
    for (const [key, data] of Object.entries(mockInfluencers)) {
      if (key === 'unknown') continue;
      
      if (normalizeNameForComparison(key) === normalizedSearchName || 
          normalizeNameForComparison(data.name || '') === normalizedSearchName) {
        console.log('Found in mock data, saving to database:', key);
        const mockData = {
          ...data as AnalysisResult,
          normalizedName: normalizedSearchName,
          lastUpdated: new Date(),
          id: undefined
        };
        
        // Save mock data to database
        const influencer = new Influencer(mockData);
        await influencer.save();
        
        return {
          ...mockData,
          id: influencer._id.toString()
        };
      }
    }

    // If not found, try API
    console.log('Not found in database or mock data, attempting API call...');

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    if (!perplexityApiKey) {
      console.log('No API key found, falling back to unknown influencer');
      return {
        ...mockInfluencers['unknown'] as AnalysisResult,
        id: Math.random().toString(36).substring(7)
      };
    }

    try {
      console.log('Making API call with key:', perplexityApiKey.substring(0, 10) + '...');
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: "sonar-pro",
          messages: [{
            role: "system",
            content: "You are a precise JSON generator that analyzes health influencers. Focus on extracting multiple evidence-based claims with proper scientific references. Output only valid JSON without any additional text or reasoning."
          }, {
            role: "user",
            content: `Analyze ${influencerName} and output a JSON object with these exact fields (no additional commentary). Include at least 3-5 significant claims:
{
  "name": "full name",
  "bio": "short bio focusing on credentials",
  "category": "main health category",
  "trustScore": number between 0-100,
  "followers": estimated follower count,
  "yearlyRevenue": "estimated yearly revenue with $ prefix",
  "claims": [
    {
      "id": "1",
      "text": "specific health claim with quantifiable results if possible",
      "category": "Mental Health | Nutrition | Exercise | Sleep | Wellness",
      "verificationStatus": "Verified" or "Questionable" or "Debunked",
      "trustScore": number between 0-100,
      "date": "2024-02-16T00:00:00.000Z",
      "analysis": "concise scientific analysis with focus on evidence quality",
      "scientificReference": "Journal Name (Year) - Full Paper Title - DOI number"
    },
    {
      "id": "2",
      "text": "another specific health claim",
      "category": "choose from categories above",
      "verificationStatus": "Verified" or "Questionable" or "Debunked",
      "trustScore": number between 0-100,
      "date": "2024-02-16T00:00:00.000Z",
      "analysis": "concise scientific analysis",
      "scientificReference": "Journal Name (Year) - Full Paper Title - DOI number"
    }
  ]
}`
          }],
          max_tokens: 4000,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);
      console.log('API Response Data:', JSON.stringify(response.data, null, 2));

      if (!response.data?.choices?.[0]?.message?.content) {
        console.log('Invalid API response format, falling back to unknown influencer');
        return {
          ...mockInfluencers['unknown'] as AnalysisResult,
          id: Math.random().toString(36).substring(7)
        };
      }

      try {
        const aiResponse = JSON.parse(response.data.choices[0].message.content);
        console.log('Successfully parsed AI response');
        
        // Validate the required fields
        if (!aiResponse.name || !aiResponse.bio || !aiResponse.category || 
            !aiResponse.trustScore || !aiResponse.followers || 
            !aiResponse.yearlyRevenue || !Array.isArray(aiResponse.claims)) {
          console.log('Missing required fields in API response, falling back to unknown influencer');
          return {
            ...mockInfluencers['unknown'] as AnalysisResult,
            id: Math.random().toString(36).substring(7)
          };
        }

        // After successful API call, save to database
        console.log('Saving API response to database');
        const influencer = new Influencer({
          ...aiResponse,
          normalizedName: normalizedSearchName,
          lastUpdated: new Date()
        });
        await influencer.save();
        
        return {
          ...aiResponse,
          id: influencer._id.toString()
        };
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        return {
          ...mockInfluencers['unknown'] as AnalysisResult,
          id: Math.random().toString(36).substring(7)
        };
      }
    } catch (error: any) {
      console.error('Error in API call:', error);
      return {
        ...mockInfluencers['unknown'] as AnalysisResult,
        id: Math.random().toString(36).substring(7)
      };
    }
  } catch (error: any) {
    console.error('Error in analyzeInfluencer:', error);
    return {
      ...mockInfluencers['unknown'] as AnalysisResult,
      id: Math.random().toString(36).substring(7)
    };
  }
} 