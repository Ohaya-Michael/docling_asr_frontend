import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Database, Copy, Download, Share2, Search, ArrowLeft, MoreHorizontal, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { TranscriptionRecord } from '@/src/types';
import axios from 'axios';

// Mock data for records
const MOCK_RECORDS: TranscriptionRecord[] = [
  {
    id: '1',
    title: 'Board Meeting Q3_Strategic_Review.wav',
    pipeline: 'ASR PIPELINE',
    processingTime: '12.4s',
    engine: 'Whisper v3-Large',
    transcript: `
### Executive Summary
The meeting convened at 10:00 AM PST. The primary focus of the Q3 strategic review centered on the infrastructure scaling for the high-performance transcription clusters. Key stakeholders confirmed the 15% efficiency increase observed in the **Whisper v3-Large** deployment.

> "Our goal is to reduce latency to sub-500ms for all real-time API requests by the end of next quarter." - CTO Statement

#### Action Items
* Provision additional A100 nodes in the US-East-1 region.
* Update the OCR pipeline to support multi-column financial documents.
* Implement token-level timestamps for the mobile client viewer.

#### Detailed Analysis
User retention metrics show a direct correlation between transcription accuracy and daily active usage. The current word error rate (WER) has dropped to 2.1% across medical datasets, though technical terminology in engineering documents remains a focus area for fine-tuning.
    `
  },
  {
    id: '2',
    title: 'Technical_Spec_Sync_v2.mp3',
    pipeline: 'ASR PIPELINE',
    processingTime: '8.2s',
    engine: 'Whisper Turbo',
    transcript: '### Technical Sync\n\nDiscussion on API architecture and database migration strategy...'
  },
  {
    id: '3',
    title: 'Invoice_Scan_2024_03.pdf',
    pipeline: 'OCR PIPELINE',
    processingTime: '3.1s',
    engine: 'EasyOCR',
    transcript: '### OCR Extraction\n\nExtracted text from invoice #4920 showing items: A100 Nodes, Storage arrays...'
  },
  {
    id: '4',
    title: 'Financial_Report_2024.pdf',
    pipeline: 'PDF PIPELINE',
    processingTime: '5.4s',
    engine: 'PyPDF2 + Gemini',
    transcript: '### PDF Analysis\n\nAnnual financial summary indicating strong growth in cloud services segment...'
  }
];

export const Records: React.FC = () => {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'asr' | 'ocr' | 'pdf'>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [apiResult, setApiResult] = useState<any>(null);

  const data =async() => {
    const record = await axios.get('https://docling-asr.onrender.com/converted-data');
    setApiResult(record.data);
  }

  useEffect(() => {
    data();
  }, []);

  const selectedRecord = apiResult?.find((r: any) => r.id === selectedRecordId);
  const filteredRecords = apiResult?.filter((record: any) => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || record.pipeline.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  }) || [];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast('Transcript copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleExport = (record: TranscriptionRecord) => {
    const element = document.createElement("a");
    const file = new Blob([record.transcript], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${record.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setToast('Record exported successfully');
  };

  const handleShare = async (record: TranscriptionRecord) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: record.title,
          text: `Transcription of ${record.title} via Precision Transcribe. Engine: ${record.engine}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      handleCopy(`${record.title}\nEngine: ${record.engine}\nTranscript URL: ${window.location.href}`);
      setToast('Share link copied to clipboard');
    }
  };

  if (selectedRecordId && selectedRecord) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="pb-32 space-y-6"
      >
        <button 
          onClick={() => setSelectedRecordId(null)}
          className="flex items-center gap-2 text-secondary font-headline text-[10px] font-bold uppercase tracking-[0.2em] hover:translate-x-[-4px] transition-transform mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Records
        </button>

        <section>
          <div className="glass-card p-6 shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="inline-flex items-center px-3 py-1 bg-white/10 text-white/60 text-[9px] font-bold rounded-lg uppercase tracking-[0.2em] mb-4 border border-white/5">
                  {selectedRecord.pipeline}
                </span>
                <h2 className="font-headline text-2xl font-light text-white tracking-wide leading-tight">
                  {selectedRecord.title}
                </h2>
              </div>
              <CheckCircle2 className="w-6 h-6 text-tertiary shadow-[0_0_10px_rgba(78,222,163,0.3)]" />
            </div>
            
            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[9px] text-white/30 font-bold uppercase tracking-widest">Processing Time</span>
                  <span className="font-mono text-sm font-bold text-white tracking-tighter">{selectedRecord.processingTime}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <Database className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[9px] text-white/30 font-bold uppercase tracking-widest">Engine</span>
                  <span className="font-mono text-sm font-bold text-white tracking-tighter">{selectedRecord.engine}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card overflow-hidden shadow-2xl">
          <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <span className="font-headline text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">TRANSCRIPT OUTPUT</span>
            <span className="font-mono text-[9px] font-bold bg-white/10 px-2.5 py-1 rounded-full text-white/60 uppercase tracking-widest border border-white/5">Markdown</span>
          </div>
          
          <div className="p-6 md:p-10 h-[450px] overflow-y-auto custom-scrollbar">
            <div className="markdown-body">
              <ReactMarkdown>{selectedRecord.transcript}</ReactMarkdown>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Copy', icon: Copy, onClick: () => handleCopy(selectedRecord.transcript) },
            { label: 'Export', icon: Download, onClick: () => handleExport(selectedRecord) },
            { label: 'Share', icon: Share2, onClick: () => handleShare(selectedRecord) }
          ].map((action, idx) => (
            <button 
              key={idx}
              onClick={action.onClick}
              className="flex flex-col items-center justify-center gap-3 p-5 glass-card hover:bg-white/10 hover:border-secondary/30 hover:scale-[1.05] active:scale-95 transition-all duration-300 shadow-lg"
            >
              <action.icon className="w-5 h-5 text-secondary" />
              <span className="font-mono text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-headline text-[10px] font-bold uppercase tracking-widest border border-white/20"
            >
              <Check className="w-4 h-4" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="pb-32 space-y-8"
    >
      <div className="space-y-2">
        <h2 className="font-headline text-3xl font-light text-white tracking-wide">Records Library</h2>
        <p className="font-sans text-sm text-white/40 font-medium tracking-tight">Browse and manage your past transcription pipelines.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-4.5 w-5 h-5 text-white/30" />
          <input 
            type="text" 
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl font-sans text-sm text-white focus:outline-none focus:border-secondary/50 transition-all shadow-lg backdrop-blur-md"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {['all', 'asr', 'ocr', 'pdf'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border transition-all duration-300 whitespace-nowrap",
                filter === f 
                  ? "bg-secondary/20 border-secondary/50 text-white shadow-[0_0_15px_rgba(167,139,250,0.2)]" 
                  : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
              )}
            >
              {f === 'all' ? 'All Records' : f === 'asr' ? 'ASR Pipelines' : f === 'ocr' ? 'OCR Pipelines' : 'PDF Pipelines'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <motion.div
              layout
              key={record.id}
              onClick={() => setSelectedRecordId(record.id)}
              className="glass-card p-6 flex flex-col gap-4 hover:bg-white/10 hover:border-secondary/30 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em]">
                    {record.pipeline}
                  </span>
                  <h3 className="text-base font-semibold text-white group-hover:text-secondary transition-colors line-clamp-1">
                    {record.title}
                  </h3>
                </div>
                <button className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white/20">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-white/30" />
                  <span className="font-mono text-[10px] text-white/60 font-bold uppercase">{record.processingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-white/30" />
                  <span className="font-mono text-[10px] text-white/60 font-bold uppercase">{record.engine}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center glass-card border-dashed">
            <p className="text-white/20 font-headline text-[10px] font-bold uppercase tracking-[0.3em]">No records matching your search</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
