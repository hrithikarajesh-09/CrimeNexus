import React from 'react';
import { AlertTriangle, ShieldAlert, FileText, CheckCircle2, ArrowRight, MapPin, Phone, HelpCircle } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function GapsAndContradictions({ onSelectEntity, onAskCopilot }) {
  const contradictions = RAW_DATASET.groundTruth.intentional_contradictions;
  const gaps = RAW_DATASET.groundTruth.investigation_gaps;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-5 ">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E05252]/15 text-[#E05252] text-[#E05252] border border-[#E05252]/30">
            SECTION 7 &bull; EVIDENCE AUDIT & CONFLICTS
          </span>
          <h2 className="text-xl font-bold text-[#F1F5F9]">Investigation Gaps & Evidence Contradictions</h2>
        </div>
        <p className="text-xs text-[#94A3B8] mt-1">
          Automatically detects incompatible statements, cell tower location mismatches, and unresolved missing links across records.
          <strong className="text-[#D4A359] ml-1 font-normal">Enforced Rule: CrimeNexus flags discrepancies for review; it does not unilaterally decide which source is true.</strong>
        </p>
      </div>

      {/* Grid: Contradictions & Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Flagged Evidence Contradictions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F1F5F9] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#E05252]" />
              <span>Flagged Evidence Contradictions ({contradictions.length})</span>
            </h3>
            <span className="text-xs font-mono bg-[#E05252]/15 text-[#E05252] text-[#E05252] px-2 py-0.5 rounded border border-[#E05252]/25">
              HIGH PRIORITY REVIEW
            </span>
          </div>

          {contradictions.map((item) => (
            <div
              key={item.contradiction_id}
              className="bg-[#131A26] border border-[#E05252]/35 rounded-[6px] p-6 shadow-none space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#E05252] bg-[#E05252]/15 text-[#E05252] px-2.5 py-1 rounded border border-[#E05252]/30">
                    {item.contradiction_id}
                  </span>
                  <h4 className="text-base font-bold text-[#F1F5F9] mt-2">{item.title}</h4>
                </div>
                <span className="text-xs font-mono text-[#94A3B8]">Entity: <strong className="text-[#D4A359]">{item.entity_id}</strong></span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#0B0F17] p-3.5 rounded-[4px] border border-[#222D3F]">
                {item.description}
              </p>

              {/* Conflicting Sources Comparison */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                  Conflicting Evidentiary Statements:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.conflicting_sources.map((src, idx) => (
                    <div key={idx} className="bg-[#131A26] p-3 rounded-[4px] border border-[#222D3F] space-y-1">
                      <span className="font-semibold text-[#D4A359] block">{src.source}</span>
                      <p className="text-[#94A3B8] text-[11px]">Claim: "{src.claim}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Action */}
              <div className="pt-3 border-t border-[#222D3F] flex items-center justify-between">
                <p className="text-xs text-[#D4A359] font-medium">
                  <strong>Suggested Action:</strong> {item.investigative_action}
                </p>
                <button
                  onClick={() => onAskCopilot(`Explain contradiction ${item.contradiction_id} for ${item.entity_id}`)}
                  className="px-3 py-1.5 rounded-[4px] bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] font-semibold text-xs font-semibold whitespace-nowrap transition"
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
            <h3 className="text-base font-bold text-[#F1F5F9] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D4A359]" />
              <span>Unresolved Investigation Gaps ({gaps.length})</span>
            </h3>
            <span className="text-xs font-mono bg-[#D4A359]/15 text-[#D4A359] text-[#D4A359] px-2 py-0.5 rounded border border-[#D4A359]/25">
              MISSING LINKS
            </span>
          </div>

          {gaps.map((gap) => (
            <div
              key={gap.gap_id}
              className="bg-[#131A26] border border-amber-500/40 rounded-[6px] p-6 shadow-none space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#D4A359] bg-[#D4A359]/15 text-[#D4A359] px-2.5 py-1 rounded border border-[#D4A359]/35">
                    {gap.gap_id}
                  </span>
                  <h4 className="text-base font-bold text-[#F1F5F9] mt-2">{gap.title}</h4>
                </div>
                <span className="text-xs font-mono text-[#94A3B8]">Entity: <strong className="text-[#D4A359]">{gap.entity_id}</strong></span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#0B0F17] p-3.5 rounded-[4px] border border-[#222D3F]">
                {gap.description}
              </p>

              <div className="bg-amber-950/30 border border-[#D4A359]/25 p-3 rounded-[4px] text-xs space-y-1">
                <span className="font-bold text-[#D4A359]">Recommended Investigative Step:</span>
                <p className="text-[#F1F5F9]">{gap.recommended_step}</p>
              </div>

              <div className="pt-3 border-t border-[#222D3F] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#94A3B8]">Status: <strong className="text-[#D4A359]">{gap.status}</strong></span>
                <button
                  onClick={() => onAskCopilot(`How can we resolve gap ${gap.gap_id} regarding ${gap.entity_id}?`)}
                  className="px-3 py-1.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#F1F5F9] text-xs font-semibold transition border border-[#222D3F]"
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
