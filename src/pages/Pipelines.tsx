import React from 'react';
import { GitFork, Users, ScanText, Webhook, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const Pipelines: React.FC = () => {
  const sections = [
    {
      id: 'asr',
      label: 'ASR PIPELINE',
      statusColor: 'bg-secondary',
      animate: true,
      pipelines: [
        { title: 'Whisper Model', subtitle: 'WHISPER_TURBO', icon: GitFork, color: 'bg-primary-fixed-dim', iconColor: 'text-primary' },
        // { title: 'Diarization', subtitle: 'Pyannote 3.1 Standard', icon: Users, color: 'bg-primary-fixed-dim', iconColor: 'text-primary' },
      ]
    },
    {
      id: 'ocr',
      label: 'OCR / IMAGE PIPELINE',
      statusColor: 'bg-tertiary-fixed-dim',
      animate: false,
      pipelines: [
        { title: 'OCR Engine', subtitle: 'EasyOCR (GPU Accelerated)', icon: ScanText, color: 'bg-tertiary-fixed', iconColor: 'text-tertiary' },
      ]
    },
    {
      id: 'api',
      label: 'API REQUEST',
      statusColor: 'bg-secondary-fixed-dim',
      animate: true,
      pipelines: [
        { title: 'Webhook Outlet', subtitle: 'https://api.internal.svc/v1', icon: Webhook, color: 'bg-secondary-fixed', iconColor: 'text-secondary' },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pb-32"
    >
      {/* Welcome Hero Section */}
      <section className="mb-8">
        <div className="relative h-48 glass-card overflow-hidden mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent z-10" />
          <img 
            className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 transition-all duration-1000" 
            alt="Dashboard Visualization"
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" 
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
            <p className="font-headline text-xs font-bold text-white/50 mb-1 uppercase tracking-widest">System Overview</p>
            <h2 className="font-headline text-3xl font-light text-white tracking-wide">3 Active Pipelines</h2>
          </div>
        </div>
      </section>

      {/* Pipeline Groups */}
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.id}>
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="font-headline text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                {section.label}
              </span>
              <span className={cn(
                "w-2 h-2 rounded-full",
                section.statusColor,
                section.animate && "status-pulse"
              )} />
            </div>
            
            <div className="flex flex-col gap-4">
              {section.pipelines.map((pipe, idx) => (
                <div 
                  key={idx}
                  className="glass-card p-6 flex items-center justify-between hover:bg-white/10 transition-all active:scale-[0.98] cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-colors")}>
                      <pipe.icon className={cn("w-6 h-6", itemColor(idx, section.id))} />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-white">{pipe.title}</h3>
                      <p className="font-sans text-sm text-white/50 font-medium">{pipe.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed right-6 bottom-28 w-14 h-14 bg-secondary text-white rounded-2xl shadow-[0_0_20px_rgba(167,139,250,0.4)] flex items-center justify-center active:scale-95 hover:scale-110 transition-all z-40 group">
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </motion.div>
  );
};

// Helper for icon colors
const itemColor = (idx: number, section: string) => {
  if (section === 'asr') return 'text-secondary';
  if (section === 'ocr') return 'text-tertiary';
  return 'text-secondary';
};
