import React from 'react';
import { AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Pipelines } from './pages/Pipelines';
import { Capture } from './pages/Capture';
import { Records } from './pages/Records';
import { Settings } from './pages/Settings';
import { Page } from './types';

const getActivePage = (pathname: string): Page => {
  switch (pathname) {
    case '/capture':
      return 'capture';
    case '/records':
      return 'records';
    case '/settings':
      return 'settings';
    default:
      return 'pipelines';
  }
};

function AppContent() {
  const location = useLocation();
  const activePage = getActivePage(location.pathname);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-secondary/30">
      <div className="mesh-bg" />
      <Header activePage={activePage} />

      <main className="pt-20 px-6 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Pipelines />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/records" element={<Records />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AnimatePresence>
      </main>

      <BottomNav activePage={activePage} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
