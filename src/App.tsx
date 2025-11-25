import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { InstallPrompt } from './components/InstallPrompt';
import { NotificationBanner } from './components/NotificationBanner';

import Login from './pages/Login';
import Register from './pages/Register';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { WaterTracker } from './pages/WaterTracker';
import { PeriodTracker } from './pages/PeriodTracker';
import { StudyPlanner } from './pages/StudyPlanner';
import { Motivation } from './pages/Motivation';
import { Settings } from './pages/Settings';

import { registerServiceWorker } from './utils/pwa';

export default function App() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="h-screen w-full overflow-y-auto bg-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/water"
              element={
                <ProtectedRoute>
                  <WaterTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/period"
              element={
                <ProtectedRoute>
                  <PeriodTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/study"
              element={
                <ProtectedRoute>
                  <StudyPlanner />
                </ProtectedRoute>
              }
            />

            <Route
              path="/motivation"
              element={
                <ProtectedRoute>
                  <Motivation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* DEFAULT → LOGIN */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* WILDCARD */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          <Navbar />
          <InstallPrompt />
          <NotificationBanner />
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}
