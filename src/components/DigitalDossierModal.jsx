import React from 'react';
import { X, Scale, FileText, Download, ShieldCheck, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function DigitalDossierModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131b2e] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                SECTION 15 &bull; LEGAL INTELLIGENCE
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">Digital Evidence Dossier & Legal Certificate</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Content Document */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-slate-950 font-sans">
          <div className="border-2 border-slate-700 p-8 rounded-xl space-y-6 bg-slate-900/50">
            {/* Header Title */}
            <div className="text-center border-b border-slate-700 pb-4 space-y-1">
              <h3 className="text-lg font-black tracking-wider text-white uppercase">
                CERTIFICATE OF ELECTRONIC EVIDENCE INTEGRITY
              </h3>
              <p className="text-[11px] font-mono text-cyan-400">
                (Under Section 63B Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Evidence Act)
              </p>
              <p className="text-[10px] text-slate-400">System Reference: CRIMENEXUS-DOSSIER-2026-0904-018</p>
            </div>

            {/* Case & Authority Metadata */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[11px]">
              <div>
                <p className="text-slate-400">Primary Investigation Case:</p>
                <p className="text-white font-bold">CASE-018 (Operation PhishNet)</p>
                <p className="text-slate-400 mt-2">Jurisdiction & PS:</p>
                <p className="text-white font-bold">Gurugram Cyber Crime PS (REG-NCR)</p>
              </div>
              <div>
                <p className="text-slate-400">Authorized Lead Investigator:</p>
                <p className="text-white font-bold">Inspector Vikram Batra (INV-NCR-101)</p>
                <p className="text-slate-400 mt-2">Verification Timestamp:</p>
                <p className="text-cyan-400 font-bold">2026-09-04 22:30:00 IST</p>
              </div>
            </div>

            {/* Evidence Artifact Details */}
            <div className="space-y-2">
              <span className="font-bold text-slate-200 text-xs block uppercase">Extracted Evidence Records:</span>
              <table className="w-full text-left border-collapse border border-slate-800 text-[11px]">
                <thead>
                  <tr className="bg-slate-800 text-slate-300">
                    <th className="p-2 border border-slate-700">Evidence ID</th>
                    <th className="p-2 border border-slate-700">File Name & Source</th>
                    <th className="p-2 border border-slate-700">SHA-256 Hash</th>
                    <th className="p-2 border border-slate-700">Integrity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {RAW_DATASET.evidence.map((ev) => (
                    <tr key={ev.evidence_id}>
                      <td className="p-2 border border-slate-800 text-cyan-300 font-bold">{ev.evidence_id}</td>
                      <td className="p-2 border border-slate-800">{ev.file_name}</td>
                      <td className="p-2 border border-slate-800 text-[10px] break-all">{ev.sha256_hash.slice(0, 24)}...</td>
                      <td className="p-2 border border-slate-800 text-emerald-400 font-bold">{ev.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Relevant Legal Provisions */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 text-xs uppercase block">Mapped Legal Provisions:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-cyan-300">IT Act 2000</strong>
                  <p className="text-slate-400">Sec 66C (Identity Theft), Sec 66D (Cheating by Personation)</p>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-emerald-300">BNS 2023</strong>
                  <p className="text-slate-400">Sec 318(4) (Cheating), Sec 61(2) (Criminal Conspiracy)</p>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-purple-300">PMLA 2002</strong>
                  <p className="text-slate-400">Sec 3 & 4 (Money Laundering & Layering Proceeds)</p>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer Box */}
            <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-lg space-y-1 text-slate-300 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Statutory Advisory & Disclaimer:</span>
              </div>
              <p className="italic">
                CrimeNexus assists authorized law enforcement investigators with evidence synthesis and digital dossier preparation. CrimeNexus does not independently determine guilt, legal liability, or final court admissibility.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900/90 border-t border-slate-800 p-4 flex items-center justify-between">
          <button
            onClick={handlePrintDossier}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" /> Download / Print PDF Dossier
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
