import React from 'react';
import { X, Scale, FileText, Download, ShieldCheck, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function DigitalDossierModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80  animate-in fade-in duration-200">
      <div className="bg-[#131A26] border border-[#222D3F] w-full max-w-3xl rounded-[8px] shadow-none overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#131A26] border-b border-[#222D3F] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#8B5CF6]/15 text-[#8B5CF6] text-[#8B5CF6] border border-[#8B5CF6]/35 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/15 text-[#8B5CF6] text-[#8B5CF6] border border-[#8B5CF6]/35">
                SECTION 15 &bull; LEGAL INTELLIGENCE
              </span>
              <h2 className="text-lg font-bold text-[#F1F5F9] mt-0.5">Digital Evidence Dossier & Legal Certificate</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] hover:text-[#F1F5F9] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Content Document */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-[#0B0F17] font-sans">
          <div className="border-2 border-[#222D3F] p-8 rounded-[6px] space-y-6 bg-[#131A26]">
            {/* Header Title */}
            <div className="text-center border-b border-[#222D3F] pb-4 space-y-1">
              <h3 className="text-lg font-black tracking-wider text-[#F1F5F9] uppercase">
                CERTIFICATE OF ELECTRONIC EVIDENCE INTEGRITY
              </h3>
              <p className="text-[11px] font-mono text-[#D4A359]">
                (Under Section 63B Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Evidence Act)
              </p>
              <p className="text-[10px] text-[#94A3B8]">System Reference: CRIMENEXUS-DOSSIER-2026-0904-018</p>
            </div>

            {/* Case & Authority Metadata */}
            <div className="grid grid-cols-2 gap-4 bg-[#0B0F17] p-4 rounded-[4px] border border-[#222D3F] font-mono text-[11px]">
              <div>
                <p className="text-[#94A3B8]">Primary Investigation Case:</p>
                <p className="text-[#F1F5F9] font-bold">CASE-018 (Operation PhishNet)</p>
                <p className="text-[#94A3B8] mt-2">Jurisdiction & PS:</p>
                <p className="text-[#F1F5F9] font-bold">Gurugram Cyber Crime PS (REG-NCR)</p>
              </div>
              <div>
                <p className="text-[#94A3B8]">Authorized Lead Investigator:</p>
                <p className="text-[#F1F5F9] font-bold">Inspector Vikram Batra (INV-NCR-101)</p>
                <p className="text-[#94A3B8] mt-2">Verification Timestamp:</p>
                <p className="text-[#D4A359] font-bold">2026-09-04 22:30:00 IST</p>
              </div>
            </div>

            {/* Evidence Artifact Details */}
            <div className="space-y-2">
              <span className="font-bold text-[#F1F5F9] text-xs block uppercase">Extracted Evidence Records:</span>
              <table className="w-full text-left border-collapse border border-[#222D3F] text-[11px]">
                <thead>
                  <tr className="bg-[#1A2332] text-[#94A3B8]">
                    <th className="p-2 border border-[#222D3F]">Evidence ID</th>
                    <th className="p-2 border border-[#222D3F]">File Name & Source</th>
                    <th className="p-2 border border-[#222D3F]">SHA-256 Hash</th>
                    <th className="p-2 border border-[#222D3F]">Integrity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[#94A3B8] font-mono">
                  {RAW_DATASET.evidence.map((ev) => (
                    <tr key={ev.evidence_id}>
                      <td className="p-2 border border-[#222D3F] text-[#D4A359] font-bold">{ev.evidence_id}</td>
                      <td className="p-2 border border-[#222D3F]">{ev.file_name}</td>
                      <td className="p-2 border border-[#222D3F] text-[10px] break-all">{ev.sha256_hash.slice(0, 24)}...</td>
                      <td className="p-2 border border-[#222D3F] text-[#34D399] font-bold">{ev.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Relevant Legal Provisions */}
            <div className="bg-[#0B0F17] p-4 rounded-[4px] border border-[#222D3F] space-y-2">
              <span className="font-bold text-[#F1F5F9] text-xs uppercase block">Mapped Legal Provisions:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-[#131A26] p-2 rounded border border-[#222D3F]">
                  <strong className="text-[#D4A359]">IT Act 2000</strong>
                  <p className="text-[#94A3B8]">Sec 66C (Identity Theft), Sec 66D (Cheating by Personation)</p>
                </div>
                <div className="bg-[#131A26] p-2 rounded border border-[#222D3F]">
                  <strong className="text-[#34D399]">BNS 2023</strong>
                  <p className="text-[#94A3B8]">Sec 318(4) (Cheating), Sec 61(2) (Criminal Conspiracy)</p>
                </div>
                <div className="bg-[#131A26] p-2 rounded border border-[#222D3F]">
                  <strong className="text-[#8B5CF6]">PMLA 2002</strong>
                  <p className="text-[#94A3B8]">Sec 3 & 4 (Money Laundering & Layering Proceeds)</p>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer Box */}
            <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-[4px] space-y-1 text-[#94A3B8] text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-[#D4A359]">
                <AlertTriangle className="w-4 h-4 text-[#D4A359]" />
                <span>Statutory Advisory & Disclaimer:</span>
              </div>
              <p className="italic">
                CrimeNexus assists authorized law enforcement investigators with evidence synthesis and digital dossier preparation. CrimeNexus does not independently determine guilt, legal liability, or final court admissibility.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#131A26] border-t border-[#222D3F] p-4 flex items-center justify-between">
          <button
            onClick={handlePrintDossier}
            className="px-4 py-2 rounded-[4px] bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] font-semibold text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" /> Download / Print PDF Dossier
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
