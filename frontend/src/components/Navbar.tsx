import { Link } from 'react-router-dom';
import { BeakerIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BeakerIcon className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">InfluencerVerifier</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link
              to="/research"
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Research
            </Link>
            <Link
              to="/verify-claim"
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Verify Claim
            </Link>
            <Link
              to="/"
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 