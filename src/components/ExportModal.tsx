import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Check, 
  Film, 
  Settings2, 
  Sliders, 
  CheckCircle2, 
  Cpu 
} from 'lucide-react';
import { ReelProject } from '../types';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ReelProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [resolution, setResolution] = useState('1080x1920 (Reel / TikTok 9:16)');
  const [fps, setFps] = useState('60 FPS');
  const [format, setFormat] = useState('MP4 (H.264 High Profile)');
  const [burnCaptions, setBurnCaptions] = useState(true);
  const [includeWatermark, setIncludeWatermark] = useState(project.watermarkActive);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setIsRendering(true);
    setProgress(0);
    setIsCompleted(false);

    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(timer);
          setIsRendering(false);
          setIsCompleted(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          // Trigger download of export package summary & script
          const packageData = {
            projectTitle: project.title,
            resolution,
            fps,
            format,
            duration: `${project.durationSec}s`,
            trim: `${project.trimStart}s - ${project.trimEnd}s`,
            aspectRatio: project.aspectRatio,
            hookText: project.hookText,
            captions: project.captions,
            voiceoverScript: project.scriptText,
            instagramCaption: project.instagramCaption,
            watermarkApplied: includeWatermark,
            exportedAt: new Date().toISOString(),
          };

          const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${project.title.replace(/\s+/g, '_')}_MASTER_EXPORT.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          return 100;
        }
        return old + 12;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-[#8B5CF6]/40 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#d0bcff]">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              MASTER EXPORT & RENDER PIPELINE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#958ea0] hover:text-white hover:bg-[#1f2937] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-mono text-[#958ea0] block mb-1 uppercase">
              Target Resolution
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-[#0b0f19] border border-[#1f2937] text-white p-2.5 rounded-lg font-mono focus:border-[#8B5CF6]"
            >
              <option value="1080x1920 (Reel / TikTok 9:16)">1080x1920 (Reel / TikTok 9:16)</option>
              <option value="2160x3840 (4K UHD Vertical)">2160x3840 (4K UHD Vertical)</option>
              <option value="1080x1080 (Square 1:1)">1080x1080 (Square 1:1)</option>
              <option value="1920x1080 (Landscape 16:9)">1920x1080 (Landscape 16:9)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#958ea0] block mb-1 uppercase">
                Frame Rate
              </label>
              <select
                value={fps}
                onChange={(e) => setFps(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1f2937] text-white p-2.5 rounded-lg font-mono focus:border-[#8B5CF6]"
              >
                <option value="60 FPS">60 FPS (Ultra Smooth)</option>
                <option value="30 FPS">30 FPS (Standard)</option>
                <option value="24 FPS">24 FPS (Cinematic)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#958ea0] block mb-1 uppercase">
                Encoding Preset
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1f2937] text-white p-2.5 rounded-lg font-mono focus:border-[#8B5CF6]"
              >
                <option value="MP4 (H.264 High Profile)">MP4 (H.264 Fast Web)</option>
                <option value="Apple ProRes 422 HQ">Apple ProRes 422 HQ</option>
                <option value="HEVC H.265">HEVC H.265 (High Dynamic)</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 space-y-2">
            <label className="flex items-center justify-between p-2.5 bg-[#0b0f19] rounded-lg border border-[#1f2937] cursor-pointer">
              <span className="text-white font-medium">Burn-in Kinetic Subtitles</span>
              <input
                type="checkbox"
                checked={burnCaptions}
                onChange={(e) => setBurnCaptions(e.target.checked)}
                className="w-4 h-4 accent-[#8B5CF6]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-[#0b0f19] rounded-lg border border-[#1f2937] cursor-pointer">
              <span className="text-white font-medium">Apply Client Draft Watermark</span>
              <input
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="w-4 h-4 accent-[#8B5CF6]"
              />
            </label>
          </div>
        </div>

        {/* Progress or Render Action */}
        <div className="pt-2">
          {isRendering ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#8B5CF6] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                  RENDERING HARDWARE PIPELINE...
                </span>
                <span className="text-white font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#0b0f19] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : isCompleted ? (
            <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-[#34D399] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>RENDER COMPLETE · PACKAGE DOWNLOADED</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#1f2937] text-white text-xs font-mono rounded-lg hover:bg-[#374151] transition-all cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartExport}
              className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] via-[#a855f7] to-[#EC4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>START 4K RENDER NOW</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
