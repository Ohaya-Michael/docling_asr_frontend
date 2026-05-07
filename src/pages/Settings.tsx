import React, { useState } from 'react';
import { Cpu, Languages, FileAudio, Settings2, Save, ChevronDown, Check, Layout } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const Settings: React.FC = () => {
  const [model, setModel] = useState<'turbo' | 'large'>('turbo');
  const [autoDetect, setAutoDetect] = useState(true);
  const [task, setTask] = useState<'transcribe' | 'translate'>('transcribe');
  const [diarization, setDiarization] = useState(false);
  const [vad, setVad] = useState(true);
  const [format, setFormat] = useState<'markdown' | 'json' | 'html' | 'doctags'>('markdown');
  const [doOcr, setDoOcr] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pb-40 space-y-8"
    >
      {/* Header Info */}
      <div className="mb-8">
        <div className="inline-flex items-center px-4 py-1 bg-white/10 text-white rounded-full mb-4 shadow-sm border border-white/10">
          <span className="font-headline text-[9px] font-bold uppercase tracking-[0.3em]">ASR Pipeline Config</span>
        </div>
        <h2 className="font-headline text-3xl font-light text-white mb-2 leading-tight">Configuration Settings</h2>
        <p className="font-sans text-sm text-white/50 font-medium">Fine-tune your transcription engine parameters.</p>
      </div>

      {/* Visual Indicator */}
      <div className="glass-card overflow-hidden shadow-xl aspect-[21/9]">
        <img 
          className="w-full h-full object-cover opacity-50 brightness-110" 
          alt="Technical visualization"
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" 
        />
      </div>

      <div className="space-y-6">
        {/* Output Format Section (New) */}
        <section className="glass-card p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Layout className="w-5 h-5 text-secondary" />
            <h3 className="font-headline text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Transcript Format</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'markdown', label: 'markdown' },
              { id: 'json', label: 'json' },
              { id: 'html', label: 'html' },
              { id: 'doctags', label: 'doctags' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFormat(opt.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl font-mono text-[11px] font-bold tracking-widest transition-all duration-300 border flex items-center gap-2 uppercase",
                  format === opt.id
                    ? "bg-secondary/20 border-secondary/50 text-white shadow-[0_0_15px_rgba(167,139,250,0.2)]"
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60"
                )}
              >
                {opt.label}
                {format === opt.id && <Check className="w-3 h-3 text-secondary" />}
              </button>
            ))}
          </div>
          <p className="mt-4 font-sans text-[10px] text-white/20 font-bold uppercase tracking-widest">Select preferred output schema</p>
        </section>

        {/* Model Selection */}
        <section className="glass-card p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Cpu className="w-5 h-5 text-secondary" />
            <h3 className="font-headline text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Transcription Model</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'turbo', title: 'Whisper Turbo', desc: 'Low latency, optimized for speed.' },
              { id: 'large', title: 'Whisper v3 Large', desc: 'Maximum accuracy, resource intensive.' }
            ].map((item) => (
              <label 
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all duration-300",
                  model === item.id 
                    ? "border-secondary/50 bg-white/10 shadow-[0_0_15px_rgba(167,139,250,0.1)]" 
                    : "border-white/5 hover:bg-white/5"
                )}
                onClick={() => setModel(item.id as any)}
              >
                <div className="flex flex-col">
                  <span className={cn("font-sans text-sm font-bold transition-colors", model === item.id ? "text-white" : "text-white/60")}>
                    {item.title}
                  </span>
                  <span className="font-sans text-xs text-white/30 font-medium tracking-tight">{item.desc}</span>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  model === item.id ? "border-secondary shadow-[0_0_10px_rgba(167,139,250,0.5)]" : "border-white/20"
                )}>
                  {model === item.id && <div className="w-2 h-2 rounded-full bg-secondary" />}
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Technical Language Configuration (from image) */}
        <section className="glass-card p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-0.5 bg-secondary/20 text-secondary rounded-full text-[9px] font-bold uppercase tracking-widest border border-secondary/20">
              asr
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-mono text-sm font-bold text-white mb-2 tracking-tight">asr_options.language</h3>
            <p className="font-sans text-xs text-white/40 font-medium leading-relaxed">
              Pass a language code to skip auto-detection and speed up transcription. Useful when input language is known.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[10px] text-white/30 font-bold uppercase tracking-widest mr-2">Options:</span>
            {[
              { id: 'auto', label: 'auto-detect' },
              { id: 'en', label: 'en' },
              { id: 'de', label: 'de' },
              { id: 'fr', label: 'fr' },
              { id: 'es', label: 'es' },
              { id: 'zh', label: 'zh' },
              { id: 'ja', label: 'ja' },
              { id: 'ar', label: 'ar' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAutoDetect(opt.id === 'auto')}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold transition-all duration-300 border flex items-center gap-1.5",
                  (opt.id === 'auto' ? autoDetect : !autoDetect) // Simple toggle logic for demo
                    ? "bg-secondary/20 border-secondary/50 text-white shadow-[0_0_15px_rgba(167,139,250,0.1)]"
                    : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                )}
              >
                {opt.label}
                {((opt.id === 'auto' && autoDetect) || (opt.id === 'en' && !autoDetect)) && (
                  <Check className="w-3 h-3 text-secondary" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* OCR Technical Configuration (new from image) */}
        <section className="glass-card p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-0.5 bg-tertiary/20 text-tertiary rounded-full text-[9px] font-bold uppercase tracking-widest border border-tertiary/20">
              ocr
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-mono text-sm font-bold text-white mb-2 tracking-tight">PipelineOptions().do_ocr</h3>
            <p className="font-sans text-xs text-white/40 font-medium leading-relaxed">
              Set to False to skip OCR entirely and only extract embedded text — useful for PDFs with selectable text.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[10px] text-white/30 font-bold uppercase tracking-widest mr-2">Options:</span>
            {[
              { id: true, label: 'True' },
              { id: false, label: 'False' }
            ].map((opt) => (
              <button
                key={String(opt.id)}
                onClick={() => setDoOcr(opt.id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg font-mono text-[10px] font-bold transition-all duration-300 border flex items-center gap-1.5",
                  doOcr === opt.id
                    ? "bg-secondary/20 border-secondary/50 text-white shadow-[0_0_15px_rgba(167,139,250,0.1)]"
                    : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                )}
              >
                {opt.label}
                {doOcr === opt.id && (
                  <Check className="w-3 h-3 text-secondary" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Task Type */}
        <section className="glass-card p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <FileAudio className="w-5 h-5 text-secondary" />
            <h3 className="font-headline text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Processing Task</h3>
          </div>
          
          <div className="flex gap-4">
            {[
              { id: 'transcribe', label: 'Transcribe', icon: FileAudio },
              { id: 'translate', label: 'Translate', icon: Languages }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setTask(item.id as any)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center p-6 border transition-all duration-300 rounded-2xl gap-3 active:scale-95",
                  task === item.id 
                    ? "border-secondary/40 bg-white/10 shadow-[0_0_20px_rgba(167,139,250,0.1)]" 
                    : "border-white/5 hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-6 h-6 transition-transform duration-500", task === item.id ? "text-secondary scale-110" : "text-white/30")} />
                <span className={cn("font-headline text-[10px] font-bold transition-colors uppercase tracking-widest", task === item.id ? "text-white" : "text-white/40")}>
                  {item.label}
                </span>
                {task === item.id && <Check className="w-4 h-4 text-secondary opacity-80" />}
              </button>
            ))}
          </div>
        </section>

        {/* Advanced */}
        <section className="glass-card p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Settings2 className="w-5 h-5 text-secondary" />
            <h3 className="font-headline text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Advanced Options</h3>
          </div>
          
          <div className="space-y-8">
            {[
              { id: 'diarization', label: 'Diarization', desc: 'Speaker identification', state: diarization, setter: setDiarization },
              { id: 'vad', label: 'VAD (Voice Activity)', desc: 'Skip silence segments', state: vad, setter: setVad }
            ].map((toggle) => (
              <div key={toggle.id} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-white">{toggle.label}</span>
                  <span className="font-sans text-xs text-white/30 font-medium tracking-tight">{toggle.desc}</span>
                </div>
                <button 
                  onClick={() => toggle.setter(!toggle.state)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500",
                    toggle.state ? "bg-secondary shadow-[0_0_15px_rgba(167,139,250,0.4)]" : "bg-white/10"
                  )}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-500 shadow-md",
                    toggle.state ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-20 left-0 w-full z-40 bg-background/50 backdrop-blur-2xl px-6 py-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <button className="w-full h-16 bg-secondary text-white rounded-2xl font-headline text-sm font-bold flex items-center justify-center gap-4 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(167,139,250,0.3)] hover:brightness-110 tracking-[0.1em] uppercase">
            <Save className="w-5 h-5" />
            Apply Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
};
