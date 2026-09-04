import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, ShieldCheck, Cpu, RefreshCw, AlertCircle } from 'lucide-react';

export default function UploadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [fileType, setFileType] = useState('FIR');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [calculatedHash, setCalculatedHash] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProcessUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate backend PyMuPDF / PaddleOCR / Pandas entity extraction & SHA-256 calculation
    setTimeout(() => {
      // Dummy SHA-256 hash generation
      const fakeHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      setCalculatedHash(fakeHash);
      setIsUploading(false);
      setUploadSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131b2e] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                SECTION 2 &bull; EVIDENCE DATA INGESTION
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">Upload Investigation Data & Reports</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Document Type Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 block">Select Data Category:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'FIR', label: 'FIR / Police Report' },
                { id: 'CDR', label: 'CDR Call Dump' },
                { id: 'STR', label: 'Bank STR / Txns' },
                { id: 'CYBER', label: 'Cyber / Device IP' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFileType(cat.id)}
                  className={`p-2.5 rounded-lg border text-center font-semibold transition ${
                    fileType === cat.id
                      ? 'bg-blue-600/30 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Dropzone Area */}
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-8 text-center bg-slate-950/60 transition cursor-pointer relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">
              {selectedFile ? selectedFile.name : 'Click to select or drag evidence file here'}
            </p>
            <p className="text-slate-400 text-[11px] mt-1">
              Supports PDF (PyMuPDF / PaddleOCR), CSV (Pandas), TXT, and JSON formats.
            </p>
          </div>

          {/* Automated Flow Pipeline Status */}
          {isUploading && (
            <div className="bg-slate-900 p-4 rounded-xl border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-300">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Executing Automated Data Extraction Pipeline...</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-400">
                <p>&bull; Calculating SHA-256 Hash...</p>
                <p>&bull; Off-Chain Storage to Supabase Storage...</p>
                <p>&bull; Extracting Entities via NLP & Regex...</p>
                <p>&bull; Updating Neo4j Criminal Knowledge Graph...</p>
              </div>
            </div>
          )}

          {/* Upload Success Alert */}
          {uploadSuccess && (
            <div className="bg-emerald-950/50 border border-emerald-500/40 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Evidence Successfully Ingested & Graph Updated!</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px]">
                <span className="text-slate-400 text-[10px] block">GENERATED SHA-256 HASH:</span>
                <span className="text-cyan-300 break-all">{calculatedHash}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900/90 border-t border-slate-800 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessUpload}
            disabled={!selectedFile || isUploading}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50"
          >
            {isUploading ? 'Ingesting...' : 'Ingest Evidence Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
