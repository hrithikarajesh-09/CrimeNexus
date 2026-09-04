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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1a2320] border border-[#116466]/60 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col futuristic-glow">
        {/* Modal Header */}
        <div className="bg-[#141a18] border-b border-[#116466]/40 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
              entity.is_bridge ? 'bg-[#2C3531] text-[#FFCB9A] border border-[#FFCB9A]/50' : 'bg-[#116466]/20 text-[#D1E8E2] border border-[#116466]/40'
            }`}>
              {entity.name ? entity.name[0] : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#116466]/20 text-[#D1E8E2] border border-[#116466]/40">
                  {entity.person_id || entity.account_id || entity.phone_id || entity.case_id || entity.evidence_id || "NODE"}
                </span>
                {entity.is_bridge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2C3531] text-[#FFCB9A] border border-[#FFCB9A]/50 animate-pulse font-mono">
                    HIGH BETWEENNESS BROKER
                  </span>
                )}
                {entity.risk_score && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D9B08C]/15 text-[#FFCB9A] border border-[#D9B08C]/35 font-mono">
                    RISK SCORE: {entity.risk_score}/100
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white mt-1 font-display">
                {entity.name || entity.title || entity.account_number || entity.msisdn || entity.file_name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#121816] hover:bg-[#1c2420] text-[#7e968e] hover:text-[#D1E8E2] transition border border-[#116466]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-[#121816] font-sans">
          {/* Key Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#151c19] p-4 rounded-xl border border-[#116466]/30 space-y-2">
              <span className="text-[11px] font-bold text-[#D9B08C] uppercase tracking-widest font-mono">Role &amp; Network Position</span>
              <p className="text-sm font-semibold text-white font-display">{entity.role || entity.category || entity.type || "Extracted Criminal Entity"}</p>
              <p className="text-[#a3b8b0] leading-relaxed">{entity.description || entity.jurisdiction || "Verified node in master investigation knowledge graph."}</p>
            </div>

            <div className="bg-[#151c19] p-4 rounded-xl border border-[#116466]/30 space-y-2">
              <span className="text-[11px] font-bold text-[#D9B08C] uppercase tracking-widest font-mono">Primary Associated File</span>
              <div className="flex items-center justify-between">
                <span className="text-[#D1E8E2] font-mono font-bold">{entity.primary_case_id || entity.case_id || "Cross-Case Linked"}</span>
                {entity.primary_case_id && (
                  <button
                    onClick={() => onOpenCase(entity.primary_case_id)}
                    className="text-xs text-[#FFCB9A] hover:underline flex items-center gap-1 font-semibold"
                  >
                    Open Case <ExternalLink className="w-3 h-3 text-[#FFCB9A]" />
                  </button>
                )}
              </div>
              <p className="text-[#7e968e]">Location: <strong className="text-white">{entity.location || entity.bank_name || "NCR / Mumbai Subnet"}</strong></p>
              {entity.pan && <p className="text-[#7e968e] font-mono">PAN: <span className="text-[#D1E8E2]">{entity.pan}</span></p>}
            </div>
          </div>

          {/* Supporting Evidence Confidence Panel */}
          <div className="bg-[#151c19] border border-[#116466]/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#D1E8E2] flex items-center gap-1.5 font-display">
                <CheckCircle2 className="w-4 h-4 text-[#D1E8E2]" /> Evidence Support &amp; Extraction Confidence
              </span>
              <span className="text-xs font-mono font-bold text-[#FFCB9A] bg-[#2C3531] px-2 py-0.5 rounded border border-[#FFCB9A]/40">
                Confidence: 96.4%
              </span>
            </div>
            <p className="text-[#a3b8b0] leading-relaxed">
              Relationship extracted from verified source record <strong className="text-white">EVD-001 (FIR 0018/2026)</strong> and <strong className="text-white">EVD-002 (STR-88912)</strong>. Corroborated by 14 CDR call logs and 12 core banking transaction records.
            </p>
          </div>

          {/* Associated Contradictions Flag */}
          {relatedContradictions.length > 0 && (
            <div className="bg-[#2C3531]/40 border border-[#FFCB9A]/50 rounded-xl p-4 space-y-2">
              <span className="font-bold text-[#FFCB9A] flex items-center gap-1.5 uppercase font-mono text-xs">
                <AlertTriangle className="w-4 h-4 text-[#FFCB9A]" /> Flagged Investigation Contradiction
              </span>
              {relatedContradictions.map(c => (
                <div key={c.contradiction_id} className="text-xs text-[#D1E8E2] space-y-1">
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-[#a3b8b0]">{c.description}</p>
                  <p className="text-[#FFCB9A] font-mono text-[11px]">Recommended: {c.investigative_action}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1c2420] hover:bg-[#242e2a] border border-[#116466]/40 text-[#D1E8E2] rounded-xl text-xs font-bold transition"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
