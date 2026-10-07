import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Scissors,
  Bookmark
} from 'lucide-react';
import { CaptionSegment, FeedbackPin } from '../../types';

interface TimelineTrimmerProps {
  durationSec: number;
  playheadSec: number;
  trimStart: number;
  trimEnd: number;
  isPlaying: boolean;
  playbackSpeed: number;
  captions: CaptionSegment[];
  feedbackPins?: FeedbackPin[];
  onPlayheadChange: (timeSec: number) => void;
  onTrimChange: (startSec: number, endSec: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
}

export const TimelineTrimmer: React.FC<TimelineTrimmerProps> = ({
  durationSec,
  playheadSec,
  trimStart,
  trimEnd,
  isPlaying,
  playbackSpeed,
  captions,
  feedbackPins = [],
  onPlayheadChange,
  onTrimChange,
  onTogglePlay,
  onSpeedChange,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [draggingTrim, setDraggingTrim] = useState<'start' | 'end' | null>(null);
  const [isLooping, setIsLooping] = useState(true);

  // Format seconds to precise timecode: 00:14.28
  const formatTimecode = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const hundredths = Math.floor((sec % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  };

  const getPercentageFromClientX = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  };

  // Dragging handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPlayhead) {
        const pct = getPercentageFromClientX(e.clientX);
        const newTime = pct * durationSec;
        onPlayheadChange(Math.max(trimStart, Math.min(trimEnd, newTime)));
      } else if (draggingTrim === 'start') {
        const pct = getPercentageFromClientX(e.clientX);
        const newStart = Math.min(trimEnd - 1, Math.max(0, pct * durationSec));
        onTrimChange(newStart, trimEnd);
      } else if (draggingTrim === 'end') {
        const pct = getPercentageFromClientX(e.clientX);
        const newEnd = Math.max(trimStart + 1, Math.min(durationSec, pct * durationSec));
        onTrimChange(trimStart, newEnd);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
      setDraggingTrim(null);
    };

    if (isDraggingPlayhead || draggingTrim) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPlayhead, draggingTrim, durationSec, trimStart, trimEnd, onPlayheadChange, onTrimChange]);

  const handleTrackMouseDown = (e: React.MouseEvent) => {
    const pct = getPercentageFromClientX(e.clientX);
    const newTime = pct * durationSec;
    onPlayheadChange(newTime);
    setIsDraggingPlayhead(true);
  };

  const startPct = (trimStart / durationSec) * 100;
  const endPct = (trimEnd / durationSec) * 100;
  const playheadPct = (playheadSec / durationSec) * 100;

  // Time notches marks every 5 seconds
  const notches = [0, 5, 10, 15, 20, 25, 30];

  return (
    <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-3.5 sm:p-4 space-y-3">
      {/* Top Header with Precision Timecode */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 text-[#d0bcff] border border-[#8B5CF6]/30">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-wide">
                PRECISION TIMELINE TRIMMER
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#958ea0]">
              Trim window: {formatTimecode(trimStart)} → {formatTimecode(trimEnd)} ({(trimEnd - trimStart).toFixed(1)}s)
            </p>
          </div>
        </div>

        {/* Current Timecode Display pill */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0b0f19] px-3 py-1 rounded-lg border border-[#8B5CF6]/40 font-mono text-xs text-[#d0bcff] flex items-center gap-2 shadow-inner">
            <span className="text-[#958ea0] text-[10px]">TC:</span>
            <span className="text-white font-bold tracking-wider">{formatTimecode(playheadSec)}</span>
            <span className="text-[#494454]">/</span>
            <span className="text-[#958ea0]">{formatTimecode(durationSec)}</span>
          </div>
        </div>
      </div>

      {/* Calibrated Time Ruler (Notches) */}
      <div className="relative h-5 w-full select-none text-[10px] font-mono text-[#958ea0] px-3">
        {notches.map((time) => {
          const pct = (time / durationSec) * 100;
          return (
            <div
              key={time}
              style={{ left: `${pct}%` }}
              className="absolute -translate-x-1/2 flex flex-col items-center"
            >
              <span>{`00:${time.toString().padStart(2, '0')}`}</span>
              <div className="h-1.5 w-[1px] bg-[#494454] mt-0.5" />
            </div>
          );
        })}
      </div>

      {/* Main Video Track & Trimmer Container */}
      <div className="relative select-none">
        <div
          ref={trackRef}
          onMouseDown={handleTrackMouseDown}
          className="relative h-20 w-full bg-[#0b0f19] rounded-lg border border-[#1f2937] overflow-hidden cursor-pointer"
        >
          {/* Simulated Keyframe Filmstrip */}
          <div className="absolute inset-0 flex items-center divide-x divide-[#1f2937]/50 opacity-40">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full bg-gradient-to-br from-[#171b26] to-[#0f131d] flex flex-col justify-between p-1.5 text-[9px] font-mono text-[#958ea0]"
              >
                <span>F#{i * 30 + 12}</span>
                <div className="w-full h-1 bg-[#8B5CF6]/30 rounded-full" />
              </div>
            ))}
          </div>

          {/* Caption segment markers along timeline */}
          <div className="absolute inset-x-0 bottom-1 h-3 flex gap-0.5 px-1 pointer-events-none">
            {captions.map((cap) => {
              const capStartPct = (cap.startSec / durationSec) * 100;
              const capWidthPct = ((cap.endSec - cap.startSec) / durationSec) * 100;
              return (
                <div
                  key={cap.id}
                  style={{
                    left: `${capStartPct}%`,
                    width: `${capWidthPct}%`,
                  }}
                  className={`absolute h-full rounded text-[8px] font-mono truncate px-1 flex items-center ${
                    cap.emphasis === 'critical'
                      ? 'bg-[#8B5CF6]/40 text-[#d0bcff] border border-[#8B5CF6]/60'
                      : cap.emphasis === 'cta'
                      ? 'bg-[#EC4899]/40 text-[#ffb0cd] border border-[#EC4899]/60'
                      : 'bg-[#1f2937]/80 text-[#cbc3d7]'
                  }`}
                >
                  {cap.text}
                </div>
              );
            })}
          </div>

          {/* Feedback Pin Markers on Timeline */}
          {feedbackPins.map((pin) => {
            const pinPct = (pin.timeSec / durationSec) * 100;
            return (
              <div
                key={pin.id}
                style={{ left: `${pinPct}%` }}
                className="absolute top-1 -translate-x-1/2 z-20 pointer-events-auto"
                title={`${pin.author}: ${pin.comment}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayheadChange(pin.timeSec);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-[#ffb95f] text-[#3e2400] flex items-center justify-center font-mono text-[9px] font-bold shadow-md shadow-[#ffb95f]/40 hover:scale-125 transition-transform cursor-pointer">
                  <Bookmark className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
            );
          })}

          {/* Inactive Dimmed Regions Outside Trim Start & End */}
          <div
            style={{ width: `${startPct}%` }}
            className="absolute top-0 bottom-0 left-0 bg-[#000000]/75 backdrop-blur-[1px] pointer-events-none border-r border-[#8B5CF6]/30"
          />
          <div
            style={{ width: `${100 - endPct}%` }}
            className="absolute top-0 bottom-0 right-0 bg-[#000000]/75 backdrop-blur-[1px] pointer-events-none border-l border-[#8B5CF6]/30"
          />

          {/* Active Trim Highlight Window */}
          <div
            style={{
              left: `${startPct}%`,
              width: `${endPct - startPct}%`,
            }}
            className="absolute top-0 bottom-0 border-y-2 border-[#8B5CF6] pointer-events-none"
          />

          {/* Drag Handle: Start Trim (Solid #8B5CF6 with textured gripping lines) */}
          <div
            style={{ left: `${startPct}%` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setDraggingTrim('start');
            }}
            className="absolute top-0 bottom-0 -translate-x-full w-4 bg-[#8B5CF6] hover:bg-[#9d74f7] rounded-l-md cursor-ew-resize flex flex-col items-center justify-center gap-1 z-20 shadow-lg shadow-[#8B5CF6]/40 transition-colors"
          >
            {/* Textured gripping lines */}
            <div className="w-0.5 h-3 bg-white/70 rounded-full" />
            <div className="w-0.5 h-3 bg-white/70 rounded-full" />
          </div>

          {/* Drag Handle: End Trim (Solid #8B5CF6 with textured gripping lines) */}
          <div
            style={{ left: `${endPct}%` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setDraggingTrim('end');
            }}
            className="absolute top-0 bottom-0 w-4 bg-[#8B5CF6] hover:bg-[#9d74f7] rounded-r-md cursor-ew-resize flex flex-col items-center justify-center gap-1 z-20 shadow-lg shadow-[#8B5CF6]/40 transition-colors"
          >
            {/* Textured gripping lines */}
            <div className="w-0.5 h-3 bg-white/70 rounded-full" />
            <div className="w-0.5 h-3 bg-white/70 rounded-full" />
          </div>

          {/* Scrubber Playhead: Vertical hairline in #EC4899 with pill-shaped indicator top tag displaying frame time */}
          <div
            style={{ left: `${playheadPct}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-[#EC4899] z-30 shadow-[0_0_12px_#EC4899] pointer-events-none"
          >
            {/* Pill-shaped indicator top tag displaying frame time (00:14.28) */}
            <div className="absolute -top-6 -translate-x-1/2 bg-[#EC4899] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-[#EC4899]/40 whitespace-nowrap">
              {formatTimecode(playheadSec)}
            </div>
            {/* Bottom dot */}
            <div className="absolute -bottom-1 -translate-x-1/2 w-2 h-2 rounded-full bg-[#EC4899]" />
          </div>
        </div>
      </div>

      {/* Studio Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Play/Pause & Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlayheadChange(0)}
            title="Return to start"
            className="p-2 rounded-lg bg-[#1f2937]/60 hover:bg-[#1f2937] text-[#cbc3d7] hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPlayheadChange(Math.max(0, playheadSec - 2))}
            title="Step back 2s"
            className="p-2 rounded-lg bg-[#1f2937]/60 hover:bg-[#1f2937] text-[#cbc3d7] hover:text-white transition-all cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>PLAY REEL</span>
              </>
            )}
          </button>

          <button
            onClick={() => onPlayheadChange(Math.min(durationSec, playheadSec + 2))}
            title="Step forward 2s"
            className="p-2 rounded-lg bg-[#1f2937]/60 hover:bg-[#1f2937] text-[#cbc3d7] hover:text-white transition-all cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            title="Loop playback"
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              isLooping 
                ? 'bg-[#8B5CF6]/20 text-[#d0bcff] border border-[#8B5CF6]/40' 
                : 'bg-[#1f2937]/60 text-[#958ea0] hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Controls (1x, 1.25x, 1.5x, 2x) */}
        <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded-lg border border-[#1f2937]">
          <span className="text-[10px] font-mono text-[#958ea0] px-1.5 hidden sm:inline">SPEED:</span>
          {[1, 1.25, 1.5, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => onSpeedChange(spd)}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-all cursor-pointer ${
                playbackSpeed === spd
                  ? 'bg-[#8B5CF6] text-white font-bold'
                  : 'text-[#958ea0] hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
