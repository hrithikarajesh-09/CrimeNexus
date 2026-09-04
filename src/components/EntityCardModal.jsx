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
      <div className="bg-[#0f1629]/95 border border-[#5680E9]/40 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ethereal-glass">
        {/* Modal Header */}
        <div className="bg-[#080c18]/90 border-b border-[#5680E9]/30 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg ${
              entity.is_bridge ? 'bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/50 shadow-[0_0_15px_rgba(136,96,208,0.3)]' : 'bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40'
            }`}>
              {entity.name ? entity.name[0] : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
                  {entity.person_id || entity.account_id || entity.phone_id || entity.case_id || entity.evidence_id || "NODE"}
                </span>
                {entity.is_bridge && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#8860D0]/25 text-[#C1C8E4] border border-[#8860D0]/60 animate-pulse font-mono">
                    HIGH BETWEENNESS BROKER
                  </span>
                )}
                {entity.risk_score && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#5AB9EA]/15 text-[#84CEEB] border border-[#5AB9EA]/35 font-mono">
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
            className="p-2 rounded-xl bg-[#141d33] hover:bg-[#1f2c4e] text-[#C1C8E4] hover:text-white transition border border-[#5680E9]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-[#080c18]/60 font-sans">
          {/* Key Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141d33]/80 p-4 rounded-2xl border border-[#5680E9]/25 space-y-2">
              <span className="text-[11px] font-bold text-[#84CEEB] uppercase tracking-widest font-mono">Role &amp; Network Position</span>
              <p className="text-sm font-semibold text-white font-display">{entity.role || entity.category || entity.type || "Extracted Criminal Entity"}</p>
              <p className="text-[#C1C8E4] leading-relaxed">{entity.description || entity.jurisdiction || "Verified node in master investigation knowledge graph."}</p>
            </div>

            <div className="bg-[#141d33]/80 p-4 rounded-2xl border border-[#5680E9]/25 space-y-2">
              <span className="text-[11px] font-bold text-[#84CEEB] uppercase tracking-widest font-mono">Primary Associated File</span>
              <div className="flex items-center justify-between">
                <span className="text-[#84CEEB] font-mono font-bold">{entity.primary_case_id || entity.case_id || "Cross-Case Linked"}</span>
                {entity.primary_case_id && (
                  <button
                    onClick={() => onOpenCase(entity.primary_case_id)}
                    className="text-xs text-[#5AB9EA] hover:underline flex items-center gap-1 font-semibold"
                  >
                    Open Case <ExternalLink className="w-3 h-3 text-[#5AB9EA]" />
                  </button>
                )}
              </div>
              <p className="text-[#8b9bb4]">Location: <strong className="text-white">{entity.location || entity.bank_name || "NCR / Mumbai Subnet"}</strong></p>
              {entity.pan && <p className="text-[#8b9bb4] font-mono">PAN: <span className="text-[#C1C8E4]">{entity.pan}</span></p>}
            </div>
          </div>

          {/* Supporting Evidence Confidence Panel */}
          <div className="bg-[#141d33]/80 border border-[#5680E9]/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#84CEEB] flex items-center gap-1.5 font-display">
                <CheckCircle2 className="w-4 h-4 text-[#84CEEB]" /> Evidence Support &amp; Extraction Confidence
              </span>
              <span className="text-xs font-mono font-bold text-[#8860D0] bg-[#8860D0]/20 px-2.5 py-0.5 rounded-full border border-[#8860D0]/40">
                Confidence: 96.4%
              </span>
            </div>
            <p className="text-[#C1C8E4] leading-relaxed">
              Relationship extracted from verified source record <strong className="text-white">EVD-001 (FIR 0018/2026)</strong> and <strong className="text-white">EVD-002 (STR-88912)</strong>. Corroborated by 14 CDR call logs and 12 core banking transaction records.
            </p>
          </div>

          {/* Associated Contradictions Flag */}
          {relatedContradictions.length > 0 && (
            <div className="bg-[#8860D0]/10 border border-[#8860D0]/40 rounded-2xl p-4 space-y-2">
              <span className="font-bold text-[#8860D0] flex items-center gap-1.5 uppercase font-mono text-xs">
                <AlertTriangle className="w-4 h-4 text-[#8860D0]" /> Flagged Investigation Contradiction
              </span>
              {relatedContradictions.map(c => (
                <div key={c.contradiction_id} className="text-xs text-[#C1C8E4] space-y-1">
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-[#8b9bb4]">{c.description}</p>
                  <p className="text-[#84CEEB] font-mono text-[11px]">Recommended: {c.investigative_action}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#141d33] hover:bg-[#1e2a4a] border border-[#5680E9]/40 text-[#C1C8E4] hover:text-white rounded-xl text-xs font-bold transition"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
