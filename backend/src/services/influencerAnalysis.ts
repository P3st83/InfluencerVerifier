import axios from 'axios';
import { Types, Document } from 'mongoose';
import { Request, Response } from 'express';
import { Influencer, IInfluencer } from '../models/Influencer';
import type { HealthClaim } from '../models/Influencer';

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
      },
      {
        id: '2',
        text: 'Proper sleep hygiene and maintaining consistent sleep-wake cycles can significantly reduce the risk of neurodegenerative diseases and improve cognitive performance.',
        category: 'Sleep',
        verificationStatus: 'Verified',
        trustScore: 92,
        date: new Date().toISOString(),
        analysis: 'Multiple longitudinal studies have demonstrated the neuroprotective effects of quality sleep and consistent circadian rhythms.',
        scientificReference: 'Nature Neuroscience (2023) - "Sleep Quality and Neurodegenerative Disease Prevention" - DOI: 10.1038/nn.2023.789'
      },
      {
        id: '3',
        text: 'Rapamycin has potential life-extension properties through mTOR pathway modulation, but its use as a longevity drug requires careful medical supervision.',
        category: 'Longevity',
        verificationStatus: 'Questionable',
        trustScore: 78,
        date: new Date().toISOString(),
        analysis: 'While animal studies show promising results, human data on rapamycin for longevity is still limited. Safety concerns and optimal dosing need further research.',
        scientificReference: 'Cell Metabolism (2023) - "Rapamycin in Human Longevity: Current Evidence" - DOI: 10.1016/j.cmet.2023.05.012'
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
      },
      {
        id: '2',
        text: 'Heat stress through sauna use can increase heat shock proteins and provide cardiovascular benefits similar to moderate exercise.',
        category: 'Wellness',
        verificationStatus: 'Verified',
        trustScore: 89,
        date: new Date().toISOString(),
        analysis: 'Clinical studies support the cardiovascular and cellular stress response benefits of regular sauna use.',
        scientificReference: 'JAMA Internal Medicine (2023) - "Cardiovascular and Molecular Effects of Heat Exposure" - DOI: 10.1001/jamainternmed.2023.4567'
      },
      {
        id: '3',
        text: 'Omega-3 fatty acids, particularly DHA, are crucial for brain development and may prevent cognitive decline in aging populations.',
        category: 'Nutrition',
        verificationStatus: 'Verified',
        trustScore: 92,
        date: new Date().toISOString(),
        analysis: 'Extensive research supports the role of DHA in neurodevelopment and neuroprotection.',
        scientificReference: 'Nature Reviews Neuroscience (2023) - "Omega-3 Fatty Acids in Brain Health" - DOI: 10.1038/nrn.2023.789'
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
  timeRange?: string,
  claimsToAnalyze?: number
): Promise<AnalysisResult | { error: string }> {
  console.log(`Analyzing influencer: ${influencerName}`);
  const normalizedSearchName = normalizeNameForComparison(influencerName);
  console.log(`Using normalized name for search: ${normalizedSearchName}`);

  try {
    // Check database for existing data
    console.log('Checking database for existing data...');
    const dbInfluencer = await Influencer.findOne<IInfluencer>({ normalizedName: normalizedSearchName });
    
    if (dbInfluencer) {
      console.log('Database check result: Found');
      const age = (new Date().getTime() - dbInfluencer.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
      
      if (age < 7) {
        console.log('Returning recent data from database (less than 7 days old)');
        return {
          id: dbInfluencer._id.toString(),
          name: dbInfluencer.name,
          trustScore: dbInfluencer.trustScore,
          claims: dbInfluencer.claims,
          category: dbInfluencer.category,
          followers: dbInfluencer.followers,
          yearlyRevenue: dbInfluencer.yearlyRevenue,
          bio: dbInfluencer.bio
        };
      }
      console.log('Data is older than 7 days, fetching new data');
    } else {
      console.log('No existing data found in database');
    }

    // Call Perplexity API for analysis
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not found');
    }

    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "sonar-pro",
        messages: [{
          role: "system",
          content: `You are an AI system analyzing health influencers. For the given influencer, find and analyze their recent health claims, focusing on scientific accuracy and evidence-based verification. Return a JSON object with the analysis results.`
        }, {
          role: "user",
          content: `Analyze the health influencer "${influencerName}" and their recent claims. Focus on the last ${timeRange || 'month'}.
          
          Return ONLY a JSON object in this format:
          {
            "name": "Full Name",
            "bio": "Brief professional description",
            "category": "Specialization area",
            "trustScore": number (0-100),
            "followers": number,
            "yearlyRevenue": "Estimated yearly revenue",
            "claims": [{
              "id": "unique_id",
              "text": "The claim statement",
              "category": "Claim category",
              "verificationStatus": "Verified" | "Questionable" | "Debunked",
              "trustScore": number (0-100),
              "date": "YYYY-MM-DD",
              "analysis": "Detailed analysis",
              "scientificReference": "Journal reference with DOI"
            }]
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

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    try {
      const result = JSON.parse(response.data.choices[0].message.content);
      
      // Check if the API returned an error message
      if (typeof result === 'string' && result.toLowerCase().includes('apologize')) {
        return {
          error: result
        };
      }

      // Validate the response format
      if (!result.name || !result.category || !Array.isArray(result.claims)) {
        throw new Error('Invalid response format from API');
      }

      // Save to database
      const influencer = new Influencer({
        name: result.name,
        normalizedName: normalizeNameForComparison(result.name),
        bio: result.bio,
        category: result.category,
        trustScore: result.trustScore,
        followers: result.followers,
        yearlyRevenue: result.yearlyRevenue,
        claims: result.claims,
        lastUpdated: new Date()
      });

      await influencer.save();
      
      return result;
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      if (response.data.choices[0].message.content.includes('apologize')) {
        return {
          error: response.data.choices[0].message.content
        };
      }
      throw new Error('Failed to parse API response');
    }
  } catch (error: any) {
    console.error('Error in analyzeInfluencer:', error);
    return {
      error: error.message || 'Failed to analyze influencer'
    };
  }
} 