import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner@2.0.3';
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
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
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
            <Route path="*" element={<Navigate to="/" replace />} />
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
