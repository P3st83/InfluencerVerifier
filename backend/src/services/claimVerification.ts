import axios from 'axios';

interface VerificationResult {
  claimId: string;
  status: 'Verified' | 'Questionable' | 'Debunked';
  confidence: number;
  supportingEvidence?: string;
  journalReferences?: string[];
}

export async function verifyHealthClaims(
  claims: string[],
  journals: string[]
): Promise<VerificationResult[]> {
  try {
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not found');
    }

    const verificationPromises = claims.map(async (claim, index) => {
      try {
        const response = await axios.post(
          'https://api.perplexity.ai/chat/completions',
          {
            model: "sonar-pro",
            messages: [{
              role: "system",
              content: `You are a scientific claim verification system. Analyze health claims against scientific literature and provide evidence-based verification. Focus on peer-reviewed research and clinical studies. Output only valid JSON without additional text.

Response format requirements:
- status must be exactly "Verified", "Questionable", or "Debunked"
- confidence must be a number between 0-100
- supportingEvidence should summarize key findings and methodology
- journalReferences must include full paper titles and DOI numbers`
            }, {
              role: "user",
              content: `Verify this health claim: "${claim}"
              
Check these specific journals and papers: ${journals.join(', ')}

Return ONLY a JSON object in this exact format:
{
  "claimId": "claim_${index + 1}",
  "status": "Verified" | "Questionable" | "Debunked",
  "confidence": number between 0-100,
  "supportingEvidence": "detailed analysis with methodology and key findings",
  "journalReferences": [
    "Journal Name (Year) - Full Paper Title - DOI: 10.xxxx/xxxxx",
    "..."
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

        if (!response.data?.choices?.[0]?.message?.content) {
          throw new Error('Invalid API response format');
        }

        const result = JSON.parse(response.data.choices[0].message.content);
        console.log('Parsed verification result:', result);
        
        // Validate the response format
        if (!result.status || !result.confidence || !result.supportingEvidence || !result.journalReferences) {
          throw new Error('Invalid response format from API');
        }

        return result;
      } catch (error: any) {
        console.error(`Error verifying claim ${index + 1}:`, error);
        throw new Error(`Failed to verify claim: ${error.message}`);
      }
    });

    const results = await Promise.all(verificationPromises);
    return results;
  } catch (error: any) {
    console.error('Error in verifyHealthClaims:', error);
    throw error;
  }
} 