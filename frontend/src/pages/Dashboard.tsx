import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Influencer {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  trend: 'up' | 'down' | 'stable';
  followers?: number;
  verifiedClaims: number;
}

const INITIAL_INFLUENCERS = [
  'Andrew Huberman',
  'Dr. Peter Attia',
  'Dr. Rhonda Patrick'
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [stats, setStats] = useState({
    totalInfluencers: 0,
    totalClaims: 0,
    averageScore: 0
  });

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all influencers from the database
        const response = await axios.get('http://localhost:3001/api/influencers');
        
        // Create a map to aggregate influencers by normalized name
        const influencerMap = new Map();
        
        response.data.forEach((influencer: any) => {
          const normalizedName = influencer.name.toLowerCase();
          
          if (influencerMap.has(normalizedName)) {
            // If influencer exists, merge their claims
            const existing = influencerMap.get(normalizedName);
            existing.claims = [...existing.claims, ...influencer.claims];
            existing.verifiedClaims = existing.claims.filter((claim: any) => claim.verificationStatus === 'Verified').length;
          } else {
            // If new influencer, add them to the map
            influencerMap.set(normalizedName, {
              id: influencer.id,
              name: influencer.name,
              category: influencer.category,
              trustScore: influencer.trustScore,
              trend: 'up' as const,
              followers: influencer.followers,
              claims: influencer.claims,
              verifiedClaims: influencer.claims.filter((claim: any) => claim.verificationStatus === 'Verified').length
            });
          }
        });

        // Convert map to array and sort by trust score
        const sortedInfluencers = Array.from(influencerMap.values())
          .sort((a: any, b: any) => b.trustScore - a.trustScore);

        setInfluencers(sortedInfluencers);

        // Calculate stats
        const totalInfluencers = sortedInfluencers.length;
        const totalClaims = sortedInfluencers.reduce((acc: number, inf: Influencer) => acc + inf.verifiedClaims, 0);
        const averageScore = Math.round(
          sortedInfluencers.reduce((acc: number, inf: Influencer) => acc + inf.trustScore, 0) / totalInfluencers
        );

        setStats({
          totalInfluencers,
          totalClaims,
          averageScore
        });
      } catch (err) {
        console.error('Error fetching influencers:', err);
        setError('Failed to load influencer data');
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-accent-green" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400">Total Influencers</dt>
                <dd className="text-2xl font-bold text-white">{stats.totalInfluencers}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-accent-green" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400">Claims Analyzed</dt>
                <dd className="text-2xl font-bold text-white">{stats.totalClaims}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-accent-green" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400">Average Trust Score</dt>
                <dd className="text-2xl font-bold text-white">{stats.averageScore}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-white">Influencer Trust Leaderboard</h1>
              <p className="mt-2 text-sm text-gray-400">
                Real-time rankings of health influencers based on scientific accuracy, credibility, and transparency.
              </p>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">Rank</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Influencer</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Category</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Trust Score</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Trend</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Followers</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Verified Claims</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {influencers.map((influencer, index) => (
                      <tr key={influencer.id || index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                          #{index + 1}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <Link 
                            to={`/influencer/${encodeURIComponent(
                              influencer.name
                                .toLowerCase()
                                .replace(/\s+/g, '-')
                            )}`}
                            className="text-accent-green hover:text-accent-green/80 flex items-center gap-3"
                          >
                            <div className="h-8 w-8 rounded-full bg-navy flex items-center justify-center">
                              <span className="text-sm text-accent-green">
                                {influencer.name.split(' ')
                                  .map((word, index) => word.charAt(0))
                                  .join('')}
                              </span>
                            </div>
                            {influencer.name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{influencer.category}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                            {influencer.trustScore}%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {influencer.trend === 'up' ? (
                            <ArrowTrendingUpIcon className="h-5 w-5 text-accent-green" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {influencer.followers 
                            ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(influencer.followers) + '+'
                            : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{influencer.verifiedClaims}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 