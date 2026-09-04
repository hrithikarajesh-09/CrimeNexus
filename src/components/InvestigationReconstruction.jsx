import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Cpu, Volume2, VolumeX, ShieldAlert, GitBranch, FileText, CheckCircle2, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function InvestigationReconstruction({ onSelectEntity, onOpenCase }) {
  const events = RAW_DATASET.groundTruth.chronological_reconstruction_events;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Playback Timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < events.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 4000); // Advance every 4 seconds
    }
    return () => clearInterval(interval);
  }, [isPlaying, events.length]);

  const currentEvent = events[currentStepIndex];

  const handleStart = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Signature Banner */}
      <div className="bg-[#131A26] border border-[#D4A359]/30 rounded-[8px] p-6 shadow-none relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-[#D4A359] border border-[#D4A359]/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A359]" />
                SECTION 6 &bull; SIGNATURE AI FEATURE
              </span>
              <span className="text-xs text-[#94A3B8] font-medium">Fact-Strict Reconstruction Engine</span>
            </div>
            <h2 className="text-2xl font-black text-[#F1F5F9] mt-1">AI Investigation Reconstruction</h2>
            <p className="text-xs text-[#94A3B8] max-w-2xl mt-1 leading-relaxed">
              Progressively reconstructs criminal activity chronologically across multiple jurisdictions.
              As evidence-backed events are introduced, live narration appears and the knowledge graph expands automatically.
            </p>
          </div>

          {/* Master Control Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? handlePause : handleStart}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[6px] font-bold text-xs shadow-lg transition active:scale-95 ${
                isPlaying
                  ? 'bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] '
                  : 'bg-[#D4A359] hover:bg-[#E0B268] text-[#F1F5F9] '
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Narration' : currentStepIndex === 0 ? 'START INVESTIGATION' : 'Resume Investigation'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-[6px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] border border-[#222D3F] transition"
              title="Reset Timeline to Start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2.5 rounded-[6px] border transition ${
                audioEnabled
                  ? 'bg-[#D4A359]/15 text-[#D4A359] text-[#D4A359] border-[#D4A359]/30'
                  : 'bg-[#1A2332] text-[#64748B] border-[#222D3F]'
              }`}
              title="Toggle Audio Simulation"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* AI Rule Notice */}
        <div className="mt-4 pt-3 border-t border-[#222D3F] text-[11px] text-[#94A3B8] flex items-center justify-between">
          <span className="italic">
            <strong>AI Guardrail Rule:</strong> The LLM narrates retrieved facts from evidence; it must not invent motives, guilt, or unsupported legal conclusions.
          </span>
          <span className="font-mono text-[#D4A359] font-semibold">
            Step {currentStepIndex + 1} of {events.length}
          </span>
        </div>
      </div>

      {/* Progress Bar & Timeline Stepper */}
      <div className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-4 ">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {events.map((ev, idx) => {
            const isPassed = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={ev.event_number}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex-1 min-w-[140px] p-2.5 rounded-[4px] border text-left transition ${
                  isCurrent
                    ? 'bg-[#D4A359]/15 text-[#D4A359] border-[#D4A359] shadow-md shadow-cyan-500/10'
                    : isPassed
                    ? 'bg-[#1A2332] border-[#222D3F] text-[#94A3B8]'
                    : 'bg-[#131A26] border-[#222D3F] text-[#64748B]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={isCurrent ? 'text-[#D4A359] font-bold' : isPassed ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                    EVENT #{ev.event_number}
                  </span>
                  <span className="text-[#64748B]">{ev.timestamp.split(' ')[0]}</span>
                </div>
                <p className={`text-[11px] font-semibold truncate ${isCurrent ? 'text-[#F1F5F9]' : isPassed ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  {ev.narration.slice(0, 32)}...
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Stage: Live AI Narration Box & Reconstructed Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live AI Narration Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#131A26] border border-[#D4A359]/40 rounded-[6px] p-6 shadow-none relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#D4A359] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#D4A359] animate-pulse" /> LIVE AI NARRATOR STREAM
              </span>
              <span className="text-[10px] font-mono bg-[#D4A359]/15 text-[#D4A359] text-[#D4A359] px-2 py-0.5 rounded border border-[#D4A359]/30">
                EVIDENCE-BACKED
              </span>
            </div>

            {/* Narration Text Box */}
            <div className="bg-[#0B0F17] p-5 rounded-[6px] border border-[#222D3F] text-sm font-medium text-[#F1F5F9] leading-relaxed min-h-[160px] flex items-center">
              <p>"{currentEvent.narration}"</p>
            </div>

            {/* Supporting Evidence Citation Pill */}
            <div className="mt-4 p-3 bg-[#131A26] rounded-[4px] border border-[#222D3F] text-xs space-y-1">
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span className="font-semibold text-[#94A3B8]">Supporting Evidence Record:</span>
                <span className="font-mono text-[#D4A359] font-bold">{currentEvent.evidence_reference}</span>
              </div>
              <p className="text-[#94A3B8] text-[11px]">
                Case Reference: <strong className="text-[#F1F5F9]">{currentEvent.case_id}</strong>
              </p>
            </div>

            {/* Cross-Case Connection Alert (Event 5 Signature Bridge) */}
            {currentEvent.event_number === 5 && (
              <div className="mt-4 bg-[#E05252]/15 text-[#E05252] border border-[#E05252]/40 rounded-[6px] p-4 space-y-2 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 font-bold text-[#E05252] text-xs">
                  <ShieldAlert className="w-4 h-4 text-[#E05252]" />
                  <span>SIGNATURE CROSS-CASE CONNECTION DETECTED!</span>
                </div>
                <p className="text-xs text-[#F1F5F9] leading-relaxed">
                  Devrat Sharma (PER-103) executes <strong>TXN_552</strong> sending ₹50,00,000 from Case 018 (Gurugram Phishing) directly into Apex Trade Solutions (Case 041 Mumbai Hawala Ring).
                </p>
              </div>
            )}
          </div>

          {/* Graph Delta Node Additions */}
          <div className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-5 space-y-3">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">
              Incremental Graph Expansion (Graph Delta)
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {currentEvent.graph_delta.map((delta, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#0B0F17] p-2 rounded border border-[#222D3F] text-[#D4A359]">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4A359]" />
                  <span>{delta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reconstructed Knowledge Graph View */}
        <div className="lg:col-span-7 bg-[#0B0F17] border border-[#222D3F] rounded-[6px] p-6 flex flex-col justify-between shadow-none relative min-h-[480px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#94A3B8] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-400" /> RECONSTRUCTED LIVE KNOWLEDGE GRAPH
              </span>
              <span className="text-xs text-[#94A3B8]">
                Cumulative Nodes Active: <strong className="text-[#D4A359]">{currentStepIndex * 3 + 4}</strong>
              </span>
            </div>

            {/* Simulated Live Visual Graph Representation */}
            <div className="relative h-[360px] bg-[#0B0F17] rounded-[6px] border border-[#222D3F] p-6 flex items-center justify-center overflow-hidden">
              {/* Background grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Step-by-step Visual Network Diagram */}
              <div className="relative z-10 w-full max-w-md space-y-6">
                {/* Heist Origin */}
                <div className="flex items-center justify-between bg-blue-950/60 border border-blue-500/40 p-3 rounded-[4px]">
                  <span className="text-xs font-bold text-[#D4A359]">ACC-1001 (Zenith Tech)</span>
                  <span className="text-[11px] font-mono text-[#E05252] font-bold">₹1,00,00,000 RTGS</span>
                  <span className="text-xs font-bold text-[#34D399]">ACC-2201 (Suman Roy)</span>
                </div>

                {/* Layering Tranche */}
                {currentStepIndex >= 1 && (
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                    <div className="bg-[#131A26] p-2 rounded border border-[#34D399]/35 text-[#34D399]">
                      ACC-3301 (Meera Nair) ₹20L
                    </div>
                    <div className="bg-[#131A26] p-2 rounded border border-[#34D399]/35 text-[#34D399]">
                      ACC-3302 (Student Tranche) ₹20L
                    </div>
                  </div>
                )}

                {/* Broker Aggregation */}
                {currentStepIndex >= 2 && (
                  <div className="bg-[#E05252]/15 text-[#E05252] border border-[#E05252]/40 p-3.5 rounded-[4px] text-center shadow-lg animate-in zoom-in-95">
                    <span className="text-xs font-bold text-[#E05252] block">BROKER COLLECTION NODE</span>
                    <span className="text-xs font-mono font-extrabold text-[#F1F5F9]">ACC-7702 (Devrat Sharma PER-103)</span>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">Accumulated ₹70,00,000 from mule tranches</p>
                  </div>
                )}

                {/* Cross-Case Bridge */}
                {currentStepIndex >= 4 && (
                  <div className="bg-gradient-to-r from-red-600 via-purple-600 to-emerald-600 p-0.5 rounded-[6px] shadow-none">
                    <div className="bg-[#0B0F17] p-3.5 rounded-[10px] flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-[#D4A359] uppercase">CASE-018 (Gurugram)</span>
                        <p className="text-xs font-bold text-[#F1F5F9]">Devrat Sharma</p>
                      </div>
                      <div className="text-center font-mono font-bold text-[#E05252] text-xs px-2 py-1 rounded bg-[#131A26] border border-[#E05252]/35">
                        TXN_552: ₹50,00,000 &rarr;
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#34D399] uppercase">CASE-041 (Mumbai)</span>
                        <p className="text-xs font-bold text-[#F1F5F9]">Apex Trade Solutions</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-4 pt-3 border-t border-[#222D3F] flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">
              Investigation Reconstruction Status: <strong className="text-[#34D399]">Active Narration</strong>
            </span>
            <button
              onClick={() => onOpenCase(currentEvent.case_id.split(' ')[0])}
              className="text-xs font-semibold text-[#D4A359] hover:text-[#D4A359] flex items-center gap-1"
            >
              Open Full Case Workspace &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
