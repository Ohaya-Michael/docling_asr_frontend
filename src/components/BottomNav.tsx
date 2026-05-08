import React from 'react';
import { NavLink } from 'react-router-dom';
import { GitFork, Mic, FileText, Settings2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Page } from '@/src/types';

const items = [
  { id: 'pipelines', label: 'Pipelines', icon: GitFork, path: '/' },
  { id: 'capture', label: 'Capture', icon: Mic, path: '/capture' },
  { id: 'records', label: 'Records', icon: FileText, path: '/records' },
  // { id: 'settings', label: 'Settings', icon: Settings2, path: '/settings' },
] as const;

interface BottomNavProps {
  activePage: Page;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 bg-white/5 backdrop-blur-xl border-t border-white/10 z-50">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === '/'}
            className={cn(
              'flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-300 rounded-xl',
              isActive
                ? 'bg-white/15 text-white shadow-[0_0_20px_rgba(167,139,250,0.3)] scale-105'
                : 'text-white/50 hover:text-white/80 active:scale-90'
            )}
          >
            <Icon className={cn('w-6 h-6 mb-1', isActive ? 'text-secondary' : '')} />
            <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};
