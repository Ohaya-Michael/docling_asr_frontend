import React from 'react';
import { Settings2, Bell, Search, MoreVertical, ArrowLeft } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Page } from '@/src/types';

interface HeaderProps {
  activePage: Page;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, onBack }) => {
  const getTitle = () => {
    switch (activePage) {
      case 'pipelines': return 'Precision Transcribe';
      case 'capture': return 'Precision Transcribe';
      case 'records': return 'Precision Transcribe';
      case 'settings': return 'Precision Transcribe';
      default: return 'Precision Transcribe';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 h-16">
      <div className="flex justify-between items-center px-6 h-full w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {activePage === 'settings' && (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors active:scale-95 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Settings2 className="w-6 h-6 text-secondary" />
          <h1 className="font-headline text-lg font-bold text-white tracking-tight">{getTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-1">
          {activePage === 'records' && (
             <button className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-95">
              <Search className="w-5 h-5 text-white/60" />
            </button>
          )}
          {activePage === 'pipelines' ? (
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-95">
              <Bell className="w-5 h-5 text-white/60" />
            </button>
          ) : (
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-95">
              <MoreVertical className="w-5 h-5 text-white/60" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
