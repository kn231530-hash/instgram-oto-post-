import React, { useRef } from 'react';
import { Volume2, VolumeX, Mic, Disc3, Zap } from 'lucide-react';
import { AudioTrack } from '../../types';

interface AudioWaveformProps {
  currentTrack: AudioTrack;
  allTracks: AudioTrack[];
  onSelectTrack: (trackId: string) => void;
  playheadSec: number;
  durationSec: number;
  onSeek: (second: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isDucking: boolean;
  onToggleDucking: () => void;
  isPlaying: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  currentTrack,
  allTracks,
  onSelectTrack,
  playheadSec,
  durationSec,
  onSeek,
  volume,
  onVolumeChange,
  isDucking,
  onToggleDucking,
  isPlaying,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playheadPct = Math.min(100, Math.max(0, (playheadSec / durationSec) * 100));

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(pct * durationSec);
  };

  return (
    <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-3.5 sm:p-4 space-y-3">
      {/* Waveform Header & Track Selection */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 text-[#d0bcff] border border-[#8B5CF6]/30">
            <Disc3 className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-wide">
                AUDIO WAVEFORM ENGINE
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#F59E0B]/10 text-[#ffb95f] border border-[#F59E0B]/20">
                {currentTrack.bpm} BPM
              </span>
            </div>
            <p className="text-[11px] text-[#958ea0]">
              {currentTrack.title} · {currentTrack.artist} ({currentTrack.genre})
            </p>
          </div>
        </div>

        {/* Audio Track Switcher Pills & Ducking */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0b0f19] p-0.5 rounded-lg border border-[#1f2937]">
            {allTracks.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTrack(t.id)}
                className={`px-2 py-1 text-[11px] font-mono rounded-md transition-all cursor-pointer ${
                  t.id === currentTrack.id
                    ? 'bg-[#1f2937] text-white font-medium shadow-sm'
                    : 'text-[#958ea0] hover:text-white'
                }`}
              >
                {t.bpm} BPM
              </button>
            ))}
          </div>

          <button
            onClick={onToggleDucking}
            title="Auto-duck background music during voiceover segments"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
              isDucking
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#d0bcff]'
                : 'bg-[#1f2937]/50 border-transparent text-[#958ea0] hover:text-white'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>-18dB DUCK</span>
          </button>
        </div>
      </div>

      {/* Dynamic Waveform Visualizer Display */}
      <div 
        ref={containerRef}
        onClick={handleWaveformClick}
        className="relative h-16 w-full bg-[#0b0f19] rounded-lg border border-[#1f2937] px-3 py-2 flex items-center justify-between gap-[2px] sm:gap-1 cursor-pointer overflow-hidden group select-none"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Dynamic Waveform Bars */}
        {currentTrack.waveform.map((barHeight, idx) => {
          const totalBars = currentTrack.waveform.length;
          const barPct = (idx / totalBars) * 100;
          const isPlayed = barPct <= playheadPct;

          return (
            <div
              key={idx}
              className="flex-1 h-full flex items-center justify-center transition-all duration-75"
            >
              <div
                style={{
                  height: `${Math.max(12, barHeight)}%`,
                }}
                className={`w-full max-w-[5px] rounded-full transition-colors duration-100 ${
                  isPlayed
                    ? 'bg-gradient-to-t from-[#F59E0B] via-[#EC4899] to-[#d0bcff] shadow-[0_0_8px_rgba(236,72,153,0.4)]'
                    : 'bg-[#1f2937] group-hover:bg-[#2c3748]'
                }`}
              />
            </div>
          );
        })}

        {/* Scrubber indicator hairline across waveform */}
        <div
          style={{ left: `${playheadPct}%` }}
          className="absolute top-0 bottom-0 w-[2px] bg-[#EC4899] shadow-[0_0_10px_#EC4899] pointer-events-none transition-all duration-75"
        >
          <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-[#EC4899]" />
        </div>
      </div>

      {/* Audio Controls Footer */}
      <div className="flex items-center justify-between text-xs text-[#958ea0] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVolumeChange(volume === 0 ? 80 : 0)}
              className="text-[#cbc3d7] hover:text-white cursor-pointer"
            >
              {volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-[#ffb4ab]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-16 sm:w-24 h-1 bg-[#1f2937] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
            <span className="text-[11px] text-[#cbc3d7]">{volume}%</span>
          </div>
          <span className="text-[#494454] hidden sm:inline">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#10B981]">
            <Zap className="w-3 h-3" />
            BEAT LOCK: 1/4 GRID
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span>VOICEOVER: ACTIVE</span>
          <span className="text-[#494454]">/</span>
          <span className="text-[#d0bcff]">MASTER STEREO</span>
        </div>
      </div>
    </div>
  );
};
