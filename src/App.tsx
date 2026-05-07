/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Pipelines } from './pages/Pipelines';
import { Capture } from './pages/Capture';
import { Records } from './pages/Records';
import { Settings } from './pages/Settings';
import { Page } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('pipelines');

  const renderPage = () => {
    switch (activePage) {
      case 'pipelines':
        return <Pipelines key="pipelines" />;
      case 'capture':
        return <Capture key="capture" />;
      case 'records':
        return <Records key="records" />;
      case 'settings':
        return <Settings key="settings" />;
      default:
        return <Pipelines key="pipelines" />;
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-secondary/30">
      <div className="mesh-bg" />
      <Header 
        activePage={activePage} 
        onBack={() => setActivePage('pipelines')} 
      />
      
      <main className="pt-20 px-6 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      <BottomNav 
        activePage={activePage} 
        onPageChange={setActivePage} 
      />
    </div>
  );
}
