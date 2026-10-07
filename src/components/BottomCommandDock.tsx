import React from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Download, 
  Volume2, 
  Layers, 
  Activity, 
  Sliders 
} from 'lucide-react';

interface BottomCommandDockProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  playheadSec: number;
  durationSec: number;
  onQuickGenerate: () => void;
  onOpenExport: () => void;
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const BottomCommandDock: React.FC<BottomCommandDockProps> = ({
  isPlaying,
  onTogglePlay,
  playheadSec,
  durationSec,
  onQuickGenerate,
  onOpenExport,
  activeTab,
  onTabChange,
}) => {
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    const ms = Math.floor((s % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 pointer-events-none flex justify-center">
      <div className="pointer-events-auto max-w-3xl w-full bg-[#111827]/90 backdrop-blur-xl border border-[#8B5CF6]/30 shadow-2xl shadow-black/80 rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Playhead telemetry */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-xl bg-[#1f2937] hover:bg-[#262a35] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            title={isPlaying ? 'Pause Reel' : 'Play Reel'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          <div className="hidden xs:flex flex-col font-mono text-xs">
            <span className="text-white font-bold tracking-wider">
              {formatTime(playheadSec)}
            </span>
            <span className="text-[10px] text-[#958ea0]">
              TOTAL: {formatTime(durationSec)}
            </span>
          </div>
        </div>

        {/* Center: Quick Mode Shortcuts */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('studio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-[#8B5CF6]/20 text-[#d0bcff] border border-[#8B5CF6]/40'
                : 'text-[#958ea0] hover:text-white'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => onTabChange('growth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'growth'
                ? 'bg-[#EC4899]/20 text-[#ffb0cd] border border-[#EC4899]/40'
                : 'text-[#958ea0] hover:text-white'
            }`}
          >
            Growth
          </button>
          <button
            onClick={() => onTabChange('vault')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-[#F59E0B]/20 text-[#ffb95f] border border-[#F59E0B]/40'
                : 'text-[#958ea0] hover:text-white'
            }`}
          >
            Vault
          </button>
        </div>

        {/* Right: Primary AI Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onQuickGenerate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-bold border-t border-white/20 shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffb0cd]" />
            <span className="hidden sm:inline">AUTONOMOUS</span>
            <span>AI HOOK</span>
          </button>

          <button
            onClick={onOpenExport}
            className="p-2 rounded-xl bg-[#1f2937] hover:bg-[#262a35] text-[#d0bcff] border border-[#1f2937] hover:border-[#8B5CF6]/40 transition-all cursor-pointer"
            title="Export Final Video"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
