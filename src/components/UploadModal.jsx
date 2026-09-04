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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80  animate-in fade-in duration-200">
      <div className="bg-[#131A26] border border-[#222D3F] w-full max-w-2xl rounded-[8px] shadow-none overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#131A26] border-b border-[#222D3F] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#D4A359]/15 text-[#D4A359] text-[#D4A359] border border-[#D4A359]/30 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#D4A359]/15 text-[#D4A359] text-[#D4A359] border border-[#D4A359]/30">
                SECTION 2 &bull; EVIDENCE DATA INGESTION
              </span>
              <h2 className="text-lg font-bold text-[#F1F5F9] mt-0.5">Upload Investigation Data & Reports</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] hover:text-[#F1F5F9] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Document Type Selector */}
          <div className="space-y-2">
            <label className="font-bold text-[#94A3B8] block">Select Data Category:</label>
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
                  className={`p-2.5 rounded-[4px] border text-center font-semibold transition ${
                    fileType === cat.id
                      ? 'bg-[#D4A359]/15 text-[#D4A359] border-[#D4A359] text-[#D4A359]'
                      : 'bg-[#131A26] border-[#222D3F] text-[#94A3B8] hover:bg-[#1A2332]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Dropzone Area */}
          <div className="border-2 border-dashed border-[#222D3F] hover:border-[#D4A359]/40 rounded-[6px] p-8 text-center bg-[#0B0F17] transition cursor-pointer relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileText className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#F1F5F9]">
              {selectedFile ? selectedFile.name : 'Click to select or drag evidence file here'}
            </p>
            <p className="text-[#94A3B8] text-[11px] mt-1">
              Supports PDF (PyMuPDF / PaddleOCR), CSV (Pandas), TXT, and JSON formats.
            </p>
          </div>

          {/* Automated Flow Pipeline Status */}
          {isUploading && (
            <div className="bg-[#131A26] p-4 rounded-[6px] border border-[#D4A359]/30 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#D4A359]">
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4A359]" />
                <span>Executing Automated Data Extraction Pipeline...</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-[#94A3B8]">
                <p>&bull; Calculating SHA-256 Hash...</p>
                <p>&bull; Off-Chain Storage to Supabase Storage...</p>
                <p>&bull; Extracting Entities via NLP & Regex...</p>
                <p>&bull; Updating Neo4j Criminal Knowledge Graph...</p>
              </div>
            </div>
          )}

          {/* Upload Success Alert */}
          {uploadSuccess && (
            <div className="bg-emerald-950/50 border border-emerald-500/40 p-4 rounded-[6px] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#34D399] text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
                <span>Evidence Successfully Ingested & Graph Updated!</span>
              </div>
              <div className="bg-[#0B0F17] p-2.5 rounded border border-[#222D3F] font-mono text-[11px]">
                <span className="text-[#94A3B8] text-[10px] block">GENERATED SHA-256 HASH:</span>
                <span className="text-[#D4A359] break-all">{calculatedHash}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#131A26] border-t border-[#222D3F] p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessUpload}
            disabled={!selectedFile || isUploading}
            className="px-5 py-2.5 rounded-[4px] bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] font-semibold text-xs font-bold transition disabled:opacity-50"
          >
            {isUploading ? 'Ingesting...' : 'Ingest Evidence Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
