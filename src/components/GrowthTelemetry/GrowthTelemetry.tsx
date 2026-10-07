import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Instagram, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Share2, 
  Zap, 
  BarChart3, 
  Calendar 
} from 'lucide-react';
import { HeatmapPoint, ScheduledPost } from '../../types';
import confetti from 'canvas-confetti';

interface GrowthTelemetryProps {
  scheduledPosts: ScheduledPost[];
  heatmapData: HeatmapPoint[];
  onPublishNow: (postId: string) => void;
  onSeekTimelineSec?: (sec: number) => void;
}

export const GrowthTelemetry: React.FC<GrowthTelemetryProps> = ({
  scheduledPosts,
  heatmapData,
  onPublishNow,
  onSeekTimelineSec,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint>(heatmapData[3]);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishConfirmation, setPublishConfirmation] = useState<string | null>(null);

  const handleTriggerPublish = (post: ScheduledPost) => {
    setPublishingId(post.id);
    setTimeout(() => {
      onPublishNow(post.id);
      setPublishingId(null);
      setPublishConfirmation(`Successfully synchronized & published "${post.title}" directly to Instagram Reels!`);
      // Celebratory particle burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
      });
      setTimeout(() => setPublishConfirmation(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Publication Confirmation Banner (Instagram Gradient Accent #EC4899 to #F59E0B) */}
      {publishConfirmation && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#F59E0B] text-white shadow-xl shadow-[#EC4899]/25 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-black/20">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide">
                INSTAGRAM GRAPH API · BROADCAST CONFIRMED
              </p>
              <p className="text-xs text-white/90 font-medium">
                {publishConfirmation}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPublishConfirmation(null)}
            className="text-white/80 hover:text-white text-xs font-mono px-2 py-1 bg-black/20 rounded cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Top Telemetry Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#958ea0] mb-2 font-mono text-xs">
            <span>LIVE IG VECTOR</span>
            <span className="flex items-center gap-1 text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              SYNCED
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight font-sans">
            98.8%
          </div>
          <p className="text-[11px] text-[#958ea0] mt-1">
            24ms latency to Meta Reels ingestion endpoint
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4">
          <div className="flex items-center justify-between text-[#958ea0] mb-2 font-mono text-xs">
            <span>AUDIENCE PEAK SLOT</span>
            <span className="text-[#F59E0B] font-mono">18:45 GMT</span>
          </div>
          <div className="text-2xl font-bold text-[#ffb95f] tracking-tight">
            3.4x REACH
          </div>
          <p className="text-[11px] text-[#958ea0] mt-1">
            Predicted viral multiplier for current queue
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4">
          <div className="flex items-center justify-between text-[#958ea0] mb-2 font-mono text-xs">
            <span>AVG HOOK RETENTION</span>
            <span className="text-[#8B5CF6] font-mono">0-3 SEC</span>
          </div>
          <div className="text-2xl font-bold text-[#d0bcff] tracking-tight">
            81.4%
          </div>
          <p className="text-[11px] text-[#958ea0] mt-1">
            +18% above creator average baseline
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4">
          <div className="flex items-center justify-between text-[#958ea0] mb-2 font-mono text-xs">
            <span>AUTO DM CONVERSIONS</span>
            <span className="text-[#EC4899] font-mono">KEYWORD TRIGGER</span>
          </div>
          <div className="text-2xl font-bold text-[#ffb0cd] tracking-tight">
            2,480 DMs
          </div>
          <p className="text-[11px] text-[#958ea0] mt-1">
            Keyword "ENGINE" automated templates sent
          </p>
        </div>
      </div>

      {/* Main Heatmap Retention Curve Section */}
      <div className="bg-[#111827] rounded-2xl border border-[#1f2937] p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f2937]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F59E0B] text-white">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                AUTOMATED CONVERSION HEATMAP & RETENTION CURVE
              </h3>
              <p className="text-xs text-[#958ea0]">
                Second-by-second drop-off trajectory across the 30-second duration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#8B5CF6] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
              0-3s Hook Zone
            </span>
            <span className="text-[#958ea0]">/</span>
            <span className="text-[#10B981] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              4-22s Value Plateau
            </span>
            <span className="text-[#958ea0]">/</span>
            <span className="text-[#EC4899] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
              23-30s CTA Spike
            </span>
          </div>
        </div>

        {/* Interactive SVG Retention Curve Graph */}
        <div className="relative h-56 w-full bg-[#0b0f19] rounded-xl border border-[#1f2937] p-4 select-none">
          {/* Background grid lines */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-dashed border-[#494454] w-full text-[10px] font-mono text-[#958ea0]">100%</div>
            <div className="border-b border-dashed border-[#494454] w-full text-[10px] font-mono text-[#958ea0]">80%</div>
            <div className="border-b border-dashed border-[#494454] w-full text-[10px] font-mono text-[#958ea0]">60%</div>
            <div className="border-b border-dashed border-[#494454] w-full text-[10px] font-mono text-[#958ea0]">40%</div>
          </div>

          {/* Critical Zones Highlight Overlays */}
          <div className="absolute inset-y-0 left-0 w-[10%] bg-[#8B5CF6]/10 border-r border-[#8B5CF6]/30 pointer-events-none">
            <span className="absolute top-2 left-2 text-[9px] font-mono text-[#d0bcff] uppercase">
              HOOK ZONE
            </span>
          </div>
          <div className="absolute inset-y-0 right-0 w-[24%] bg-[#EC4899]/10 border-l border-[#EC4899]/30 pointer-events-none">
            <span className="absolute top-2 right-2 text-[9px] font-mono text-[#ffb0cd] uppercase">
              CTA TRIGGER
            </span>
          </div>

          {/* SVG Line and Points */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
            {/* Gradient definition */}
            <defs>
              <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EC4899" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area under curve */}
            <path
              d={`
                M 0 0
                ${heatmapData.map((pt) => `L ${(pt.second / 30) * 1000} ${(100 - pt.retentionPct) * 4}`).join(' ')}
                L 1000 200
                L 0 200
                Z
              `}
              fill="url(#retentionGrad)"
            />

            {/* Main Stroke Line */}
            <path
              d={`
                M 0 0
                ${heatmapData.map((pt) => `L ${(pt.second / 30) * 1000} ${(100 - pt.retentionPct) * 4}`).join(' ')}
              `}
              fill="none"
              stroke="#EC4899"
              strokeWidth="3"
            />
          </svg>

          {/* Interactive clickable data points on the curve */}
          {heatmapData.map((pt) => {
            const leftPct = (pt.second / 30) * 100;
            const topPct = (100 - pt.retentionPct) * 2; // scale for visualization
            const isSelected = selectedPoint.second === pt.second;

            return (
              <button
                key={pt.second}
                onClick={() => {
                  setSelectedPoint(pt);
                  if (onSeekTimelineSec) {
                    onSeekTimelineSec(pt.second);
                  }
                }}
                style={{
                  left: `${leftPct}%`,
                  top: `${Math.min(80, Math.max(10, topPct))}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all cursor-pointer z-20 ${
                  isSelected
                    ? 'bg-white ring-4 ring-[#EC4899] shadow-lg shadow-[#EC4899]/50 scale-125'
                    : 'bg-[#EC4899] hover:scale-125'
                }`}
                title={`Second ${pt.second}: ${pt.retentionPct}% retention`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#0b0f19]" />
              </button>
            );
          })}
        </div>

        {/* Selected Heatmap Point Diagnostic Inspector */}
        {selectedPoint && (
          <div className="bg-[#0b0f19] p-3.5 rounded-xl border border-[#1f2937] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#8B5CF6]/15 text-[#d0bcff] font-mono text-xs font-bold">
                00:{selectedPoint.second.toString().padStart(2, '0')}s
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">
                    RETENTION FORECAST: {selectedPoint.retentionPct}%
                  </span>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    selectedPoint.dropRisk === 'critical' ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' :
                    selectedPoint.dropRisk === 'moderate' ? 'bg-[#ffb95f]/20 text-[#ffb95f]' :
                    'bg-[#10B981]/20 text-[#34D399]'
                  }`}>
                    {selectedPoint.dropRisk} drop risk
                  </span>
                </div>
                <p className="text-xs text-[#cbc3d7] mt-0.5">
                  {selectedPoint.insight}
                </p>
              </div>
            </div>

            <div className="font-mono text-[11px] text-[#958ea0] self-end sm:self-center">
              ZONE: <span className="text-[#d0bcff] uppercase">{selectedPoint.zone}</span>
            </div>
          </div>
        )}
      </div>

      {/* Autonomous Content Sequencer Queue */}
      <div className="bg-[#111827] rounded-2xl border border-[#1f2937] p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              AUTONOMOUS BROADCAST QUEUE ({scheduledPosts.length} SEQUENCED)
            </h3>
          </div>

          <span className="font-mono text-[10px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
            AUTO-DISPATCH ENGINE ON
          </span>
        </div>

        {/* Posts Queue Table */}
        <div className="space-y-3">
          {scheduledPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0b0f19] p-4 rounded-xl border border-[#1f2937] hover:border-[#374151] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-[#111827] border border-[#1f2937] text-white">
                  <Instagram className="w-4 h-4 text-[#EC4899]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      {post.title}
                    </h4>
                    {post.clientOrderId && (
                      <span className="font-mono text-[10px] text-[#ffb95f] bg-[#ffb95f]/15 px-1.5 py-0.5 rounded border border-[#ffb95f]/30">
                        {post.clientOrderId}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#958ea0] mt-1">
                    <span>{post.scheduledTime}</span>
                    <span>·</span>
                    <span className="text-[#cbc3d7]">Est: {post.expectedViews} views</span>
                    <span>·</span>
                    <span className="text-[#10B981]">Virality Grade {post.viralityGrade}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Status Telemetry Badge */}
                <div>
                  {post.status === 'synced' && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#34D399] bg-[#10B981]/15 border border-[#10B981]/30 px-2.5 py-1 rounded-md studio-glow-emerald">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                      SYNCED · {post.timeRemaining}
                    </span>
                  )}
                  {post.status === 'queued' && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2.5 py-1 rounded-md animate-pulse">
                      QUEUED · {post.timeRemaining}
                    </span>
                  )}
                  {post.status === 'rendering' && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#ffb95f] bg-[#F59E0B]/15 border border-[#F59E0B]/30 px-2.5 py-1 rounded-md">
                      RENDERING
                    </span>
                  )}
                  {post.status === 'published' && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#cbc3d7] bg-[#1f2937] border border-[#374151] px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                      PUBLISHED
                    </span>
                  )}
                </div>

                {/* Instant Publish Button */}
                {post.status !== 'published' && (
                  <button
                    onClick={() => handleTriggerPublish(post)}
                    disabled={publishingId === post.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#EC4899] to-[#F59E0B] hover:opacity-90 text-white font-mono text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {publishingId === post.id ? (
                      <>
                        <Zap className="w-3.5 h-3.5 animate-spin" />
                        <span>DISPATCHING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>PUBLISH NOW</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
