import { useState } from 'react';
import { BeakerIcon, ArrowPathIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface VerificationResult {
  claimId: string;
  status: 'Verified' | 'Questionable' | 'Debunked';
  confidence: number;
  supportingEvidence: string;
  journalReferences: string[];
}

const AVAILABLE_JOURNALS = [
  // Top Medical Journals
  'The New England Journal of Medicine',
  'The Lancet',
  'JAMA Network',
  'BMJ (British Medical Journal)',
  'Nature Medicine',
  // General Science Journals
  'Nature',
  'Science',
  'Cell',
  // Research Databases
  'PubMed Central',
  'Cochrane Library',
  'Web of Science',
  // Specialty Journals
  'American Journal of Clinical Nutrition',
  'Journal of Clinical Endocrinology & Metabolism',
  'Diabetes Care',
  'Circulation',
  // Public Health Journals
  'American Journal of Public Health',
  'WHO Bulletin',
  'CDC Emerging Infectious Diseases',
  // Mental Health Journals
  'JAMA Psychiatry',
  'Journal of Clinical Psychology'
];

export default function VerifyClaim() {
  const [claims, setClaims] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [selectedJournals, setSelectedJournals] = useState<string[]>([
    'The New England Journal of Medicine',
    'The Lancet',
    'Nature Medicine',
    'PubMed Central',
    'Cochrane Library'
  ]);

  const handleSelectAll = () => {
    setSelectedJournals([...AVAILABLE_JOURNALS]);
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

  const addClaim = () => {
    if (claims.length < 3) {
      setClaims([...claims, '']);
    }
  };

  const removeClaim = (index: number) => {
    const newClaims = claims.filter((_, i) => i !== index);
    setClaims(newClaims);
  };

  const updateClaim = (index: number, value: string) => {
    const newClaims = [...claims];
    newClaims[index] = value;
    setClaims(newClaims);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validClaims = claims.filter(claim => claim.trim());
    
    if (validClaims.length === 0) {
      setError('Please enter at least one health claim to verify');
      return;
    }

    if (selectedJournals.length === 0) {
      setError('Please select at least one scientific journal');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiUrl}/api/verify-claims`, {
        claims: validClaims,
        journals: selectedJournals
      });

      setResults(response.data);
    } catch (err: any) {
      console.error('Error verifying claims:', err);
      setError(err.response?.data?.error || 'Failed to verify claims. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white">Verify Health Claims</h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter up to three health claims to verify them against scientific journals and research papers.
            </p>
          </div>

          {/* Claims Input Form */}
          <form onSubmit={handleSubmit} className="card">
            <div className="space-y-6">
              <div className="space-y-4">
                {claims.map((claim, index) => (
                  <div key={index} className="relative">
                    <label className="block text-sm font-medium text-gray-400">
                      Health Claim {index + 1}
                    </label>
                    <div className="mt-2 flex items-start space-x-2">
                      <textarea
                        rows={3}
                        value={claim}
                        onChange={(e) => updateClaim(index, e.target.value)}
                        placeholder="Enter a health claim to verify"
                        className="flex-1 rounded-lg bg-navy border-navy-light p-3 text-white"
                      />
                      {claims.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeClaim(index)}
                          className="p-2 text-gray-400 hover:text-white"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {claims.length < 3 && (
                  <button
                    type="button"
                    onClick={addClaim}
                    className="flex items-center space-x-2 text-accent-green hover:text-accent-green/80"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Another Claim</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Scientific Journals to Check ({selectedJournals.length} selected)
                </label>
                <div className="flex justify-end space-x-4 mb-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-accent-green hover:text-accent-green/80"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-sm text-gray-400 hover:text-gray-300"
                  >
                    Deselect All
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {AVAILABLE_JOURNALS.map((journal) => (
                    <button
                      key={journal}
                      type="button"
                      onClick={() => toggleJournal(journal)}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedJournals.includes(journal)
                          ? 'bg-accent-green/20 border border-accent-green'
                          : 'bg-navy-light border border-navy-light hover:border-accent-green/50'
                      }`}
                    >
                      <span className="text-sm text-white">{journal}</span>
                      <div className={`w-4 h-4 rounded-full border ${
                        selectedJournals.includes(journal)
                          ? 'bg-accent-green border-accent-green'
                          : 'border-gray-500'
                      }`}>
                        {selectedJournals.includes(journal) && (
                          <div className="w-full h-full rounded-full bg-accent-green" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || selectedJournals.length === 0}
                  className={`btn-primary ${
                    (loading || selectedJournals.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Verifying Claims...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <BeakerIcon className="mr-2 h-5 w-5" />
                      Verify Claims
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              {results.map((result, index) => (
                <div key={result.claimId} className="card">
                  <h2 className="text-lg font-medium text-white mb-4">
                    Verification Results - Claim {index + 1}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Status</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          result.status === 'Verified'
                            ? 'bg-green-100 text-green-800'
                            : result.status === 'Questionable'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Confidence</span>
                      <span className="text-sm text-white">{result.confidence}%</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Supporting Evidence</span>
                      <p className="text-sm text-white whitespace-pre-line">{result.supportingEvidence}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Scientific References</span>
                      <div className="space-y-2">
                        {result.journalReferences.map((reference, refIndex) => {
                          const doiMatch = reference.match(/DOI:\s*(10\.\d{4,}\/[-._;()\/:A-Z0-9]+)/i);
                          const doi = doiMatch ? doiMatch[1] : null;
                          
                          return (
                            <div key={refIndex}>
                              {doi ? (
                                <a
                                  href={`https://doi.org/${doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-accent-green hover:text-accent-green/80 underline"
                                >
                                  {reference}
                                </a>
                              ) : (
                                <p className="text-sm text-white">{reference}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 