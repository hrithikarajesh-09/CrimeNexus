import React, { useState } from 'react';
import { Search, Database, Sparkles, Layers, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function SimilarCasesSearch({ onOpenCase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activePattern, setActivePattern] = useState('ALL');

  const patterns = [
    { id: 'ALL', name: 'All Incident Patterns' },
    { id: 'phishing', name: 'Spear-Phishing RTGS Heist' },
    { id: 'mule', name: 'Multi-Tier Mule Dispersal' },
    { id: 'simbox', name: 'SIM Box Gateway Spoofing' },
    { id: 'tbml', name: 'Trade-Based Money Laundering' }
  ];

  const historicalCases = [
    {
      case_id: "CASE-018",
      title: "Operation PhishNet",
      jurisdiction: "REG-NCR",
      similarity_score: "100% Match (Current Case)",
      mo_summary: "Spear-phishing email impersonation leading to credential harvesting, RTGS fraud transfer, and rapid mule account layering.",
      vector_distance: 0.00
    },
    {
      case_id: "CASE-041",
      title: "Operation ShadowLedge",
      jurisdiction: "REG-MUM",
      similarity_score: "87.4% M.O. Semantic Match",
      mo_summary: "Trade-based money laundering using corporate shell company (Apex Trade), over-invoicing, and offshore SWIFT transfer to Dubai bullion.",
      vector_distance: 0.126
    },
    {
      case_id: "CASE-059",
      title: "Operation DarkSIM",
      jurisdiction: "REG-NCR",
      similarity_score: "82.1% M.O. Semantic Match",
      mo_summary: "Illegal multi-port SIM box equipment supplying burner phone numbers for phishing call spoofing and OTP interception.",
      vector_distance: 0.179
    },
    {
      case_id: "CASE-HIST-2025-09",
      title: "Operation CyberVault (Historical 2025)",
      jurisdiction: "REG-BLR",
      similarity_score: "79.8% M.O. Semantic Match",
      mo_summary: "Corporate treasury spear-phishing targeting tech firm CFOs with duplicate auth portals and Jaipur student mule networks.",
      vector_distance: 0.202
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
            SECTION 8 &bull; SIMILAR CASES / M.O. SEARCH
          </span>
          <h2 className="text-xl font-bold text-white">Semantic Incident Pattern Matching</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Powered by Supabase <strong className="text-cyan-300">pgvector</strong> & Sentence Transformers. Finds historically similar cases based on semantic Modus Operandi (M.O.), even when there is no shared person or phone number.
        </p>
      </div>

      {/* Pattern Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">Filter by M.O. Pattern:</span>
        {patterns.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePattern(p.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
              activePattern === p.id
                ? 'bg-blue-600 text-white border-cyan-400 font-semibold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Semantic Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {historicalCases.map((hc) => (
          <div key={hc.case_id} className="bg-[#131b2e] border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 shadow-xl space-y-4 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-600/20 text-cyan-300 border border-blue-500/30">
                {hc.case_id}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {hc.similarity_score}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{hc.title}</h3>
              <span className="text-xs text-slate-400">Jurisdiction: {hc.jurisdiction}</span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 leading-relaxed">
              <strong>Modus Operandi Summary:</strong> {hc.mo_summary}
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">pgvector Cosine Distance: {hc.vector_distance}</span>
              <button
                onClick={() => onOpenCase(hc.case_id)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                Compare Workspace <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
