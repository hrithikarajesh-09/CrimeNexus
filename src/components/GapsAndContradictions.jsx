import React from 'react';
import { AlertTriangle, ShieldAlert, FileText, CheckCircle2, ArrowRight, MapPin, Phone, HelpCircle } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function GapsAndContradictions({ onSelectEntity, onAskCopilot }) {
  const contradictions = RAW_DATASET.groundTruth.intentional_contradictions;
  const gaps = RAW_DATASET.groundTruth.investigation_gaps;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
            SECTION 7 &bull; EVIDENCE AUDIT & CONFLICTS
          </span>
          <h2 className="text-xl font-bold text-white">Investigation Gaps & Evidence Contradictions</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Automatically detects incompatible statements, cell tower location mismatches, and unresolved missing links across records.
          <strong className="text-amber-300 ml-1 font-normal">Enforced Rule: CrimeNexus flags discrepancies for review; it does not unilaterally decide which source is true.</strong>
        </p>
      </div>

      {/* Grid: Contradictions & Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Flagged Evidence Contradictions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>Flagged Evidence Contradictions ({contradictions.length})</span>
            </h3>
            <span className="text-xs font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
              HIGH PRIORITY REVIEW
            </span>
          </div>

          {contradictions.map((item) => (
            <div
              key={item.contradiction_id}
              className="bg-[#131b2e] border border-red-500/40 rounded-xl p-6 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-500/20 px-2.5 py-1 rounded border border-red-500/30">
                    {item.contradiction_id}
                  </span>
                  <h4 className="text-base font-bold text-white mt-2">{item.title}</h4>
                </div>
                <span className="text-xs font-mono text-slate-400">Entity: <strong className="text-cyan-300">{item.entity_id}</strong></span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                {item.description}
              </p>

              {/* Conflicting Sources Comparison */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Conflicting Evidentiary Statements:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.conflicting_sources.map((src, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="font-semibold text-amber-300 block">{src.source}</span>
                      <p className="text-slate-300 text-[11px]">Claim: "{src.claim}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <p className="text-xs text-cyan-300 font-medium">
                  <strong>Suggested Action:</strong> {item.investigative_action}
                </p>
                <button
                  onClick={() => onAskCopilot(`Explain contradiction ${item.contradiction_id} for ${item.entity_id}`)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap transition"
                >
                  Analyze with Copilot
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Unresolved Investigation Gaps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Unresolved Investigation Gaps ({gaps.length})</span>
            </h3>
            <span className="text-xs font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
              MISSING LINKS
            </span>
          </div>

          {gaps.map((gap) => (
            <div
              key={gap.gap_id}
              className="bg-[#131b2e] border border-amber-500/40 rounded-xl p-6 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/30">
                    {gap.gap_id}
                  </span>
                  <h4 className="text-base font-bold text-white mt-2">{gap.title}</h4>
                </div>
                <span className="text-xs font-mono text-slate-400">Entity: <strong className="text-amber-300">{gap.entity_id}</strong></span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                {gap.description}
              </p>

              <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-300">Recommended Investigative Step:</span>
                <p className="text-slate-200">{gap.recommended_step}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Status: <strong className="text-amber-400">{gap.status}</strong></span>
                <button
                  onClick={() => onAskCopilot(`How can we resolve gap ${gap.gap_id} regarding ${gap.entity_id}?`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                >
                  Query Copilot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
