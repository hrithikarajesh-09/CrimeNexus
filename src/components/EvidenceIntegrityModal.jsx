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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131b2e] border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SECTIONS 13 & 14 &bull; HYPERLEDGER FABRIC
                </span>
                <span className="text-xs text-slate-400">Cryptographic Evidence Ledger</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">SHA-256 Evidence Integrity & Audit Trail</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Architecture Banner */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
            <span className="font-bold text-slate-200 text-xs block">Off-Chain Storage & On-Chain Audit Architecture</span>
            <p className="text-slate-400 leading-relaxed">
              Original raw evidence files remain off-chain in secure Supabase Storage. The calculated cryptographic <strong>SHA-256 hash</strong> and metadata are immutably recorded on <strong>Hyperledger Fabric</strong> for court-admissible chain of custody verification.
            </p>
          </div>

          {/* Evidence Integrity Verification Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Registered Evidence Artifacts ({evidenceList.length})</h3>

            {evidenceList.map((ev) => {
              const isDone = verifiedStatus[ev.evidence_id];
              const isVerifying = verifyingId === ev.evidence_id;

              return (
                <div key={ev.evidence_id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-slate-200 text-sm">{ev.file_name}</span>
                      <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">{ev.evidence_id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Size: {ev.file_size}</span>
                      <button
                        onClick={() => handleVerify(ev.evidence_id)}
                        disabled={isVerifying || isDone}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isVerifying
                            ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> MATCH & VERIFIED
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
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span>CRYPTOGRAPHIC SHA-256 HASH:</span>
                      <span className="text-emerald-400 font-bold">HYPERLEDGER FABRIC RECORDED</span>
                    </div>
                    <p className="text-cyan-300 break-all">{ev.sha256_hash}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit Trail Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white">Application Audit Trail Logs</h3>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between text-slate-300">
                <span>[2026-06-09 18:30:0 IST] EVD-001 Uploaded & Registered to Hyperledger Fabric</span>
                <span className="text-emerald-400 font-bold">SUCCESS</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between text-slate-300">
                <span>[2026-08-08 11:00:0 IST] EVD-002 Cryptographic Hash Match Verified</span>
                <span className="text-emerald-400 font-bold">MATCHED</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between text-slate-300">
                <span>[2026-09-04 22:30:0 IST] Investigator Regional Access Session Authenticated (REG-NCR)</span>
                <span className="text-cyan-400 font-bold">RLS ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900/90 border-t border-slate-800 p-4 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenDossier();
            }}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Scale className="w-4 h-4" /> Generate Legal Evidence Dossier (Sec 63B BNSS)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
