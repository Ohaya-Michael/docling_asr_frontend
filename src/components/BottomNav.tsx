import React from 'react';
import { GitFork, Mic, FileText, Settings2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Page } from '@/src/types';

interface BottomNavProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onPageChange }) => {
  const items = [
    { id: 'pipelines', label: 'Pipelines', icon: GitFork },
    { id: 'capture', label: 'Capture', icon: Mic },
    { id: 'records', label: 'Records', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 bg-white/5 backdrop-blur-xl border-t border-white/10 z-50">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-300 rounded-xl",
              isActive 
                ? "bg-white/15 text-white shadow-[0_0_20px_rgba(167,139,250,0.3)] scale-105" 
                : "text-white/50 hover:text-white/80 active:scale-90"
            )}
          >
            <Icon className={cn("w-6 h-6 mb-1", isActive ? "text-secondary" : "")} />
            <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
