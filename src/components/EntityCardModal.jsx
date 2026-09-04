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
      <div className="bg-[#181C24] border border-[#2B313D] w-full max-w-2xl rounded-[5px] overflow-hidden max-h-[90vh] flex flex-col font-sans shadow-none">
        {/* Modal Header */}
        <div className="bg-[#1F2430] border-b border-[#2B313D] p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center font-bold text-xs ${
              entity.is_bridge ? 'bg-[#181C24] text-[#8B81C4] border border-[#8B81C4]/40' : 'bg-[#181C24] text-[#6C93B8] border border-[#2B313D]'
            }`}>
              {entity.name ? entity.name[0] : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[3px] bg-[#181C24] text-[#6C93B8] border border-[#2B313D]">
                  {entity.person_id || entity.account_id || entity.phone_id || entity.case_id || entity.evidence_id || "NODE"}
                </span>
                {entity.is_bridge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-[3px] bg-[#181C24] text-[#8B81C4] border border-[#8B81C4]/40 font-mono">
                    BRIDGE BROKER
                  </span>
                )}
                {entity.risk_score && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-[3px] bg-[#181C24] text-[#C1655A] border border-[#C1655A]/40 font-mono">
                    RISK: {entity.risk_score}%
                  </span>
                )}
              </div>
              <h2 className="text-base font-serif font-bold text-[#E8EAEE] mt-0.5">
                {entity.name || entity.title || entity.account_number || entity.msisdn || entity.file_name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[4px] bg-[#181C24] hover:bg-[#282F3F] text-[#9AA3B2] hover:text-[#E8EAEE] transition border border-[#2B313D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          {/* Key Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="bg-[#1F2430] p-3 rounded-[5px] border border-[#2B313D] space-y-1">
              <span className="text-[10px] font-mono text-[#6B7382] uppercase">ROLE &amp; POSITION</span>
              <p className="text-xs font-semibold text-[#E8EAEE]">{entity.role || entity.category || entity.type || "Extracted Criminal Entity"}</p>
              <p className="text-[#9AA3B2] leading-relaxed">{entity.description || entity.jurisdiction || "Verified node in master investigation knowledge graph."}</p>
            </div>

            <div className="bg-[#1F2430] p-3 rounded-[5px] border border-[#2B313D] space-y-1">
              <span className="text-[10px] font-mono text-[#6B7382] uppercase">ASSOCIATED FILE</span>
              <div className="flex items-center justify-between">
                <span className="text-[#6C93B8] font-mono font-semibold">{entity.primary_case_id || entity.case_id || "Cross-Case Linked"}</span>
                {entity.primary_case_id && (
                  <button
                    onClick={() => onOpenCase(entity.primary_case_id)}
                    className="text-xs text-[#C68A46] hover:underline flex items-center gap-1 font-medium"
                  >
                    Open Case <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-[#6B7382]">Location: <strong className="text-[#E8EAEE]">{entity.location || entity.bank_name || "NCR / Mumbai Subnet"}</strong></p>
              {entity.pan && <p className="text-[#6B7382] font-mono">PAN: <span className="text-[#E8EAEE]">{entity.pan}</span></p>}
            </div>
          </div>

          {/* Supporting Evidence Confidence Panel */}
          <div className="bg-[#1F2430] border border-[#2B313D] rounded-[5px] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#E8EAEE] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5FA876]" /> Evidence Support &amp; Verification
              </span>
              <span className="text-[10px] font-mono font-medium text-[#5FA876] bg-[#181C24] px-1.5 py-0.2 rounded-[3px] border border-[#2B313D]">
                Confidence: 96.4%
              </span>
            </div>
            <p className="text-[#9AA3B2] leading-relaxed">
              Relationship extracted from verified source record <strong className="text-[#E8EAEE]">EVD-001 (FIR 0018/2026)</strong> and <strong className="text-[#E8EAEE]">EVD-002 (STR-88912)</strong>. Corroborated by 14 CDR call logs and 12 core banking transaction records.
            </p>
          </div>

          {/* Associated Contradictions Flag */}
          {relatedContradictions.length > 0 && (
            <div className="bg-[#1F2430] border border-[#C1655A]/40 rounded-[5px] p-3 space-y-1.5">
              <span className="font-semibold text-[#C1655A] flex items-center gap-1.5 uppercase font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" /> Flagged Investigation Contradiction
              </span>
              {relatedContradictions.map(c => (
                <div key={c.contradiction_id} className="text-xs space-y-0.5">
                  <p className="font-semibold text-[#E8EAEE]">{c.title}</p>
                  <p className="text-[#9AA3B2]">{c.description}</p>
                  <p className="text-[#C68A46] font-mono text-[11px]">Action: {c.investigative_action}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#1F2430] hover:bg-[#282F3F] border border-[#2B313D] text-[#E8EAEE] rounded-[4px] text-xs font-medium transition"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
