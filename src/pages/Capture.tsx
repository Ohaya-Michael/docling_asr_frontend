import React, { useState, useRef } from 'react';
import { Mic, Upload, Lock, FileAudio, Play, X, Loader2, Wand2, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/capture_hero.png';


export function Capture() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop MediaRecorder
    if (!isRecording) {
      // Simulate stopping recording after a "fake" capture for demo
      setTimeout(() => {
        if (confirm("Recording complete. Use this audio?")) {
          setSelectedFile(new File([""], "recorded_audio.wav", { type: "audio/wav" }));
          setIsRecording(false);
        }
      }, 5000);
    }
  };

  const getFileTypeInfo = (file: File | null) => {
    if (!file) return { icon: FileAudio, label: 'Audio', action: 'Transcribe' };
    const type = file.type;
    const name = file.name.toLowerCase();
    
    if (type.includes('audio') || type.includes('video') || name.match(/\.(mp3|wav|mp4|m4a)$/)) {
      return { icon: FileAudio, label: 'Transcription', action: 'Transcribe' };
    }
    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      return { icon: FileText, label: 'PDF Analysis', action: 'Analyze' };
    }
    if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || name.endsWith('.doc') || name.endsWith('.docx')) {
      return { icon: FileText, label: 'Document Analysis', action: 'Analyze' };
    }
    if (type.includes('image') || name.match(/\.(jpg|jpeg|png|webp)$/)) {
      return { icon: ImageIcon, label: 'OCR Pipeline', action: 'Extract' };
    }
    return { icon: FileAudio, label: 'Processing', action: 'Process' };
  };

// Determine file type info for UI display and API handling
const fileInfo = getFileTypeInfo(selectedFile);

const handleTranscribe = async () => {
  if (!selectedFile) return;

  setIsProcessing(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append('file', selectedFile);

    const { data } = await axios.post('https://docling-asr.onrender.com/convert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setSelectedFile(null);
    navigate('/records')// state: { result : data}});

  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const message = error.response?.data?.message ?? error.message ?? 'Something went wrong';
    console.error('Processing failed:', message);
    setError(message);
  } finally {
    setIsProcessing(false);
    setUploadProgress(0);
  }
};

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="pt-4 pb-32 flex flex-col items-center justify-center min-h-[calc(100vh-160px)] relative"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".wav,.mp3,.mp4,.pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,audio/*,video/*"
      />
      {/* Hero Visual */}
      <div className="w-full mb-12 overflow-hidden glass-card shadow-lg">
        <div className="absolute inset-0 bg-secondary/5 z-10" />
        <img 
          className="w-full h-auto object-cover aspect-[21/9] opacity-40 brightness-110" 
          alt="Audio wave visualization"
          src={logo}
        />
      </div>

      <div className="w-full flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] font-mono border border-white/10">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_#4edea3]" />
          Engine Operational
        </div>
        
        <h2 className="font-headline text-3xl font-light text-white tracking-wide">
          {isRecording ? 'Capturing Stream...' : 'Start Real-time Capture'}
        </h2>
        <p className="font-sans text-sm text-white/50 max-w-xs leading-relaxed font-medium">
          {isRecording 
            ? 'Pulse detected. Audio pipeline is buffering encrypted data packets.' 
            : 'Tap the microphone to begin recording your audio pipeline session.'}
        </p>

        {/* Record Button */}
        <button 
          onClick={toggleRecording}
          className="group relative flex flex-col items-center justify-center mt-12 active:scale-90 transition-all duration-500"
        >
          <div className={cn(
            "absolute -inset-8 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/30 transition-all duration-700",
            isRecording ? "animate-pulse scale-110 bg-secondary/40" : "animate-pulse"
          )} />
          <div className={cn(
            "w-32 h-32 rounded-full glass flex items-center justify-center shadow-[0_0_30px_rgba(167,139,250,0.2)] hover:bg-white/10 transition-all relative border-white/20 group-hover:border-secondary/50",
            isRecording && "border-secondary scale-105"
          )}>
            <Mic className={cn("w-12 h-12 transition-all duration-500", isRecording ? "text-secondary scale-110" : "text-secondary/60 group-hover:scale-110")} />
          </div>
          <span className="mt-4 font-headline text-xs font-bold text-secondary uppercase tracking-[0.4em] opacity-80 group-hover:opacity-100 transition-opacity">
            {isRecording ? 'Stop' : 'Record'}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {!selectedFile && !isRecording && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full flex flex-col items-center"
          >
            {/* Divider */}
            <div className="w-full flex items-center py-12 max-w-sm">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="px-6 font-mono text-[10px] font-bold text-white/30 tracking-[0.5em]">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm glass-card p-10 flex flex-col items-center hover:bg-white/5 hover:border-secondary/30 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-500">
                <Upload className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-center">
                <p className="font-headline text-xs font-bold text-white mb-1 uppercase tracking-widest">Select File</p>
                <p className="font-sans text-xs text-white/40 font-medium">Drag & Drop media content</p>
                <div className="mt-6 px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold font-mono text-white/40 tracking-widest uppercase border border-white/5">
                  Accepted: AUDIO, VIDEO, PDF, IMAGE, DOCX
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFile && !isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-sm mt-8 space-y-4"
          >
            <div className="glass-card p-6 flex items-center gap-4 border-secondary/20 shadow-xl">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <fileInfo.icon className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-sans text-xs font-bold text-white truncate">{selectedFile.name}</p>
                <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Ready for {fileInfo.label}</p>
              </div>
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={handleTranscribe}
              className="w-full h-16 bg-secondary text-white rounded-2xl font-headline text-sm font-bold flex items-center justify-center gap-4 transition-all shadow-[0_0_30px_rgba(167,139,250,0.3)] hover:brightness-110 tracking-[0.1em] uppercase active:scale-[0.98]"
            >
              <Wand2 className="w-5 h-5" />
              Start {fileInfo.action}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl"
          >
            <div className="relative">
              <div className="absolute -inset-10 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
              <Loader2 className="w-16 h-16 text-secondary animate-spin" />
            </div>
            <h3 className="mt-8 font-headline text-lg font-light text-white tracking-widest uppercase">Processing Pipeline</h3>
            <p className="mt-2 font-mono text-[10px] text-white/30 font-bold uppercase tracking-[0.4em]">Optimizing Neural Compute Clusters...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footnote */}
      <div className="mt-12 flex items-center gap-2 text-white/20 font-mono text-[9px] uppercase font-bold tracking-[0.3em]">
        <Lock className="w-3 h-3" />
        Encrypted Endpoint
      </div>
    </motion.div>
  );
};
