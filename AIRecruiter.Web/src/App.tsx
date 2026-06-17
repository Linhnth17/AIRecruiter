import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import JobDescriptions from './pages/JobDescriptions';
import CreateJobDescription from './pages/CreateJobDescription';
import Candidates from './pages/Candidates';
import BulkUpload from './pages/BulkUpload';
import ReviewDashboard from './pages/ReviewDashboard';
import { colors, spacing } from './styles/tokens';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: colors.bg.page }}>
      <Navbar />
      <div style={{ padding: spacing.xl, maxWidth: 1280, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><JobDescriptions /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute allowedRoles={['Admin', 'Recruiter']}>
              <Layout><CreateJobDescription /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute allowedRoles={['Admin', 'Recruiter']}>
              <Layout><BulkUpload /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/candidates" element={
            <ProtectedRoute>
              <Layout><Candidates /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><ReviewDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}