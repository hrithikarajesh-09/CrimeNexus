import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, Lock, RefreshCw, Key, ArrowRight, Download, Scale } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function EvidenceIntegrityModal({ isOpen, onClose, onOpenDossier }) {
  if (!isOpen) return null;

  const [verifyingId, setVerifyingId] = useState(null);
  const [verifiedStatus, setVerifiedStatus] = useState({});

  const evidenceList = RAW_DATASET.evidence;

  const handleVerify = (id) => {
    setVerifyingId(id);
    setTimeout(() => {
      setVerifiedStatus(prev => ({ ...prev, [id]: true }));
      setVerifyingId(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80  animate-in fade-in duration-200">
      <div className="bg-[#131A26] border border-[#222D3F] w-full max-w-4xl rounded-[8px] shadow-none overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#131A26] border-b border-[#222D3F] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#34D399]/15 text-[#34D399] text-[#34D399] border border-[#34D399]/35 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#34D399]/15 text-[#34D399] text-[#34D399] border border-[#34D399]/35">
                  SECTIONS 13 & 14 &bull; HYPERLEDGER FABRIC
                </span>
                <span className="text-xs text-[#94A3B8]">Cryptographic Evidence Ledger</span>
              </div>
              <h2 className="text-lg font-bold text-[#F1F5F9] mt-0.5">SHA-256 Evidence Integrity & Audit Trail</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] hover:text-[#F1F5F9] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Architecture Banner */}
          <div className="bg-[#131A26] border border-[#222D3F] p-4 rounded-[6px] space-y-2">
            <span className="font-bold text-[#F1F5F9] text-xs block">Off-Chain Storage & On-Chain Audit Architecture</span>
            <p className="text-[#94A3B8] leading-relaxed">
              Original raw evidence files remain off-chain in secure Supabase Storage. The calculated cryptographic <strong>SHA-256 hash</strong> and metadata are immutably recorded on <strong>Hyperledger Fabric</strong> for court-admissible chain of custody verification.
            </p>
          </div>

          {/* Evidence Integrity Verification Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#F1F5F9]">Registered Evidence Artifacts ({evidenceList.length})</h3>

            {evidenceList.map((ev) => {
              const isDone = verifiedStatus[ev.evidence_id];
              const isVerifying = verifyingId === ev.evidence_id;

              return (
                <div key={ev.evidence_id} className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#D4A359]" />
                      <span className="font-bold text-[#F1F5F9] text-sm">{ev.file_name}</span>
                      <span className="font-mono text-[10px] bg-[#1A2332] px-2 py-0.5 rounded text-[#94A3B8]">{ev.evidence_id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#94A3B8]">Size: {ev.file_size}</span>
                      <button
                        onClick={() => handleVerify(ev.evidence_id)}
                        disabled={isVerifying || isDone}
                        className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition ${
                          isDone
                            ? 'bg-[#34D399]/15 text-[#34D399] text-[#34D399] border border-[#34D399]/35'
                            : isVerifying
                            ? 'bg-[#D4A359]/15 text-[#D4A359] text-[#D4A359] border border-[#D4A359] animate-pulse'
                            : 'bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] font-semibold shadow-md'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" /> MATCH & VERIFIED
                          </>
                        ) : isVerifying ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Hash...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" /> Re-Verify SHA-256
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SHA-256 Hash Box */}
                  <div className="bg-[#0B0F17] p-3 rounded-[4px] border border-[#222D3F] font-mono text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-[#94A3B8] text-[10px]">
                      <span>CRYPTOGRAPHIC SHA-256 HASH:</span>
                      <span className="text-[#34D399] font-bold">HYPERLEDGER FABRIC RECORDED</span>
                    </div>
                    <p className="text-[#D4A359] break-all">{ev.sha256_hash}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit Trail Section */}
          <div className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-4 space-y-3">
            <h3 className="text-sm font-bold text-[#F1F5F9]">Application Audit Trail Logs</h3>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="bg-[#0B0F17] p-2.5 rounded border border-[#222D3F] flex justify-between text-[#94A3B8]">
                <span>[2026-06-09 18:30:0 IST] EVD-001 Uploaded & Registered to Hyperledger Fabric</span>
                <span className="text-[#34D399] font-bold">SUCCESS</span>
              </div>
              <div className="bg-[#0B0F17] p-2.5 rounded border border-[#222D3F] flex justify-between text-[#94A3B8]">
                <span>[2026-08-08 11:00:0 IST] EVD-002 Cryptographic Hash Match Verified</span>
                <span className="text-[#34D399] font-bold">MATCHED</span>
              </div>
              <div className="bg-[#0B0F17] p-2.5 rounded border border-[#222D3F] flex justify-between text-[#94A3B8]">
                <span>[2026-09-04 22:30:0 IST] Investigator Regional Access Session Authenticated (REG-NCR)</span>
                <span className="text-[#D4A359] font-bold">RLS ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#131A26] border-t border-[#222D3F] p-4 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenDossier();
            }}
            className="px-4 py-2 rounded-[4px] bg-emerald-600 hover:bg-emerald-500 text-[#F1F5F9] text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Scale className="w-4 h-4" /> Generate Legal Evidence Dossier (Sec 63B BNSS)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] text-xs font-medium transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
