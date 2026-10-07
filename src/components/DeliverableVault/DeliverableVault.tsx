import React, { useState } from 'react';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  Download, 
  Play, 
  FileCheck, 
  ShieldAlert, 
  Sparkles,
  Zap,
  FolderDown
} from 'lucide-react';
import { ClientOrder, FeedbackPin } from '../../types';

interface DeliverableVaultProps {
  orders: ClientOrder[];
  watermarkActive: boolean;
  onToggleWatermark: () => void;
  watermarkText: string;
  onUpdateWatermarkText: (txt: string) => void;
  onJumpToFeedbackPin: (timeSec: number) => void;
  onOpenExportModal: () => void;
}

export const DeliverableVault: React.FC<DeliverableVaultProps> = ({
  orders,
  watermarkActive,
  onToggleWatermark,
  watermarkText,
  onUpdateWatermarkText,
  onJumpToFeedbackPin,
  onOpenExportModal,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [isBatchRendering, setIsBatchRendering] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.value, 0);
  const totalReels = orders.reduce((acc, curr) => acc + curr.reelsTotal, 0);
  const completedReels = orders.reduce((acc, curr) => acc + curr.reelsCompleted, 0);

  const handleStartBatchRender = () => {
    setIsBatchRendering(true);
    setBatchProgress(0);
    const interval = setInterval(() => {
      setBatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBatchRendering(false);
          // Download simulation
          const element = document.createElement("a");
          const file = new Blob([JSON.stringify(selectedOrder, null, 2)], { type: 'application/json' });
          element.href = URL.createObjectURL(file);
          element.download = `${selectedOrder.orderNumber}_CLIENT_DELIVERABLES.json`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Solopreneur Metric Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4">
          <div className="flex items-center justify-between text-[#958ea0] mb-1 font-mono text-xs">
            <span>ACTIVE FREELANCE CONTRACTS</span>
            <DollarSign className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-white font-sans">
            ${totalRevenue.toLocaleString()} USD
          </div>
          <p className="text-[11px] text-[#958ea0] mt-1 font-mono">
            {orders.length} Active client accounts across Fiverr & Retainers
          </p>
        </div>

        <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4">
          <div className="flex items-center justify-between text-[#958ea0] mb-1 font-mono text-xs">
            <span>REELS PROCESSED TODAY</span>
            <FileCheck className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-bold text-[#d0bcff] font-sans">
            {completedReels} / {totalReels} REELS
          </div>
          <p className="text-[11px] text-[#958ea0] mt-1 font-mono">
            {Math.round((completedReels / totalReels) * 100)}% Overall milestone delivery rate
          </p>
        </div>

        <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4">
          <div className="flex items-center justify-between text-[#958ea0] mb-1 font-mono text-xs">
            <span>CLIENT WATERMARK STATUS</span>
            <ShieldAlert className="w-4 h-4 text-[#ffb95f]" />
          </div>
          <div className="text-2xl font-bold text-white font-sans">
            {watermarkActive ? 'PROTECTION ON' : 'CLEAN UNLOCKED'}
          </div>
          <p className="text-[11px] text-[#ffb95f] mt-1 font-mono">
            {watermarkActive ? 'Draft watermarking enabled' : 'Ready for commercial handover'}
          </p>
        </div>
      </div>

      {/* Main Layout: Orders List & Client Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Client Orders Queue */}
        <div className="lg:col-span-5 bg-[#111827] rounded-2xl border border-[#1f2937] p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                CLIENT CONTRACT QUEUE
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#d0bcff] bg-[#8B5CF6]/15 px-2 py-0.5 rounded border border-[#8B5CF6]/30">
              {orders.length} ACCOUNTS
            </span>
          </div>

          <div className="space-y-2.5">
            {orders.map((ord) => {
              const isSelected = ord.id === selectedOrderId;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#171b26] border-[#8B5CF6] shadow-md shadow-[#8B5CF6]/15'
                      : 'bg-[#0b0f19] border-[#1f2937] hover:border-[#374151]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {ord.clientName}
                        </span>
                        <span className="font-mono text-[10px] text-[#958ea0]">
                          {ord.clientHandle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#958ea0] mt-1">
                        <span className="text-[#8B5CF6] font-semibold">{ord.orderNumber}</span>
                        <span>·</span>
                        <span>{ord.platformSource}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#10B981]">
                        ${ord.value}
                      </span>
                      <p className="text-[10px] font-mono text-[#958ea0] mt-0.5">
                        {ord.deadline}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#958ea0] mb-1">
                      <span>Delivery Progress</span>
                      <span className="text-white">
                        {ord.reelsCompleted} / {ord.reelsTotal} Reels
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-full transition-all"
                        style={{
                          width: `${(ord.reelsCompleted / ord.reelsTotal) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Feedback Pins & Watermark Controller */}
        <div className="lg:col-span-7 space-y-4">
          {selectedOrder && (
            <>
              {/* Order Header Card */}
              <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {selectedOrder.clientName} ({selectedOrder.orderNumber})
                    </h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#d0bcff] border border-[#8B5CF6]/40">
                      {selectedOrder.platformSource}
                    </span>
                  </div>
                  <p className="text-xs text-[#958ea0] mt-1">
                    Contract Deliverable: {selectedOrder.reelsTotal} High-Impact Vertical Reels · Due: {selectedOrder.deadline}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenExportModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-lg shadow-md cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT CLIENT SET</span>
                  </button>
                </div>
              </div>

              {/* Timestamped Client Feedback Pins */}
              <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#ffb95f]" />
                    <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                      TIMECODED CLIENT FEEDBACK PINS
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-[#958ea0]">
                    {selectedOrder.feedbackPins.length} REVISION NOTES
                  </span>
                </div>

                {selectedOrder.feedbackPins.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#958ea0]">
                    <CheckCircle2 className="w-6 h-6 text-[#10B981] mx-auto mb-2" />
                    No revision pins pending. Client approved all frames!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedOrder.feedbackPins.map((pin) => (
                      <div
                        key={pin.id}
                        className="bg-[#0b0f19] p-3 rounded-lg border border-[#1f2937] flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onJumpToFeedbackPin(pin.timeSec)}
                              className="font-mono text-[11px] font-bold text-[#ffb95f] bg-[#ffb95f]/15 px-2 py-0.5 rounded border border-[#ffb95f]/30 hover:bg-[#ffb95f]/25 transition-colors cursor-pointer flex items-center gap-1"
                              title="Click to seek timeline directly to this feedback point"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>{pin.timeFormatted}</span>
                            </button>
                            <span className="text-[#cbc3d7] font-semibold">{pin.author}</span>
                            <span className="text-[10px] font-mono text-[#958ea0]">({pin.authorRole})</span>
                          </div>
                          <p className="text-xs text-[#dfe2f1]">
                            "{pin.comment}"
                          </p>
                        </div>

                        <div>
                          {pin.resolved ? (
                            <span className="font-mono text-[10px] text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                              RESOLVED
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] text-[#ffb4ab] bg-[#ffb4ab]/15 px-2 py-0.5 rounded border border-[#ffb4ab]/30">
                              OPEN FIX
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Watermark Protection Controls */}
              <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                    <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                      CLIENT PROTECTION WATERMARK
                    </h4>
                  </div>
                  <button
                    onClick={onToggleWatermark}
                    className={`font-mono text-xs px-3 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                      watermarkActive
                        ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#ffb95f]'
                        : 'bg-[#1f2937] border-[#374151] text-[#958ea0]'
                    }`}
                  >
                    {watermarkActive ? 'WATERMARK APPLIED' : 'DISABLED'}
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#958ea0] block mb-1 uppercase">
                    Watermark Overlay Stamp Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => onUpdateWatermarkText(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-[#1f2937] focus:border-[#8B5CF6] text-xs font-mono text-white p-2.5 rounded-lg"
                  />
                  <p className="text-[10px] text-[#958ea0] mt-1">
                    Protects your delivery files from unpaid reposting on Instagram or TikTok before final contract release.
                  </p>
                </div>
              </div>

              {/* Batch Render Progress Section */}
              <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    BATCH EXPORT ALL {selectedOrder.reelsTotal} REELS
                  </span>
                  <span className="text-[11px] font-mono text-[#958ea0]">
                    PRORES 422 + 4K MP4
                  </span>
                </div>

                {isBatchRendering ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8B5CF6]">RENDERING SEQUENCER ENGINES...</span>
                      <span className="text-white font-bold">{batchProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#0b0f19] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] rounded-full transition-all duration-200"
                        style={{ width: `${batchProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleStartBatchRender}
                    className="w-full py-2.5 bg-[#1f2937] hover:bg-[#262a35] border border-[#374151] hover:border-[#8B5CF6] text-white text-xs font-mono font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FolderDown className="w-4 h-4 text-[#d0bcff]" />
                    <span>START BATCH RENDER & PACKAGING</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
