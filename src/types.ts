export type Page = 'pipelines' | 'capture' | 'records' | 'settings';

export interface Pipeline {
  id: string;
  category: 'ASR' | 'OCR' | 'API';
  title: string;
  subtitle: string;
  icon: string;
}

export interface TranscriptionRecord {
  id: string;
  title: string;
  pipeline: string;
  processingTime: string;
  engine: string;
  transcript: string;
}
