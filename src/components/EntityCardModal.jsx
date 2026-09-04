import React from 'react';
import { X, ShieldAlert, FileText, Phone, CreditCard, User, ExternalLink, Activity, AlertTriangle, Scale, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function EntityCardModal({ entity, onClose, onOpenCase, onAskCopilot }) {
  if (!entity) return null;

  // Determine connected evidence and contradictions
  const relatedContradictions = RAW_DATASET.groundTruth.intentional_contradictions.filter(
    (c) => c.entity_id === entity.person_id || c.entity_id === entity.account_id || c.entity_id === entity.phone_id
  );

  const relatedGaps = RAW_DATASET.groundTruth.investigation_gaps.filter(
    (g) => g.entity_id === entity.person_id || g.entity_id === entity.account_id || g.entity_id === entity.phone_id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131b2e] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
              entity.is_bridge ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-cyan-400 border border-blue-500/30'
            }`}>
              {entity.name ? entity.name[0] : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                  {entity.person_id || entity.account_id || entity.phone_id || entity.case_id || entity.evidence_id}
                </span>
                {entity.is_bridge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                    HIGH BETWEENNESS BROKER
                  </span>
                )}
                {entity.risk_score && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    RISK SCORE: {entity.risk_score}/100
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {entity.name || entity.title || entity.account_number || entity.msisdn || entity.file_name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Key Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role & Network Position</span>
              <p className="text-sm font-semibold text-slate-200">{entity.role || entity.category || entity.type || "Extracted Criminal Entity"}</p>
              <p className="text-slate-400 leading-relaxed">{entity.description || entity.jurisdiction || "Verified item in investigation graph."}</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Associated Case</span>
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold">{entity.primary_case_id || entity.case_id || "Cross-Case Linked"}</span>
                {entity.primary_case_id && (
                  <button
                    onClick={() => onOpenCase(entity.primary_case_id)}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Open Case <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-slate-400">Location: <strong>{entity.location || entity.bank_name || "NCR / Mumbai Subnet"}</strong></p>
              {entity.pan && <p className="text-slate-400 font-mono">PAN: {entity.pan}</p>}
            </div>
          </div>

          {/* Supporting Evidence Confidence Panel */}
          <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Evidence Support & Extraction Confidence
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Confidence: 96.4%
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Relationship extracted from verified source record <strong>EVD-001 (FIR 0018/2026)</strong> and <strong>EVD-002 (STR-88912)</strong>. Corroborated by 14 CDR call logs and 12 bank transaction logs.
            </p>
          </div>

          {/* Flagged Contradictions Alert if any */}
          {relatedContradictions.length > 0 && (
            <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>FLAGGED EVIDENCE CONTRADICTION DETECTED</span>
              </div>
              {relatedContradictions.map((c) => (
                <div key={c.contradiction_id} className="bg-slate-900/80 p-3 rounded-lg border border-red-500/20 space-y-1">
                  <span className="font-bold text-red-300">{c.title}</span>
                  <p className="text-slate-300">{c.description}</p>
                  <p className="text-amber-400 font-semibold mt-1">Suggested Action: {c.investigative_action}</p>
                </div>
              ))}
            </div>
          )}

          {/* Flagged Investigation Gap if any */}
          {relatedGaps.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>UNRESOLVED INVESTIGATION GAP</span>
              </div>
              {relatedGaps.map((g) => (
                <div key={g.gap_id} className="bg-slate-900/80 p-3 rounded-lg border border-amber-500/20 space-y-1">
                  <span className="font-bold text-amber-300">{g.title}</span>
                  <p className="text-slate-300">{g.description}</p>
                  <p className="text-cyan-400 font-semibold mt-1">Recommended Step: {g.recommended_step}</p>
                </div>
              ))}
            </div>
          )}

          {/* Relevant Legal Provisions */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-400" /> Potentially Relevant Legal Provisions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
                <span className="font-bold text-cyan-300">IT Act 2000 - Sec 66C & 66D</span>
                <p className="text-slate-400 text-[11px]">Identity theft & cheating by personation using computer resource.</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
                <span className="font-bold text-emerald-300">BNS 2023 - Sec 318(4) & 61(2)</span>
                <p className="text-slate-400 text-[11px]">Cheating, dishonest inducement of property & criminal conspiracy.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="bg-slate-900/90 border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAskCopilot(`Explain why ${entity.name || entity.person_id} is connected to Case 018 and Case 041.`);
              }}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              Ask AI Copilot <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {entity.primary_case_id && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCase(entity.primary_case_id);
                }}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                Open Case Workspace
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition"
          >
            Close Card
          </button>
        </div>
      </div>
    </div>
  );
}
