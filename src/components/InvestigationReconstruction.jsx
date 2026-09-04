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
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                SECTION 6 &bull; SIGNATURE AI FEATURE
              </span>
              <span className="text-xs text-slate-400 font-medium">Fact-Strict Reconstruction Engine</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">AI Investigation Reconstruction</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Progressively reconstructs criminal activity chronologically across multiple jurisdictions.
              As evidence-backed events are introduced, live narration appears and the knowledge graph expands automatically.
            </p>
          </div>

          {/* Master Control Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? handlePause : handleStart}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Narration' : currentStepIndex === 0 ? 'START INVESTIGATION' : 'Resume Investigation'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Reset Timeline to Start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2.5 rounded-xl border transition ${
                audioEnabled
                  ? 'bg-blue-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
              title="Toggle Audio Simulation"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* AI Rule Notice */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="italic">
            <strong>AI Guardrail Rule:</strong> The LLM narrates retrieved facts from evidence; it must not invent motives, guilt, or unsupported legal conclusions.
          </span>
          <span className="font-mono text-cyan-400 font-semibold">
            Step {currentStepIndex + 1} of {events.length}
          </span>
        </div>
      </div>

      {/* Progress Bar & Timeline Stepper */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {events.map((ev, idx) => {
            const isPassed = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={ev.event_number}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex-1 min-w-[140px] p-2.5 rounded-lg border text-left transition ${
                  isCurrent
                    ? 'bg-blue-600/30 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : isPassed
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={isCurrent ? 'text-cyan-300 font-bold' : isPassed ? 'text-slate-400' : 'text-slate-600'}>
                    EVENT #{ev.event_number}
                  </span>
                  <span className="text-slate-500">{ev.timestamp.split(' ')[0]}</span>
                </div>
                <p className={`text-[11px] font-semibold truncate ${isCurrent ? 'text-white' : isPassed ? 'text-slate-300' : 'text-slate-500'}`}>
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
          <div className="bg-[#131b2e] border border-cyan-500/40 rounded-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" /> LIVE AI NARRATOR STREAM
              </span>
              <span className="text-[10px] font-mono bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded border border-blue-500/30">
                EVIDENCE-BACKED
              </span>
            </div>

            {/* Narration Text Box */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 text-sm font-medium text-slate-100 leading-relaxed min-h-[160px] flex items-center">
              <p>"{currentEvent.narration}"</p>
            </div>

            {/* Supporting Evidence Citation Pill */}
            <div className="mt-4 p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">Supporting Evidence Record:</span>
                <span className="font-mono text-cyan-400 font-bold">{currentEvent.evidence_reference}</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Case Reference: <strong className="text-slate-200">{currentEvent.case_id}</strong>
              </p>
            </div>

            {/* Cross-Case Connection Alert (Event 5 Signature Bridge) */}
            {currentEvent.event_number === 5 && (
              <div className="mt-4 bg-red-950/60 border border-red-500/50 rounded-xl p-4 space-y-2 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 font-bold text-red-400 text-xs">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>SIGNATURE CROSS-CASE CONNECTION DETECTED!</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Devrat Sharma (PER-103) executes <strong>TXN_552</strong> sending ₹50,00,000 from Case 018 (Gurugram Phishing) directly into Apex Trade Solutions (Case 041 Mumbai Hawala Ring).
                </p>
              </div>
            )}
          </div>

          {/* Graph Delta Node Additions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Incremental Graph Expansion (Graph Delta)
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {currentEvent.graph_delta.map((delta, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800 text-cyan-300">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{delta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reconstructed Knowledge Graph View */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-2xl relative min-h-[480px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-400" /> RECONSTRUCTED LIVE KNOWLEDGE GRAPH
              </span>
              <span className="text-xs text-slate-400">
                Cumulative Nodes Active: <strong className="text-cyan-300">{currentStepIndex * 3 + 4}</strong>
              </span>
            </div>

            {/* Simulated Live Visual Graph Representation */}
            <div className="relative h-[360px] bg-slate-950/90 rounded-xl border border-slate-800/80 p-6 flex items-center justify-center overflow-hidden">
              {/* Background grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Step-by-step Visual Network Diagram */}
              <div className="relative z-10 w-full max-w-md space-y-6">
                {/* Heist Origin */}
                <div className="flex items-center justify-between bg-blue-950/60 border border-blue-500/40 p-3 rounded-lg">
                  <span className="text-xs font-bold text-cyan-300">ACC-1001 (Zenith Tech)</span>
                  <span className="text-[11px] font-mono text-red-400 font-bold">₹1,00,00,000 RTGS</span>
                  <span className="text-xs font-bold text-emerald-400">ACC-2201 (Suman Roy)</span>
                </div>

                {/* Layering Tranche */}
                {currentStepIndex >= 1 && (
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                    <div className="bg-slate-900 p-2 rounded border border-emerald-500/30 text-emerald-300">
                      ACC-3301 (Meera Nair) ₹20L
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-emerald-500/30 text-emerald-300">
                      ACC-3302 (Student Tranche) ₹20L
                    </div>
                  </div>
                )}

                {/* Broker Aggregation */}
                {currentStepIndex >= 2 && (
                  <div className="bg-red-950/70 border border-red-500/50 p-3.5 rounded-lg text-center shadow-lg animate-in zoom-in-95">
                    <span className="text-xs font-bold text-red-300 block">BROKER COLLECTION NODE</span>
                    <span className="text-xs font-mono font-extrabold text-white">ACC-7702 (Devrat Sharma PER-103)</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Accumulated ₹70,00,000 from mule tranches</p>
                  </div>
                )}

                {/* Cross-Case Bridge */}
                {currentStepIndex >= 4 && (
                  <div className="bg-gradient-to-r from-red-600 via-purple-600 to-emerald-600 p-0.5 rounded-xl shadow-xl">
                    <div className="bg-slate-950 p-3.5 rounded-[10px] flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase">CASE-018 (Gurugram)</span>
                        <p className="text-xs font-bold text-white">Devrat Sharma</p>
                      </div>
                      <div className="text-center font-mono font-bold text-red-400 text-xs px-2 py-1 rounded bg-slate-900 border border-red-500/40">
                        TXN_552: ₹50,00,000 &rarr;
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">CASE-041 (Mumbai)</span>
                        <p className="text-xs font-bold text-white">Apex Trade Solutions</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Investigation Reconstruction Status: <strong className="text-emerald-400">Active Narration</strong>
            </span>
            <button
              onClick={() => onOpenCase(currentEvent.case_id.split(' ')[0])}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Open Full Case Workspace &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
