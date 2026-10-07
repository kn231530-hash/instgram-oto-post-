import React, { useMemo } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Eye, 
  Volume2, 
  Maximize2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { AspectRatio, CaptionSegment, CaptionStyle, VideoPreset } from '../../types';

interface ReelCanvasProps {
  aspectRatio: AspectRatio;
  onAspectChange: (aspect: AspectRatio) => void;
  captionStyle: CaptionStyle;
  onCaptionStyleChange: (style: CaptionStyle) => void;
  watermarkActive: boolean;
  onToggleWatermark: () => void;
  watermarkText: string;
  preset: VideoPreset;
  captions: CaptionSegment[];
  playheadSec: number;
  durationSec: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  viralityScore: number;
}

export const ReelCanvas: React.FC<ReelCanvasProps> = ({
  aspectRatio,
  onAspectChange,
  captionStyle,
  onCaptionStyleChange,
  watermarkActive,
  onToggleWatermark,
  watermarkText,
  preset,
  captions,
  playheadSec,
  durationSec,
  isPlaying,
  onTogglePlay,
  viralityScore,
}) => {
  // Find current active caption segment based on playhead
  const currentCaption = useMemo(() => {
    return captions.find(
      (c) => playheadSec >= c.startSec && playheadSec <= c.endSec
    ) || captions[0];
  }, [captions, playheadSec]);

  // Aspect ratio dimension classes
  const aspectClass = useMemo(() => {
    switch (aspectRatio) {
      case '9:16':
        return 'w-[280px] sm:w-[320px] md:w-[340px] aspect-[9/16]';
      case '1:1':
        return 'w-[320px] sm:w-[360px] aspect-square';
      case '16:9':
        return 'w-full max-w-[500px] aspect-[16/9]';
      default:
        return 'w-[320px] aspect-[9/16]';
    }
  }, [aspectRatio]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Top Canvas Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 px-1">
        {/* Aspect Ratio Buttons */}
        <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-[#1f2937]">
          <span className="text-[10px] font-mono text-[#958ea0] px-1.5">ASPECT:</span>
          {(['9:16', '1:1', '16:9'] as AspectRatio[]).map((ar) => (
            <button
              key={ar}
              onClick={() => onAspectChange(ar)}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-all cursor-pointer ${
                aspectRatio === ar
                  ? 'bg-[#8B5CF6] text-white font-semibold shadow-sm'
                  : 'text-[#958ea0] hover:text-white'
              }`}
            >
              {ar}
            </button>
          ))}
        </div>

        {/* Caption Style Selector */}
        <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-[#1f2937]">
          <span className="text-[10px] font-mono text-[#958ea0] px-1.5">SUBTITLES:</span>
          {[
            { id: 'hormozi', label: 'Hormozi' },
            { id: 'cyberpunk', label: 'Cyberpunk' },
            { id: 'minimal', label: 'Minimal' },
            { id: 'kinetic', label: 'Kinetic' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => onCaptionStyleChange(style.id as CaptionStyle)}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-all cursor-pointer ${
                captionStyle === style.id
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-semibold shadow-sm'
                  : 'text-[#958ea0] hover:text-white'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Watermark toggle */}
        <button
          onClick={onToggleWatermark}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
            watermarkActive
              ? 'bg-[#F59E0B]/20 text-[#ffb95f] border-[#F59E0B]/50'
              : 'bg-[#111827] text-[#958ea0] border-[#1f2937] hover:text-white'
          }`}
          title="Toggle watermark protection for client deliverable drafts"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{watermarkActive ? 'WATERMARK ON' : 'CLEAN RENDER'}</span>
        </button>
      </div>

      {/* Main Video Screen Container with phone chassis border */}
      <div className="relative group">
        <div
          onClick={onTogglePlay}
          className={`relative ${aspectClass} rounded-2xl overflow-hidden bg-[#070a12] border-2 border-[#1f2937] shadow-2xl shadow-black/80 flex flex-col justify-between p-4 cursor-pointer select-none transition-all duration-300 group-hover:border-[#8B5CF6]/50`}
          style={{
            backgroundImage: preset.ambientPattern,
            backgroundColor: preset.previewColor,
          }}
        >
          {/* Animated Ambient Digital Grid / Scanlines */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
          
          {/* Live Dynamic Ambient Pulse representing B-roll video movement */}
          <div 
            className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
              isPlaying ? 'opacity-40 animate-pulse' : 'opacity-20'
            }`}
            style={{
              background: `radial-gradient(ellipse at ${Math.sin(playheadSec) * 30 + 50}% ${Math.cos(playheadSec) * 20 + 50}%, ${preset.accentHue} 0%, transparent 60%)`,
            }}
          />

          {/* Top Video Header HUD */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 bg-[#0b0f19]/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 font-mono text-[10px] text-white">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>REC 60FPS</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#0b0f19]/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 font-mono text-[10px] text-[#ffb0cd]">
              <TrendingUp className="w-3 h-3 text-[#EC4899]" />
              <span>{viralityScore}% VIRAL</span>
            </div>
          </div>

          {/* Diagonal Watermark for Client Review */}
          {watermarkActive && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="transform -rotate-25 border-y-2 border-red-500/40 bg-red-950/40 backdrop-blur-[2px] px-8 py-2 text-center w-full shadow-lg">
                <span className="font-mono text-xs sm:text-sm font-black text-red-300/80 tracking-widest uppercase">
                  {watermarkText}
                </span>
                <p className="font-mono text-[9px] text-red-400/60 mt-0.5">
                  FIVERR / AGENCY CLIENT PREVIEW ONLY · NOT FOR DISTRIBUTION
                </p>
              </div>
            </div>
          )}

          {/* Central Animated Kinetic Caption Display */}
          <div className="relative z-10 my-auto text-center px-2 py-4">
            {currentCaption && (
              <div className="transition-all duration-200 transform scale-100">
                {captionStyle === 'hormozi' && (
                  <div className="space-y-1">
                    <span className="inline-block bg-[#F59E0B] text-black font-black text-lg sm:text-2xl px-3 py-1 rounded-md uppercase tracking-tight shadow-xl shadow-black/80 rotate-[-1deg] border-2 border-white">
                      {currentCaption.text.split(' ').slice(0, 3).join(' ')}
                    </span>
                    <p className="text-white font-extrabold text-base sm:text-xl drop-shadow-[0_4px_8px_rgba(0,0,0,1)] uppercase tracking-wide">
                      {currentCaption.text.split(' ').slice(3).join(' ')}
                    </p>
                  </div>
                )}

                {captionStyle === 'cyberpunk' && (
                  <div className="border border-[#EC4899] bg-[#0b0f19]/90 backdrop-blur-md p-3 rounded-lg shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    <div className="font-mono text-[9px] text-[#8B5CF6] tracking-widest uppercase mb-1">
                      // AI_HOOK_DATA
                    </div>
                    <p className="font-sans font-bold text-white text-base sm:text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffb0cd] to-[#d0bcff]">
                      {currentCaption.text}
                    </p>
                  </div>
                )}

                {captionStyle === 'minimal' && (
                  <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl inline-block border border-white/10 shadow-lg">
                    <p className="font-sans font-semibold text-white text-sm sm:text-base leading-snug">
                      {currentCaption.text}
                    </p>
                  </div>
                )}

                {captionStyle === 'kinetic' && (
                  <div className="space-y-1">
                    <p className="font-sans font-black text-white text-lg sm:text-2xl leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                      {currentCaption.text.split(' ').map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className={wIdx % 2 === 0 ? 'text-[#ffb95f]' : 'text-white'}
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom HUD Overlay: Audio sync & Timecode */}
          <div className="relative z-10 flex items-end justify-between w-full">
            <div className="flex items-center gap-1.5 bg-[#0b0f19]/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 font-mono text-[10px] text-[#cbc3d7]">
              <Volume2 className="w-3 h-3 text-[#F59E0B]" />
              <span>BEAT SYNC</span>
            </div>

            <div className="bg-[#0b0f19]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono text-[11px] font-bold text-white shadow-md">
              00:{playheadSec.toFixed(1).padStart(4, '0')}s
            </div>
          </div>
        </div>

        {/* Ambient Backlight Glow behind canvas */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-30 filter blur-xl -z-10 transition-all duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${preset.accentHue} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Preset Theme Quick Bar */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#958ea0] pt-1">
        <span>PRESET:</span>
        <span className="text-white font-medium">{preset.title}</span>
        <span className="text-[#494454]">·</span>
        <span className="text-[#d0bcff]">{preset.category}</span>
      </div>
    </div>
  );
};
