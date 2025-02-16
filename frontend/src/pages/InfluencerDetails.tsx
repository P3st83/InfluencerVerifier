import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChartBarIcon, BeakerIcon, ShoppingBagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Claim {
  id: string;
  text: string;
  category: string;
  verificationStatus: 'Verified' | 'Questionable' | 'Debunked';
  trustScore: number;
  date: string;
  analysis?: string;
  scientificReference?: string;
}

interface InfluencerData {
  id: string;
  name: string;
  bio: string;
  profileImage?: string;
  trustScore: number;
  yearlyRevenue: string;
  products?: number;
  followers?: number;
  category: string;
  claims: Claim[];
}

// Helper function to normalize names for comparison
function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .replace(/^dr\.?\s+/, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function extractDOILink(reference: string): { text: string; doi: string | null } {
  const doiMatch = reference.match(/DOI:\s*([\d\.]+\/[a-zA-Z0-9\.-]+)/);
  const doi = doiMatch ? doiMatch[1] : null;
  return {
    text: reference,
    doi: doi
  };
}

function getJournalUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}

export default function InfluencerDetails() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [influencer, setInfluencer] = useState<InfluencerData | null>(null);

  useEffect(() => {
    const fetchInfluencerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!name) {
          throw new Error('Influencer name is required');
        }

        // Convert from URL format back to original name format
        const decodedName = decodeURIComponent(name)
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        console.log('Searching for influencer:', decodedName);
        
        const response = await axios.post('http://localhost:3001/api/analyze-influencer', {
          influencerName: decodedName,
          timeRange: 'Last Month',
          claimsToAnalyze: 50
        });

        // Only set error if it's truly unknown
        if (response.data.name === 'Unknown Influencer' && 
            normalizeNameForComparison(decodedName) !== normalizeNameForComparison('Unknown Influencer')) {
          setError(`Could not find influencer "${decodedName}". Please try another name.`);
          return;
        }

        // Log the response data for debugging
        console.log('Response data:', response.data);

        setInfluencer(response.data);
      } catch (err: any) {
        console.error('Error fetching influencer data:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Failed to load influencer data. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencerData();
  }, [name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-accent-green text-white rounded hover:bg-accent-green/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">No Data Found</h2>
          <p className="text-gray-400">Could not find data for this influencer.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-accent-green text-white rounded hover:bg-accent-green/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const categories = ['All', ...new Set(influencer.claims.map(claim => claim.category))];

  const filteredClaims = influencer.claims.filter(claim => {
    if (selectedCategory !== 'All' && claim.category !== selectedCategory) return false;
    if (verificationFilter !== 'all' && claim.verificationStatus.toLowerCase() !== verificationFilter) return false;
    return true;
  });

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.trustScore - a.trustScore;
  });

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="sm:flex sm:items-center sm:space-x-8">
          <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
            {influencer.profileImage ? (
              <img 
                src={influencer.profileImage} 
                alt={influencer.name} 
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-navy-light" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">{influencer.name || 'Unknown Influencer'}</h1>
            <p className="text-sm text-gray-400">{influencer.bio}</p>
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-navy-light px-3 py-0.5 text-sm font-medium text-gray-300">
                {influencer.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-accent-green" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-400">Trust Score</p>
              <p className="text-2xl font-bold text-white">{influencer.trustScore}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-6 w-6 text-accent-green" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-400">Total Following</p>
              <p className="text-2xl font-bold text-white">
                {influencer.followers ? 
                  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(influencer.followers) + '+' 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingBagIcon className="h-6 w-6 text-accent-green" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-400">Products</p>
              <p className="text-2xl font-bold text-white">{influencer.products || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BeakerIcon className="h-6 w-6 text-accent-green" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-400">Yearly Revenue</p>
              <p className="text-2xl font-bold text-white">{influencer.yearlyRevenue || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-gray-700 pb-5">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-white">Claims Analysis</h3>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <div className="flex space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="questionable">Questionable</option>
                  <option value="debunked">Debunked</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="date">Sort by Date</option>
                  <option value="trust">Sort by Trust Score</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="space-y-4">
                {sortedClaims.map((claim) => (
                  <div key={claim.id} className="rounded-lg bg-navy-light p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">{claim.category}</p>
                          <p className="text-base font-medium text-white">{claim.text}</p>
                        </div>
                        
                        {claim.analysis && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Analysis:</p>
                            <p className="text-sm text-gray-400">{claim.analysis}</p>
                          </div>
                        )}
                        
                        {claim.scientificReference && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Scientific Reference:</p>
                            {(() => {
                              const { text, doi } = extractDOILink(claim.scientificReference);
                              return doi ? (
                                <a 
                                  href={getJournalUrl(doi)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-accent-green hover:text-accent-green/80 underline"
                                >
                                  {text}
                                </a>
                              ) : (
                                <p className="text-sm text-accent-green">{text}</p>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            claim.verificationStatus === 'Verified'
                              ? 'bg-green-100 text-green-800'
                              : claim.verificationStatus === 'Questionable'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {claim.verificationStatus}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        Trust Score: {claim.trustScore}%
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(claim.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 