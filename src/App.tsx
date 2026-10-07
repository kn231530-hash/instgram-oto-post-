/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ReelStudio } from './components/ReelStudio/ReelStudio';
import { AIGenerator } from './components/AIGenerator/AIGenerator';
import { GrowthTelemetry } from './components/GrowthTelemetry/GrowthTelemetry';
import { DeliverableVault } from './components/DeliverableVault/DeliverableVault';
import { BottomCommandDock } from './components/BottomCommandDock';
import { ExportModal } from './components/ExportModal';
import { 
  INITIAL_PROJECT, 
  SAMPLE_AUDIO_TRACKS, 
  VIDEO_PRESETS, 
  SAMPLE_SCHEDULED_POSTS, 
  SAMPLE_CLIENT_ORDERS, 
  RETENTION_HEATMAP 
} from './data/mockData';
import { AspectRatio, CaptionStyle, ReelProject, ScheduledPost, ClientOrder } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'ai' | 'growth' | 'vault'>('studio');
  const [project, setProject] = useState<ReelProject>(INITIAL_PROJECT);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(SAMPLE_SCHEDULED_POSTS);
  const [clientOrders, setClientOrders] = useState<ClientOrder[]>(SAMPLE_CLIENT_ORDERS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const lastFrameTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastFrameTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      setProject((prev) => {
        let nextPlayhead = prev.currentPlayhead + deltaSec * prev.playbackSpeed;
        if (nextPlayhead >= prev.trimEnd) {
          nextPlayhead = prev.trimStart; // loop around
        }
        return {
          ...prev,
          currentPlayhead: nextPlayhead,
        };
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Handlers
  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePlayheadChange = (timeSec: number) => {
    setProject((prev) => ({
      ...prev,
      currentPlayhead: Math.max(0, Math.min(prev.durationSec, timeSec)),
    }));
  };

  const handleTrimChange = (startSec: number, endSec: number) => {
    setProject((prev) => ({
      ...prev,
      trimStart: startSec,
      trimEnd: endSec,
      currentPlayhead: Math.max(startSec, Math.min(endSec, prev.currentPlayhead)),
    }));
  };

  const handleAspectChange = (aspectRatio: AspectRatio) => {
    setProject((prev) => ({ ...prev, aspectRatio }));
  };

  const handleCaptionStyleChange = (captionStyle: CaptionStyle) => {
    setProject((prev) => ({ ...prev, captionStyle }));
  };

  const handleToggleWatermark = () => {
    setProject((prev) => ({ ...prev, watermarkActive: !prev.watermarkActive }));
  };

  const handleUpdateWatermarkText = (text: string) => {
    setProject((prev) => ({ ...prev, watermarkText: text }));
  };

  const handleSelectAudioTrack = (trackId: string) => {
    setProject((prev) => ({ ...prev, audioTrackId: trackId }));
  };

  const handleVolumeChange = (vol: number) => {
    setProject((prev) => ({ ...prev, audioVolume: vol }));
  };

  const handleToggleDucking = () => {
    setProject((prev) => ({ ...prev, audioDucking: !prev.audioDucking }));
  };

  const handleSpeedChange = (speed: number) => {
    setProject((prev) => ({ ...prev, playbackSpeed: speed }));
  };

  const handleSelectPreset = (presetId: string) => {
    setProject((prev) => ({ ...prev, videoPresetId: presetId }));
  };

  const handleUpdateCaptionText = (id: string, text: string) => {
    setProject((prev) => ({
      ...prev,
      captions: prev.captions.map((c) => (c.id === id ? { ...c, text } : c)),
    }));
  };

  const handleApplyAIGenerated = (generated: any) => {
    setProject((prev) => ({
      ...prev,
      hookText: generated.hookText,
      hookSub: generated.hookSub,
      scriptText: generated.scriptText,
      captions: generated.captions,
      instagramCaption: generated.instagramCaption,
      viralityScore: generated.viralityScore,
      currentPlayhead: 0,
    }));
  };

  const handlePublishPost = (postId: string) => {
    setScheduledPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, status: 'published', timeRemaining: 'Published' }
          : p
      )
    );
  };

  const handleJumpToFeedbackPin = (timeSec: number) => {
    setActiveTab('studio');
    handlePlayheadChange(timeSec);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#dfe2f1] flex flex-col font-sans selection:bg-[#8B5CF6]/30">
      {/* Studio Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onOpenExport={() => setIsExportModalOpen(true)}
        activeOrderCount={clientOrders.filter((o) => o.status !== 'approved').length}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 pb-24 pt-4 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Phone Shell Simulator (if toggled) */}
          {isMobileFrame ? (
            <div className="flex justify-center py-4">
              <div className="w-[390px] min-h-[800px] bg-[#0f131d] rounded-[48px] border-[6px] border-[#262a35] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative">
                {/* Phone Speaker & Dynamic Island Notch */}
                <div className="w-full h-8 bg-[#0a0e18] flex items-center justify-between px-6 text-[10px] font-mono text-[#958ea0] border-b border-[#1f2937]/50">
                  <span>09:41</span>
                  <div className="w-20 h-3 bg-black rounded-full" />
                  <span>5G 100%</span>
                </div>

                {/* Mobile View Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeTab === 'studio' && (
                    <ReelStudio
                      project={project}
                      audioTracks={SAMPLE_AUDIO_TRACKS}
                      videoPresets={VIDEO_PRESETS}
                      feedbackPins={clientOrders[0]?.feedbackPins}
                      isPlaying={isPlaying}
                      onTogglePlay={handleTogglePlay}
                      onPlayheadChange={handlePlayheadChange}
                      onTrimChange={handleTrimChange}
                      onAspectChange={handleAspectChange}
                      onCaptionStyleChange={handleCaptionStyleChange}
                      onToggleWatermark={handleToggleWatermark}
                      onSelectAudioTrack={handleSelectAudioTrack}
                      onVolumeChange={handleVolumeChange}
                      onToggleDucking={handleToggleDucking}
                      onSpeedChange={handleSpeedChange}
                      onSelectPreset={handleSelectPreset}
                      onUpdateCaptionText={handleUpdateCaptionText}
                      onQuickPublish={() => setIsExportModalOpen(true)}
                    />
                  )}

                  {activeTab === 'ai' && (
                    <AIGenerator
                      onApplyToProject={handleApplyAIGenerated}
                      onNavigateToStudio={() => setActiveTab('studio')}
                    />
                  )}

                  {activeTab === 'growth' && (
                    <GrowthTelemetry
                      scheduledPosts={scheduledPosts}
                      heatmapData={RETENTION_HEATMAP}
                      onPublishNow={handlePublishPost}
                      onSeekTimelineSec={handlePlayheadChange}
                    />
                  )}

                  {activeTab === 'vault' && (
                    <DeliverableVault
                      orders={clientOrders}
                      watermarkActive={project.watermarkActive}
                      onToggleWatermark={handleToggleWatermark}
                      watermarkText={project.watermarkText}
                      onUpdateWatermarkText={handleUpdateWatermarkText}
                      onJumpToFeedbackPin={handleJumpToFeedbackPin}
                      onOpenExportModal={() => setIsExportModalOpen(true)}
                    />
                  )}
                </div>

                {/* Phone Bottom Home Bar */}
                <div className="w-full h-6 bg-[#0a0e18] flex items-center justify-center">
                  <div className="w-32 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
          ) : (
            /* Full-Width Desktop Workspace */
            <div className="w-full">
              {activeTab === 'studio' && (
                <ReelStudio
                  project={project}
                  audioTracks={SAMPLE_AUDIO_TRACKS}
                  videoPresets={VIDEO_PRESETS}
                  feedbackPins={clientOrders[0]?.feedbackPins}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onPlayheadChange={handlePlayheadChange}
                  onTrimChange={handleTrimChange}
                  onAspectChange={handleAspectChange}
                  onCaptionStyleChange={handleCaptionStyleChange}
                  onToggleWatermark={handleToggleWatermark}
                  onSelectAudioTrack={handleSelectAudioTrack}
                  onVolumeChange={handleVolumeChange}
                  onToggleDucking={handleToggleDucking}
                  onSpeedChange={handleSpeedChange}
                  onSelectPreset={handleSelectPreset}
                  onUpdateCaptionText={handleUpdateCaptionText}
                  onQuickPublish={() => setIsExportModalOpen(true)}
                />
              )}

              {activeTab === 'ai' && (
                <AIGenerator
                  onApplyToProject={handleApplyAIGenerated}
                  onNavigateToStudio={() => setActiveTab('studio')}
                />
              )}

              {activeTab === 'growth' && (
                <GrowthTelemetry
                  scheduledPosts={scheduledPosts}
                  heatmapData={RETENTION_HEATMAP}
                  onPublishNow={handlePublishPost}
                  onSeekTimelineSec={handlePlayheadChange}
                />
              )}

              {activeTab === 'vault' && (
                <DeliverableVault
                  orders={clientOrders}
                  watermarkActive={project.watermarkActive}
                  onToggleWatermark={handleToggleWatermark}
                  watermarkText={project.watermarkText}
                  onUpdateWatermarkText={handleUpdateWatermarkText}
                  onJumpToFeedbackPin={handleJumpToFeedbackPin}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Command Dock */}
      <BottomCommandDock
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        playheadSec={project.currentPlayhead}
        durationSec={project.durationSec}
        onQuickGenerate={() => setActiveTab('ai')}
        onOpenExport={() => setIsExportModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Export Pipeline Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
      />
    </div>
  );
}
