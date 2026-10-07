import React from 'react';
import { 
  ReelProject, 
  AudioTrack, 
  VideoPreset, 
  FeedbackPin, 
  AspectRatio, 
  CaptionStyle 
} from '../../types';
import { ReelCanvas } from './ReelCanvas';
import { AudioWaveform } from './AudioWaveform';
import { TimelineTrimmer } from './TimelineTrimmer';
import { 
  Edit3, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Flame,
  FileText
} from 'lucide-react';

interface ReelStudioProps {
  project: ReelProject;
  audioTracks: AudioTrack[];
  videoPresets: VideoPreset[];
  feedbackPins?: FeedbackPin[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPlayheadChange: (timeSec: number) => void;
  onTrimChange: (startSec: number, endSec: number) => void;
  onAspectChange: (aspect: AspectRatio) => void;
  onCaptionStyleChange: (style: CaptionStyle) => void;
  onToggleWatermark: () => void;
  onSelectAudioTrack: (trackId: string) => void;
  onVolumeChange: (vol: number) => void;
  onToggleDucking: () => void;
  onSpeedChange: (spd: number) => void;
  onSelectPreset: (presetId: string) => void;
  onUpdateCaptionText: (id: string, text: string) => void;
  onQuickPublish: () => void;
}

export const ReelStudio: React.FC<ReelStudioProps> = ({
  project,
  audioTracks,
  videoPresets,
  feedbackPins = [],
  isPlaying,
  onTogglePlay,
  onPlayheadChange,
  onTrimChange,
  onAspectChange,
  onCaptionStyleChange,
  onToggleWatermark,
  onSelectAudioTrack,
  onVolumeChange,
  onToggleDucking,
  onSpeedChange,
  onSelectPreset,
  onUpdateCaptionText,
  onQuickPublish,
}) => {
  const currentTrack = audioTracks.find((t) => t.id === project.audioTrackId) || audioTracks[0];
  const currentPreset = videoPresets.find((p) => p.id === project.videoPresetId) || videoPresets[0];

  return (
    <div className="space-y-6">
      {/* Top Studio Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Reel Preview Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center bg-[#111827] rounded-2xl border border-[#1f2937] p-4 sm:p-5 shadow-xl">
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#1f2937]/70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-sm shadow-[#8B5CF6]" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                MONITOR 1 // MASTER PREVIEW
              </h3>
            </div>
            <span className="font-mono text-[11px] text-[#10B981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              LIVE
            </span>
          </div>

          <ReelCanvas
            aspectRatio={project.aspectRatio}
            onAspectChange={onAspectChange}
            captionStyle={project.captionStyle}
            onCaptionStyleChange={onCaptionStyleChange}
            watermarkActive={project.watermarkActive}
            onToggleWatermark={onToggleWatermark}
            watermarkText={project.watermarkText}
            preset={currentPreset}
            captions={project.captions}
            playheadSec={project.currentPlayhead}
            durationSec={project.durationSec}
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
            viralityScore={project.viralityScore}
          />

          {/* Quick Preset Background Switcher */}
          <div className="w-full mt-4 pt-3 border-t border-[#1f2937]">
            <span className="text-[10px] font-mono text-[#958ea0] uppercase tracking-wider block mb-2">
              B-Roll Visual Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {videoPresets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p.id)}
                  className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                    p.id === currentPreset.id
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 shadow-sm'
                      : 'border-[#1f2937] bg-[#0b0f19] hover:border-[#374151]'
                  }`}
                >
                  <div
                    className="w-full h-1.5 rounded-full mb-1.5"
                    style={{ backgroundColor: p.accentHue }}
                  />
                  <p className="text-[11px] font-semibold text-white truncate">{p.title}</p>
                  <p className="text-[9px] font-mono text-[#958ea0] truncate">{p.category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Audio Waveform, Captions Inspector & Script Feed */}
        <div className="lg:col-span-7 space-y-4">
          {/* Audio Waveform Visualizer */}
          <AudioWaveform
            currentTrack={currentTrack}
            allTracks={audioTracks}
            onSelectTrack={onSelectAudioTrack}
            playheadSec={project.currentPlayhead}
            durationSec={project.durationSec}
            onSeek={onPlayheadChange}
            volume={project.audioVolume}
            onVolumeChange={onVolumeChange}
            isDucking={project.audioDucking}
            onToggleDucking={onToggleDucking}
            isPlaying={isPlaying}
          />

          {/* Precision Timeline Trimmer */}
          <TimelineTrimmer
            durationSec={project.durationSec}
            playheadSec={project.currentPlayhead}
            trimStart={project.trimStart}
            trimEnd={project.trimEnd}
            isPlaying={isPlaying}
            playbackSpeed={project.playbackSpeed}
            captions={project.captions}
            feedbackPins={feedbackPins}
            onPlayheadChange={onPlayheadChange}
            onTrimChange={onTrimChange}
            onTogglePlay={onTogglePlay}
            onSpeedChange={onSpeedChange}
          />

          {/* Captions & Synchronized Script Inspector */}
          <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 text-[#d0bcff]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-wide">
                    SYNCHRONIZED CAPTIONS & TIMINGS
                  </h4>
                  <p className="text-[11px] text-[#958ea0]">
                    Editable kinetic text tracks synced to milliseconds
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                  {project.captions.length} TIMED SEGMENTS
                </span>
              </div>
            </div>

            {/* Captions List with in-place editing */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {project.captions.map((cap) => {
                const isActive = project.currentPlayhead >= cap.startSec && project.currentPlayhead <= cap.endSec;
                return (
                  <div
                    key={cap.id}
                    onClick={() => onPlayheadChange(cap.startSec)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] shadow-sm'
                        : 'bg-[#0b0f19] border-[#1f2937] hover:border-[#374151]'
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1f2937] text-[#d0bcff] whitespace-nowrap">
                        {cap.timeFormatted}
                      </span>
                      {cap.emphasis === 'critical' && (
                        <span className="text-[9px] font-mono uppercase bg-[#8B5CF6]/30 text-[#d0bcff] px-1.5 py-0.5 rounded">
                          HOOK
                        </span>
                      )}
                      {cap.emphasis === 'cta' && (
                        <span className="text-[9px] font-mono uppercase bg-[#EC4899]/30 text-[#ffb0cd] px-1.5 py-0.5 rounded">
                          CTA
                        </span>
                      )}
                    </div>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={cap.text}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateCaptionText(cap.id, e.target.value)}
                        className="w-full bg-transparent text-xs text-white border-b border-transparent hover:border-[#494454] focus:border-[#8B5CF6] focus:outline-none px-1 py-0.5 transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[10px] text-[#958ea0]">
                      <Clock className="w-3 h-3" />
                      <span>{(cap.endSec - cap.startSec).toFixed(1)}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
