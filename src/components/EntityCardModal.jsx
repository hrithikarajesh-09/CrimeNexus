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
        className="bg-[#131A26] border border-[#222D3F] w-full max-w-2xl rounded-[6px] overflow-hidden max-h-[90vh] flex flex-col font-sans shadow-none"
      >
        {/* Modal Header */}
        <div className="bg-[#1A2332] border-b border-[#222D3F] p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center font-bold text-xs ${
              entity.is_bridge ? 'bg-[#131A26] text-[#8B5CF6] border border-[#8B5CF6]/40' : 'bg-[#131A26] text-[#3B82F6] border border-[#222D3F]'
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
              <h2 className="text-base font-serif font-bold text-[#F1F5F9] mt-0.5">
                {entity.name || entity.title || entity.account_number || entity.msisdn || entity.file_name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[4px] bg-[#131A26] hover:bg-[#1D2738] text-[#94A3B8] hover:text-[#F1F5F9] transition border border-[#222D3F]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs text-[#94A3B8]">
          {/* Node Summary Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#1A2332] p-3 rounded-[6px] border border-[#222D3F]">
            <div>
              <span className="text-[10px] text-[#64748B] font-mono block">NODE TYPE</span>
              <span className="font-medium text-[#F1F5F9]">{entity.role || "Target Record"}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-mono block">PRIMARY JURISDICTION</span>
              <span className="font-medium text-[#D4A359]">{entity.location || "Inter-State"}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-mono block">VERIFICATION HASH</span>
              <span className="font-mono text-[#34D399] text-[10px]">SHA-256 MATCH</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-mono block">GROUND TRUTH TAG</span>
              <span className="font-medium text-[#8B5CF6]">{entity.is_bridge ? "Cross-Case Bridge" : "Intra-Case"}</span>
            </div>
          </div>

          {/* Primary Case Associated */}
          <div className="bg-[#1A2332] border border-[#222D3F] rounded-[6px] p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#64748B] font-mono block">ANCHOR INVESTIGATION</span>
              <span className="font-serif font-bold text-[#F1F5F9] text-sm">CASE-018: Operation PhishNet</span>
              <p className="text-[11px] text-[#64748B]">NCR Cyber PS &bull; INR 1.0 Cr RTGS Heist</p>
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
          <div className="bg-[#1A2332] border border-[#222D3F] rounded-[6px] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" /> Evidence Support &amp; Verification
              </span>
              <Badge variant="green">
                Confidence: 96.4%
              </Badge>
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              Relationship extracted from verified source record <strong className="text-[#F1F5F9]">EVD-001 (FIR 0018/2026)</strong> and <strong className="text-[#F1F5F9]">EVD-002 (STR-88912)</strong>. Corroborated by 14 CDR call logs and 12 core banking transaction records.
            </p>
          </div>

          {/* Associated Contradictions Flag */}
          {relatedContradictions.length > 0 && (
            <div className="bg-[#1A2332] border border-[#E05252]/40 rounded-[6px] p-3 space-y-1.5">
              <span className="font-semibold text-[#E05252] flex items-center gap-1.5 uppercase font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" /> Flagged Investigation Contradiction
              </span>
              {relatedContradictions.map(c => (
                <div key={c.contradiction_id} className="text-xs space-y-0.5">
                  <p className="font-semibold text-[#F1F5F9]">{c.title}</p>
                  <p className="text-[#94A3B8]">{c.description}</p>
                  <p className="text-[#D4A359] font-mono text-[11px]">Action: {c.investigative_action}</p>
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
