import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { GameWrapper } from './components/games/GameWrapper';
import { ParentScreen } from './components/screens/ParentScreen';
import { AdminDashboard } from './components/screens/AdminDashboard';
import { Navbar } from './components/layout/Navbar';
import { motion } from 'framer-motion';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'estudiante' | 'padre' | 'admin' }) {
  const { isAuthenticated, loading, user } = useGame();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1c2c] text-white">
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-8xl mb-8 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            🐻
          </motion.div>
          <p className="text-3xl font-black italic tracking-tight text-white/80">Cargando tu aventura...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.tipo !== requiredRole && user?.tipo !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-28 px-4 pb-12 min-h-screen">
        {children}
      </div>
    </>
  );
}

function LoginRedirect() {
  const { isAuthenticated, loading } = useGame();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <LoginScreen />;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route path="/" element={
        <ProtectedRoute>
          <HomeScreen />
        </ProtectedRoute>
      } />

      <Route path="/game/:gameId" element={
        <ProtectedRoute>
          <GameWrapper />
        </ProtectedRoute>
      } />

      <Route path="/parent" element={
        <ProtectedRoute requiredRole="padre">
          <ParentScreen />
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
