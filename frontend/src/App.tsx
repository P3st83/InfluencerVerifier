import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ResearchConfig from './pages/ResearchConfig';
import InfluencerDetails from './pages/InfluencerDetails';
import VerifyClaim from './pages/VerifyClaim';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/research" element={<ResearchConfig />} />
            <Route path="/verify-claim" element={<VerifyClaim />} />
            <Route path="/influencer/:name" element={<InfluencerDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
