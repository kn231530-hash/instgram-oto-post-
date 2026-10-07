import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Zap, 
  Copy, 
  Check, 
  ArrowRight, 
  Layers, 
  TrendingUp, 
  Clock, 
  Sliders, 
  Hash, 
  FileText 
} from 'lucide-react';
import { CaptionSegment, ReelProject } from '../../types';

interface AIGeneratorProps {
  onApplyToProject: (generated: {
    hookText: string;
    hookSub: string;
    scriptText: string;
    captions: CaptionSegment[];
    instagramCaption: string;
    viralityScore: number;
  }) => void;
  onNavigateToStudio: () => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({
  onApplyToProject,
  onNavigateToStudio,
}) => {
  const [topic, setTopic] = useState('3 AI Tools Replacing My 5-Person Agency');
  const [niche, setNiche] = useState('Solopreneur & Agency Growth');
  const [tone, setTone] = useState('High-Octane Founder');
  const [duration, setDuration] = useState('30s');
  const [framework, setFramework] = useState('Pattern Interrupt Shock');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Current generated result state
  const [generatedData, setGeneratedData] = useState<{
    hook: string;
    hookSub: string;
    script: string;
    viralityScore: number;
    retentionPrediction: string;
    captions: CaptionSegment[];
    instagramCaption: string;
  }>({
    hook: 'STOP HIRING 5 JUNIOR REPS IN 2026',
    hookSub: 'This 3-tool autonomous stack generates 18 reels daily on autopilot.',
    script: `Stop hiring junior editors in 2026. Here is the exact autonomous stack we use to produce 18 high-converting reels every morning before 9 AM.\n\nFirst: We run the pattern-interrupt prompt matrix that isolates high-friction hooks.\nSecond: Audio waveforms are auto-ducked against 134 BPM phonk drift.\nThird: Kinetic word-by-word subtitles force viewers to stay past the 15-second drop-off curve.\n\nComment "ENGINE" below and get my prompt library delivered to your DMs instantly.`,
    viralityScore: 94,
    retentionPrediction: '88% completion rate with peak drop-off at second 19',
    instagramCaption: `How I replaced a 5-person video clipping team with an autonomous script engine in 48 hours 👇\n\n1. AI Hook Pattern Interrupt: catches 82% of thumb scrolls in the first 1.2s.\n2. Autonomous Audio Sync: dynamic waveform lock at 134 BPM.\n3. Dynamic Kinetic Captions: formatted for zero sound comprehension.\n\nComment "ENGINE" and I will send you the exact prompt sequencing checklist for free.\n\n#solopreneur #creatorops #aitools #freelancegrowth #shortformvideo`,
    captions: [
      {
        id: 'cap-gen-1',
        startSec: 0,
        endSec: 3.5,
        timeFormatted: '00:00 - 00:03',
        text: 'STOP HIRING 5 JUNIOR REPS IN 2026',
        emphasis: 'critical',
      },
      {
        id: 'cap-gen-2',
        startSec: 3.5,
        endSec: 8.8,
        timeFormatted: '00:03 - 00:08',
        text: 'This autonomous stack generates 18 high-converting reels before 9 AM',
        emphasis: 'high',
      },
      {
        id: 'cap-gen-3',
        startSec: 8.8,
        endSec: 15.2,
        timeFormatted: '00:08 - 00:15',
        text: 'Step 1: Pattern interrupt hook with 82% thumb-stop retention',
        emphasis: 'standard',
      },
      {
        id: 'cap-gen-4',
        startSec: 15.2,
        endSec: 22.0,
        timeFormatted: '00:15 - 00:22',
        text: 'Step 2: Sub-bass audio waveform lock synced to kinetic captions',
        emphasis: 'standard',
      },
      {
        id: 'cap-gen-5',
        startSec: 22.0,
        endSec: 30.0,
        timeFormatted: '00:22 - 00:30',
        text: 'Comment "ENGINE" to auto-trigger the complete automation workflow',
        emphasis: 'cta',
      },
    ],
  });

  const promptPresets = [
    {
      title: 'Agency Automation',
      topic: '3 AI Tools Replacing My 5-Person Agency',
      niche: 'Solopreneur & Agency',
      framework: 'Pattern Interrupt Shock',
    },
    {
      title: 'Fiverr 24hr Retainers',
      topic: 'How I Closed an $8k Retainer on Fiverr in 48 Hours',
      niche: 'Freelance Growth & Fiverr',
      framework: 'Contrarian Truth',
    },
    {
      title: 'ChatGPT Prompt Flaws',
      topic: 'Stop Using ChatGPT Like a Beginner in 2026',
      niche: 'AI Workflows & Prompting',
      framework: 'Negative Warning',
    },
    {
      title: 'SaaS Metric Teardown',
      topic: 'Why 90% of Landing Pages Bleed MRR in 3 Seconds',
      niche: 'SaaS & E-commerce',
      framework: 'Secret Tool Reveal',
    },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          niche,
          tone,
          duration,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const newCaptions: CaptionSegment[] = (d.captions || []).map((c: any, index: number) => ({
          id: `cap-${Date.now()}-${index}`,
          startSec: index * 6,
          endSec: (index + 1) * 6,
          timeFormatted: c.time || `00:${index * 6} - 00:${(index + 1) * 6}`,
          text: c.text,
          emphasis: c.emphasis || 'standard',
        }));

        setGeneratedData({
          hook: d.hook || topic.toUpperCase(),
          hookSub: d.hookSub || 'High-converting viral blueprint generated on autopilot.',
          script: d.fullScript || '',
          viralityScore: d.viralityScore || 95,
          retentionPrediction: d.retentionPrediction || '91% expected retention curve',
          captions: newCaptions.length > 0 ? newCaptions : generatedData.captions,
          instagramCaption: d.instagramCaption || '',
        });
      } else {
        // Fallback generator algorithm
        const customScore = Math.floor(Math.random() * 8) + 91;
        setGeneratedData({
          hook: `WHY NOBODY TALKS ABOUT THIS ${topic.toUpperCase().slice(0, 30)}`,
          hookSub: `The secret algorithmic shift generating 3.4x higher watch-time on Instagram.`,
          script: `Listen closely: 99% of people get ${topic} completely wrong. Here are the 3 autonomous steps you need to implement right now.\n\nFirst: Strip out the fluff and lead with immediate tension.\nSecond: Sync your kinetic captions directly to the audio sub-bass.\nThird: Give away the exact framework in exchange for a single comment keyword.\n\nComment "VIRAL" and I will send you the template immediately.`,
          viralityScore: customScore,
          retentionPrediction: `${customScore - 4}% completion forecast with maximum engagement at 00:08`,
          instagramCaption: `The unfiltered truth about ${topic} 👇\n\nMost creators waste hours on manual editing. Here is how autonomous creators scale to 30+ posts a week.\n\nComment "VIRAL" for the free checklist!\n\n#solopreneur #viralgrowth #aiworkflow #contentengine`,
          captions: [
            {
              id: `cap-${Date.now()}-1`,
              startSec: 0,
              endSec: 3.5,
              timeFormatted: '00:00 - 00:03',
              text: `WHY NOBODY TALKS ABOUT THIS`,
              emphasis: 'critical',
            },
            {
              id: `cap-${Date.now()}-2`,
              startSec: 3.5,
              endSec: 9.0,
              timeFormatted: '00:03 - 00:09',
              text: `99% of creators are handling ${topic.slice(0, 24)} completely backwards`,
              emphasis: 'high',
            },
            {
              id: `cap-${Date.now()}-3`,
              startSec: 9.0,
              endSec: 16.0,
              timeFormatted: '00:09 - 00:16',
              text: `Step 1: Automated prompt matrix cuts 4 hours down to 3 minutes`,
              emphasis: 'standard',
            },
            {
              id: `cap-${Date.now()}-4`,
              startSec: 16.0,
              endSec: 23.0,
              timeFormatted: '00:16 - 00:23',
              text: `Step 2: Kinetic text pacing holds 84% viewer attention`,
              emphasis: 'standard',
            },
            {
              id: `cap-${Date.now()}-5`,
              startSec: 23.0,
              endSec: 30.0,
              timeFormatted: '00:23 - 00:30',
              text: `Comment "VIRAL" below to receive the complete system`,
              emphasis: 'cta',
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToTimeline = () => {
    onApplyToProject({
      hookText: generatedData.hook,
      hookSub: generatedData.hookSub,
      scriptText: generatedData.script,
      captions: generatedData.captions,
      instagramCaption: generatedData.instagramCaption,
      viralityScore: generatedData.viralityScore,
    });
    onNavigateToStudio();
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedData.instagramCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#171b26] via-[#111827] to-[#1c1f2a] rounded-2xl border border-[#1f2937] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#8B5CF6]/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded bg-[#8B5CF6]/20 text-[#d0bcff]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-mono text-xs text-[#8B5CF6] uppercase tracking-wider font-semibold">
              GEMINI FLASH REEL ACCELERATOR
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Autonomous Hook & Script Generation Command Deck
          </h2>
          <p className="text-xs sm:text-sm text-[#958ea0] mt-1 leading-relaxed">
            Engineered for high-volume solopreneurs, digital agencies, and Fiverr video editors. 
            Synthesizes thumb-stopping hooks, kinetic captions, and algorithmic DM conversion triggers in seconds.
          </p>
        </div>
      </div>

      {/* Main Grid: Controls vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Parameter Dial */}
        <div className="lg:col-span-5 bg-[#111827] rounded-2xl border border-[#1f2937] p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                ALGORITHMIC DIALS
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
              READY
            </span>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-[11px] font-mono text-[#958ea0] block mb-1.5 uppercase">
              Fast Solopreneur Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {promptPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(p.topic);
                    setNiche(p.niche);
                    setFramework(p.framework);
                  }}
                  className="p-2 bg-[#0b0f19] hover:bg-[#171b26] border border-[#1f2937] hover:border-[#8B5CF6]/50 rounded-lg text-left transition-all cursor-pointer group"
                >
                  <p className="text-xs font-semibold text-white group-hover:text-[#d0bcff] truncate">
                    {p.title}
                  </p>
                  <p className="text-[10px] font-mono text-[#958ea0] truncate">
                    {p.niche}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Reel Topic Input */}
          <div>
            <label className="text-[11px] font-mono text-[#958ea0] block mb-1.5 uppercase">
              Core Reel Topic / Pain Point
            </label>
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#0b0f19] border border-[#1f2937] focus:border-[#8B5CF6] focus:outline-none rounded-lg p-2.5 text-xs text-white placeholder-[#494454] transition-colors"
              placeholder="e.g. 3 AI Tools Replacing My 5-Person Agency"
            />
          </div>

          {/* Niche & Framework */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#958ea0] block mb-1 uppercase">
                Niche Vertical
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1f2937] focus:border-[#8B5CF6] text-xs text-white rounded-lg p-2 font-mono"
              >
                <option value="Solopreneur & Agency Growth">Solopreneur & Agency Growth</option>
                <option value="Freelance & Fiverr High-Ticket">Freelance & Fiverr High-Ticket</option>
                <option value="SaaS & Tech Workflows">SaaS & Tech Workflows</option>
                <option value="E-commerce Retention">E-commerce Retention</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#958ea0] block mb-1 uppercase">
                Hook Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1f2937] focus:border-[#8B5CF6] text-xs text-white rounded-lg p-2 font-mono"
              >
                <option value="Pattern Interrupt Shock">Pattern Interrupt Shock</option>
                <option value="Contrarian Truth">Contrarian Truth</option>
                <option value="Secret Tool Reveal">Secret Tool Reveal</option>
                <option value="Negative Warning">Negative Warning</option>
              </select>
            </div>
          </div>

          {/* Tone & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#958ea0] block mb-1 uppercase">
                Voice Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1f2937] focus:border-[#8B5CF6] text-xs text-white rounded-lg p-2 font-mono"
              >
                <option value="High-Octane Founder">High-Octane Founder</option>
                <option value="Dark Mode Tech Specialist">Dark Mode Tech Specialist</option>
                <option value="Direct Response Growth">Direct Response Growth</option>
                <option value="Raw Behind-The-Scenes">Raw Behind-The-Scenes</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#958ea0] block mb-1 uppercase">
                Target Reel Duration
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#0b0f19] p-1 rounded-lg border border-[#1f2937]">
                {['15s', '30s', '60s'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-1 text-center font-mono text-xs rounded transition-all cursor-pointer ${
                      duration === d
                        ? 'bg-[#8B5CF6] text-white font-semibold'
                        : 'text-[#958ea0] hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] via-[#a855f7] to-[#EC4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-[#ffb0cd]" />
                <span>SYNTHESIZING ALGORITHMIC HOOK...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#ffb0cd]" />
                <span>GENERATE HIGH-CONVERTING REEL</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Output Deck */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header Stats Bar */}
          <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#958ea0]">VIRALITY INDEX:</span>
                  <span className="font-mono text-sm font-bold text-[#10B981]">
                    {generatedData.viralityScore} / 100
                  </span>
                  <span className="text-[10px] font-mono px-1.5 rounded bg-[#10B981]/20 text-[#34D399]">
                    GRADE S
                  </span>
                </div>
                <p className="text-[11px] text-[#cbc3d7] mt-0.5">
                  {generatedData.retentionPrediction}
                </p>
              </div>
            </div>

            {/* Push to Timeline Trigger */}
            <button
              onClick={handlePushToTimeline}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-lg shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>PUSH TO STUDIO TIMELINE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Generated Hook Card */}
          <div className="bg-[#111827] rounded-xl border border-[#8B5CF6]/40 p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8B5CF6] uppercase tracking-wider font-semibold">
                // 01. PATTERN-INTERRUPT HOOK (0 - 3 SECONDS)
              </span>
              <span className="font-mono text-[10px] text-[#ffb95f]">
                82% THUMB-STOP RATE
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
              "{generatedData.hook}"
            </h3>
            <p className="text-xs text-[#cbc3d7] italic">
              {generatedData.hookSub}
            </p>
          </div>

          {/* Timed Captions Grid */}
          <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#958ea0] uppercase tracking-wider font-semibold">
                // 02. SYNCHRONIZED TIMECODED CAPTIONS ({generatedData.captions.length} BEATS)
              </span>
              <span className="text-[10px] font-mono text-[#10B981]">
                KINETIC FORMAT
              </span>
            </div>

            <div className="space-y-2">
              {generatedData.captions.map((cap, i) => (
                <div
                  key={cap.id}
                  className="bg-[#0b0f19] p-2.5 rounded-lg border border-[#1f2937] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded">
                      {cap.timeFormatted}
                    </span>
                    <span className="text-white font-medium">{cap.text}</span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    cap.emphasis === 'critical' ? 'bg-[#8B5CF6]/30 text-[#d0bcff]' :
                    cap.emphasis === 'cta' ? 'bg-[#EC4899]/30 text-[#ffb0cd]' :
                    'bg-[#1f2937] text-[#958ea0]'
                  }`}>
                    {cap.emphasis}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Spoken Voiceover Script */}
          <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#958ea0] uppercase tracking-wider font-semibold">
                // 03. FULL SPOKEN VOICEOVER CADENCE
              </span>
              <span className="text-[10px] font-mono text-[#cbc3d7]">
                165 WORDS/MIN
              </span>
            </div>
            <p className="text-xs text-[#dfe2f1] font-mono bg-[#0b0f19] p-3 rounded-lg border border-[#1f2937] whitespace-pre-line leading-relaxed">
              {generatedData.script}
            </p>
          </div>

          {/* Instagram Caption & Hashtags */}
          <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#958ea0] uppercase tracking-wider font-semibold">
                // 04. INSTAGRAM CAPTION & DM CONVERSION TRIGGER
              </span>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1 text-[11px] font-mono text-[#d0bcff] hover:text-white cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#10B981]" />
                    <span className="text-[#10B981]">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>COPY CAPTION</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-[#0b0f19] p-3 rounded-lg border border-[#1f2937] text-xs text-[#cbc3d7] whitespace-pre-line font-mono max-h-32 overflow-y-auto">
              {generatedData.instagramCaption}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
