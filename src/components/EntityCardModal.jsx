import React from 'react';
import { X, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function EntityCardModal({ entity, onClose, onOpenCase, onAskCopilot }) {
  if (!entity) return null;

  // Determine connected evidence and contradictions
  const relatedContradictions = RAW_DATASET.groundTruth.intentional_contradictions.filter(
    (c) => c.entity_id === entity.person_id || c.entity_id === entity.account_id || c.entity_id === entity.phone_id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-dark-surface border border-dark-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-sans">
        {/* Modal Header */}
        <div className="bg-dark-panel border-b border-dark-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              entity.is_bridge ? 'bg-brand-amber/15 text-brand-amber border border-brand-amber/30' : 'bg-brand-primary/15 text-brand-accent border border-brand-primary/30'
            }`}>
              {entity.name ? entity.name[0] : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium px-2 py-0.2 rounded bg-dark-bg text-brand-accent border border-dark-border">
                  {entity.person_id || entity.account_id || entity.phone_id || entity.case_id || entity.evidence_id || "NODE"}
                </span>
                {entity.is_bridge && (
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-brand-amber/15 text-brand-amber border border-brand-amber/30 font-mono">
                    HIGH BETWEENNESS BROKER
                  </span>
                )}
                {entity.risk_score && (
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-brand-rose/15 text-brand-rose border border-brand-rose/30 font-mono">
                    RISK: {entity.risk_score}%
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                {entity.name || entity.title || entity.account_number || entity.msisdn || entity.file_name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-bg hover:bg-dark-subtle text-brand-slate hover:text-white transition border border-dark-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Key Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-dark-bg p-3.5 rounded-lg border border-dark-border space-y-1.5">
              <span className="text-[10px] font-medium text-dark-slate uppercase tracking-wider font-mono">Role &amp; Network Position</span>
              <p className="text-xs font-semibold text-white">{entity.role || entity.category || entity.type || "Extracted Criminal Entity"}</p>
              <p className="text-brand-slate leading-relaxed">{entity.description || entity.jurisdiction || "Verified node in master investigation knowledge graph."}</p>
            </div>

            <div className="bg-dark-bg p-3.5 rounded-lg border border-dark-border space-y-1.5">
              <span className="text-[10px] font-medium text-dark-slate uppercase tracking-wider font-mono">Associated Investigation</span>
              <div className="flex items-center justify-between">
                <span className="text-brand-accent font-mono font-semibold">{entity.primary_case_id || entity.case_id || "Cross-Case Linked"}</span>
                {entity.primary_case_id && (
                  <button
                    onClick={() => onOpenCase(entity.primary_case_id)}
                    className="text-xs text-brand-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    Open Case <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-dark-slate">Location: <strong className="text-slate-200">{entity.location || entity.bank_name || "NCR / Mumbai Subnet"}</strong></p>
              {entity.pan && <p className="text-dark-slate font-mono">PAN: <span className="text-slate-300">{entity.pan}</span></p>}
            </div>
          </div>

          {/* Supporting Evidence Confidence Panel */}
          <div className="bg-dark-bg border border-dark-border rounded-lg p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Evidence Support &amp; Extraction Confidence
              </span>
              <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                Confidence: 96.4%
              </span>
            </div>
            <p className="text-brand-slate leading-relaxed">
              Relationship extracted from verified source record <strong className="text-slate-200">EVD-001 (FIR 0018/2026)</strong> and <strong className="text-slate-200">EVD-002 (STR-88912)</strong>. Corroborated by 14 CDR call logs and 12 core banking transaction records.
            </p>
          </div>

          {/* Associated Contradictions Flag */}
          {relatedContradictions.length > 0 && (
            <div className="bg-brand-rose/10 border border-brand-rose/30 rounded-lg p-3.5 space-y-2">
              <span className="font-semibold text-brand-rose flex items-center gap-1.5 uppercase font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" /> Flagged Investigation Contradiction
              </span>
              {relatedContradictions.map(c => (
                <div key={c.contradiction_id} className="text-xs space-y-1">
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-brand-slate">{c.description}</p>
                  <p className="text-brand-amber font-mono text-[11px]">Action: {c.investigative_action}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-dark-bg hover:bg-dark-subtle border border-dark-border text-slate-300 rounded-lg text-xs font-medium transition"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
