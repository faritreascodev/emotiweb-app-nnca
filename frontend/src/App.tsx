import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { LoginScreen } from './components/screens/LoginScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { GameWrapper } from './components/games/GameWrapper.tsx';
import { ParentScreen } from './components/screens/ParentScreen';
import { Navbar } from './components/layout/Navbar';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useGame();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1c2c] text-white">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🐻</div>
          <p className="text-2xl font-display text-purple-200">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 pb-8 min-h-screen">
        {children}
      </div>
    </>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
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
        <ProtectedRoute>
          <ParentScreen />
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
