import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Activity, 
  Briefcase, 
  Download, 
  Smartphone, 
  Monitor, 
  Radio, 
  Cpu
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'ai' | 'growth' | 'vault';
  setActiveTab: (tab: 'studio' | 'ai' | 'growth' | 'vault') => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onOpenExport: () => void;
  activeOrderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMobileFrame,
  setIsMobileFrame,
  onOpenExport,
  activeOrderCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0e18]/95 backdrop-blur-md border-b border-[#1f2937] px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Studio Telemetry */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] p-[1.5px] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
              <div className="w-full h-full bg-[#0b0f19] rounded-[7px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#d0bcff]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  AUTONOMOUS CREATOR ENGINE
                </h1>
                <span className="font-mono text-[10px] text-[#8B5CF6] px-1.5 py-0.5 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
                  v2.8
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#958ea0]">
                <span className="flex items-center gap-1.5 text-[#10B981]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                  </span>
                  IG SYNC ACTIVE
                </span>
                <span className="text-[#494454]">/</span>
                <span className="hidden sm:inline text-[#cbc3d7]">60 FPS ENGINE</span>
                <span className="hidden sm:inline text-[#494454]">/</span>
                <span className="hidden sm:inline text-[#ffb95f]">SOLOPRENEUR CORE</span>
              </div>
            </div>
          </div>

          {/* Quick Mobile/Desktop viewport toggle for responsive testing */}
          <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-[#1f2937]">
            <button
              onClick={() => setIsMobileFrame(false)}
              title="Wide Studio Mode"
              className={`p-1.5 rounded transition-all ${
                !isMobileFrame 
                  ? 'bg-[#1f2937] text-white shadow-sm' 
                  : 'text-[#958ea0] hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMobileFrame(true)}
              title="Mobile Reel Frame Mode"
              className={`p-1.5 rounded transition-all ${
                isMobileFrame 
                  ? 'bg-[#8B5CF6] text-white shadow-sm' 
                  : 'text-[#958ea0] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Studio Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-[#111827] rounded-xl border border-[#1f2937] overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] text-white shadow-md shadow-[#8B5CF6]/30'
                : 'text-[#cbc3d7] hover:text-white hover:bg-[#1f2937]/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Reel Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-[#8B5CF6] via-[#a855f7] to-[#EC4899] text-white shadow-md shadow-[#8B5CF6]/30'
                : 'text-[#cbc3d7] hover:text-white hover:bg-[#1f2937]/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffb0cd]" />
            <span>AI Hook Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('growth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'growth'
                ? 'bg-gradient-to-r from-[#EC4899] to-[#F59E0B] text-white shadow-md shadow-[#EC4899]/30'
                : 'text-[#cbc3d7] hover:text-white hover:bg-[#1f2937]/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Growth Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-[#262a35] text-white border border-[#8B5CF6]/40 shadow-md'
                : 'text-[#cbc3d7] hover:text-white hover:bg-[#1f2937]/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Client Vault</span>
            {activeOrderCount > 0 && (
              <span className="font-mono text-[10px] bg-[#8B5CF6]/30 text-[#d0bcff] px-1.5 rounded">
                {activeOrderCount}
              </span>
            )}
          </button>
        </nav>

        {/* Global Hardware Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#958ea0] bg-[#111827] px-2.5 py-1.5 rounded-lg border border-[#1f2937]">
            <Radio className="w-3 h-3 text-[#10B981] animate-pulse" />
            <span>BUFFER 100%</span>
          </div>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-semibold rounded-lg shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 4K</span>
          </button>
        </div>
      </div>
    </header>
  );
};
