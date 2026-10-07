export type AspectRatio = '9:16' | '1:1' | '16:9';

export type CaptionStyle = 'hormozi' | 'cyberpunk' | 'minimal' | 'kinetic';

export interface CaptionSegment {
  id: string;
  startSec: number;
  endSec: number;
  timeFormatted: string;
  text: string;
  emphasis: 'critical' | 'high' | 'standard' | 'cta';
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  durationSec: number;
  waveform: number[];
}

export interface VideoPreset {
  id: string;
  title: string;
  category: string;
  previewColor: string;
  videoUrl?: string;
  ambientPattern: string;
  accentHue: string;
}

export interface FeedbackPin {
  id: string;
  timeSec: number;
  timeFormatted: string;
  author: string;
  authorRole: string;
  comment: string;
  resolved: boolean;
}

export interface ScheduledPost {
  id: string;
  title: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  scheduledTime: string;
  timeRemaining: string;
  status: 'synced' | 'queued' | 'rendering' | 'published';
  retentionScore: number;
  viralityGrade: 'S' | 'A+' | 'A' | 'B+';
  expectedViews: string;
  clientOrderId?: string;
}

export interface ClientOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  clientHandle: string;
  platformSource: 'Fiverr Pro' | 'Direct Retainer' | 'Upwork Enterprise';
  reelsTotal: number;
  reelsCompleted: number;
  value: number;
  deadline: string;
  status: 'review' | 'approved' | 'in_progress';
  feedbackPins: FeedbackPin[];
}

export interface HeatmapPoint {
  second: number;
  retentionPct: number;
  zone: 'hook' | 'body' | 'cta';
  dropRisk: 'minimal' | 'moderate' | 'critical';
  insight: string;
}

export interface ReelProject {
  id: string;
  title: string;
  niche: string;
  hookText: string;
  hookSub: string;
  durationSec: number;
  currentPlayhead: number;
  trimStart: number;
  trimEnd: number;
  aspectRatio: AspectRatio;
  captionStyle: CaptionStyle;
  watermarkActive: boolean;
  watermarkText: string;
  audioTrackId: string;
  audioVolume: number;
  audioDucking: boolean;
  playbackSpeed: number;
  videoPresetId: string;
  captions: CaptionSegment[];
  scriptText: string;
  viralityScore: number;
  instagramCaption: string;
}
