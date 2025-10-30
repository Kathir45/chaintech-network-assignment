import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function AppContent() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return showRegister ? (
      <Register onNavigateToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onNavigateToRegister={() => setShowRegister(true)} />
    );
  }

  if (showAdminDashboard) {
    return <AdminDashboard onNavigateToProfile={() => setShowAdminDashboard(false)} />;
  }

  return <Profile onNavigateToAdmin={() => setShowAdminDashboard(true)} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
