import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import JobDescriptions from './pages/JobDescriptions';
import CreateJobDescription from './pages/CreateJobDescription';
import Candidates from './pages/Candidates';
import ApplyJob from './pages/ApplyJob';
import ReviewDashboard from './pages/ReviewDashboard';
import { colors, spacing } from './styles/tokens';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: colors.bg.page }}>
        <Navbar />
        <div style={{ padding: spacing.xl, maxWidth: 1280, margin: '0 auto' }}>
          <Routes>
            <Route path="/"          element={<JobDescriptions />} />
            <Route path="/create"    element={<CreateJobDescription />} />
            <Route path="/jobs/:id"  element={<Candidates />} />
            <Route path="/apply"     element={<ApplyJob />} />
            <Route path="/dashboard" element={<ReviewDashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}