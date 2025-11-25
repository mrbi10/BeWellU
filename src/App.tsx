import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
            <Route path="/BeWellU/login" element={<Login />} />
            <Route path="/BeWellU/register" element={<Register />} />

            <Route
              path="/BeWellU/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/BeWellU/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/BeWellU/water"
              element={
                <ProtectedRoute>
                  <WaterTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/BeWellU/period"
              element={
                <ProtectedRoute>
                  <PeriodTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/BeWellU/study"
              element={
                <ProtectedRoute>
                  <StudyPlanner />
                </ProtectedRoute>
              }
            />

            <Route
              path="/BeWellU/motivation"
              element={
                <ProtectedRoute>
                  <Motivation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/BeWellU/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* DEFAULT → LOGIN */}
            <Route path="/" element={<Navigate to="/BeWellU/login" replace />} />

            {/* WILDCARD */}
            <Route path="*" element={<Navigate to="/BeWellU/login" replace />} />
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
