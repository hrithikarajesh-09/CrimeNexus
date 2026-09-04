import React from 'react';
import { X, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RAW_DATASET } from '../data/dataset';

export default function EntityCardModal({ entity, onClose, onOpenCase, onAskCopilot }) {
  if (!entity) return null;

  // Determine connected evidence and contradictions
  const relatedContradictions = RAW_DATASET.groundTruth.intentional_contradictions.filter(
    (c) => c.entity_id === entity.person_id || c.entity_id === entity.account_id || c.entity_id === entity.phone_id
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="bg-[#181C24] border border-[#2B313D] w-full max-w-2xl rounded-[5px] overflow-hidden max-h-[90vh] flex flex-col font-sans shadow-none"
      >
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
                <Badge variant="steel">
                  {entity.person_id || entity.account_id || entity.phone_id || entity.case_id || entity.evidence_id || "NODE"}
                </Badge>
                {entity.is_bridge && (
                  <Badge variant="violet">
                    BRIDGE BROKER
                  </Badge>
                )}
                {entity.risk_score && (
                  <Badge variant="red">
                    RISK: {entity.risk_score}%
                  </Badge>
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

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs text-[#9AA3B2]">
          {/* Node Summary Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#1F2430] p-3 rounded-[5px] border border-[#2B313D]">
            <div>
              <span className="text-[10px] text-[#6B7382] font-mono block">NODE TYPE</span>
              <span className="font-medium text-[#E8EAEE]">{entity.role || "Target Record"}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7382] font-mono block">PRIMARY JURISDICTION</span>
              <span className="font-medium text-[#C68A46]">{entity.location || "Inter-State"}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7382] font-mono block">VERIFICATION HASH</span>
              <span className="font-mono text-[#5FA876] text-[10px]">SHA-256 MATCH</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7382] font-mono block">GROUND TRUTH TAG</span>
              <span className="font-medium text-[#8B81C4]">{entity.is_bridge ? "Cross-Case Bridge" : "Intra-Case"}</span>
            </div>
          </div>

          {/* Primary Case Associated */}
          <div className="bg-[#1F2430] border border-[#2B313D] rounded-[5px] p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#6B7382] font-mono block">ANCHOR INVESTIGATION</span>
              <span className="font-serif font-bold text-[#E8EAEE] text-sm">CASE-018: Operation PhishNet</span>
              <p className="text-[11px] text-[#6B7382]">NCR Cyber PS &bull; INR 1.0 Cr RTGS Heist</p>
            </div>
            <Button
              onClick={() => onOpenCase('CASE-018')}
              variant="brass"
              size="sm"
            >
              <span>Open Case</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Supporting Evidence Confidence Panel */}
          <div className="bg-[#1F2430] border border-[#2B313D] rounded-[5px] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#E8EAEE] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5FA876]" /> Evidence Support &amp; Verification
              </span>
              <Badge variant="green">
                Confidence: 96.4%
              </Badge>
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
            <Button
              onClick={onClose}
              variant="secondary"
              size="default"
            >
              Close Dossier
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
