import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResearchConfig() {
  const navigate = useNavigate();
  const [includeRevenue, setIncludeRevenue] = useState(true);
  const [verifyJournals, setVerifyJournals] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last Month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchConfig, setSearchConfig] = useState({
    influencerName: '',
    discoverNew: '',
    claimsToAnalyze: 50,
    productsToFind: 10,
  });
  const [selectedJournals, setSelectedJournals] = useState([
    'PubMed Central',
    'Science',
    'The Lancet',
    'JAMA Network',
    'Nature',
    'Cell',
    'New England Journal of Medicine',
    'Journal of Functional Medicine',
    'Integrative Medicine: A Clinician\'s Journal',
    'Alternative Therapies in Health and Medicine',
    'Journal of Alternative and Complementary Medicine',
    'BMC Complementary Medicine and Therapies',
    'Explore: The Journal of Science and Healing',
    'Functional Foods in Health and Disease',
    'Journal of Clinical Functional Medicine',
    'International Journal of Functional Nutrition',
    'Global Advances in Health and Medicine',
    'Journal of Restorative Medicine',
    'Integrative Medicine Research',
    'Natural Medicine Journal',
    'Environmental Health Perspectives',
    'Nutrients',
    'Journal of Nutrition and Metabolism',
    'Frontiers in Nutrition',
    'American Journal of Lifestyle Medicine'
  ]);

  const timeRanges = ['Last Week', 'Last Month', 'Last Year', 'All Time'];

  const handleSelectAll = () => {
    setSelectedJournals([
      'PubMed Central',
      'Science',
      'The Lancet',
      'JAMA Network',
      'Nature',
      'Cell',
      'New England Journal of Medicine',
      'Journal of Functional Medicine',
      'Integrative Medicine: A Clinician\'s Journal',
      'Alternative Therapies in Health and Medicine',
      'Journal of Alternative and Complementary Medicine',
      'BMC Complementary Medicine and Therapies',
      'Explore: The Journal of Science and Healing',
      'Functional Foods in Health and Disease',
      'Journal of Clinical Functional Medicine',
      'International Journal of Functional Nutrition',
      'Global Advances in Health and Medicine',
      'Journal of Restorative Medicine',
      'Integrative Medicine Research',
      'Natural Medicine Journal',
      'Environmental Health Perspectives',
      'Nutrients',
      'Journal of Nutrition and Metabolism',
      'Frontiers in Nutrition',
      'American Journal of Lifestyle Medicine'
    ]);
  };

  const handleDeselectAll = () => {
    setSelectedJournals([]);
  };

  const toggleJournal = (journal: string) => {
    setSelectedJournals(prev => 
      prev.includes(journal)
        ? prev.filter(j => j !== journal)
        : [...prev, journal]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const influencerNameToSearch = searchConfig.influencerName || searchConfig.discoverNew;
      if (!influencerNameToSearch) {
        throw new Error('Please enter an influencer name');
      }

      const response = await axios.post('http://localhost:3001/api/analyze-influencer', {
        influencerName: influencerNameToSearch,
        timeRange: selectedTimeRange,
        claimsToAnalyze: searchConfig.claimsToAnalyze,
        includeRevenue,
        verifyJournals,
        selectedJournals: verifyJournals ? selectedJournals : [],
        productsToFind: searchConfig.productsToFind
      });

      if (response.data) {
        // Format the name for the URL
        const urlFormattedName = influencerNameToSearch
          .toLowerCase()
          .replace(/\s+/g, '-');

        // Navigate to the influencer details page
        navigate(`/influencer/${encodeURIComponent(urlFormattedName)}`);
      } else {
        throw new Error('No data received from analysis');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze influencer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <nav className="border-b border-navy-light bg-navy-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-xl font-semibold text-white">Research Tasks</h1>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-navy-light rounded-xl p-6">
          <div className="space-y-8">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Research Configuration Section */}
            <div>
              <h2 className="flex items-center space-x-2 text-lg font-medium text-white">
                <span className="bg-accent-green/10 p-2 rounded-lg">
                  <svg className="h-5 w-5 text-accent-green" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Research Configuration</span>
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Specific Influencer</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="influencerName"
                        value={searchConfig.influencerName}
                        onChange={handleInputChange}
                        placeholder="Research a known health influencer by name"
                        className="form-input block w-full rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400">Time Range</label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      {timeRanges.map((range) => (
                        <button
                          key={range}
                          onClick={() => setSelectedTimeRange(range)}
                          type="button"
                          className={range === selectedTimeRange ? 'btn-secondary-active' : 'btn-secondary'}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400">Claims to Analyze Per Influencer</label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="claimsToAnalyze"
                        value={searchConfig.claimsToAnalyze}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        className="form-input block w-full rounded-lg"
                      />
                      <p className="mt-1 text-xs text-gray-500">Recommended: 50-100 claims for comprehensive analysis</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Discover New</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="discoverNew"
                        value={searchConfig.discoverNew}
                        onChange={handleInputChange}
                        placeholder="Find and analyze new health influencers"
                        className="form-input block w-full rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400">Products to Find Per Influencer</label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="productsToFind"
                        value={searchConfig.productsToFind}
                        onChange={handleInputChange}
                        min="0"
                        className="form-input block w-full rounded-lg"
                      />
                      <p className="mt-1 text-xs text-gray-500">Set to 0 to skip product research</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Include Revenue Analysis</h3>
                        <p className="text-xs text-gray-500">Analyze monetization methods and estimate earnings</p>
                      </div>
                      <Switch
                        checked={includeRevenue}
                        onChange={setIncludeRevenue}
                        className={`toggle-switch ${includeRevenue ? 'bg-accent-green' : 'bg-navy'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            includeRevenue ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </Switch>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Verify with Scientific Journals</h3>
                        <p className="text-xs text-gray-500">Cross-reference claims with scientific literature</p>
                      </div>
                      <Switch
                        checked={verifyJournals}
                        onChange={setVerifyJournals}
                        className={`toggle-switch ${verifyJournals ? 'bg-accent-green' : 'bg-navy'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            verifyJournals ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific Journals Section */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Scientific Journals</h3>
                <div className="space-x-4">
                  <button type="button" className="text-xs text-accent-green hover:text-accent-green/80" onClick={handleSelectAll}>Select All</button>
                  <button type="button" className="text-xs text-gray-400 hover:text-gray-300" onClick={handleDeselectAll}>Deselect All</button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {selectedJournals.map((journal) => (
                  <button
                    key={journal}
                    type="button"
                    onClick={() => toggleJournal(journal)}
                    className={`journal-card ${
                      selectedJournals.includes(journal) 
                        ? 'border-accent-green' 
                        : 'border-navy-light hover:border-accent-green'
                    }`}
                  >
                    <span className="text-sm text-white">{journal}</span>
                    <div className={`journal-card-check ${
                      selectedJournals.includes(journal) 
                        ? 'bg-accent-green/20' 
                        : 'bg-accent-green/10'
                    }`} />
                  </button>
                ))}
                <button type="button" className="journal-card text-accent-green border-dashed">
                  <span className="flex items-center">
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Add New Journal
                  </span>
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-sm font-medium text-white">Notes for Research Assistant</h3>
              <div className="mt-2">
                <textarea
                  rows={4}
                  placeholder="Add any specific instructions or focus areas..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Start Research
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
} 