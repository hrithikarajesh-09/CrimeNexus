import React, { useState } from 'react';
import { Database, Filter, ExternalLink, Play, Users, Phone, CreditCard, Car, ShieldAlert, Cpu, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function CasesView({ currentRegion, onOpenCase, onStartReconstruction, onAskCopilot, searchQuery }) {
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter cases by active region and search query
  const filteredCases = RAW_DATASET.cases.filter((c) => {
    // Region Filter (unless Super-Admin)
    if (currentRegion !== 'ALL-REGIONS' && c.jurisdiction !== currentRegion) {
      return false;
    }
    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBasic = c.case_id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      if (matchBasic) return true;
      // Search inside people/phones/accounts
      const matchPeople = RAW_DATASET.people.some(p => p.primary_case_id === c.case_id && p.name.toLowerCase().includes(q));
      return matchPeople;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                SECTION 3 &bull; CASES WORKSPACE
              </span>
              <h2 className="text-xl font-bold text-white">Active Criminal Investigations</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Isolated by Supabase Row Level Security (RLS) &bull; Filtered for: <strong className="text-cyan-300">{currentRegion}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Total Cases: <strong>{filteredCases.length}</strong></span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Cross-Case Bridges: <strong>1 Detected</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredCases.map((c) => (
          <div
            key={c.case_id}
            className="bg-[#131b2e] border border-slate-800 hover:border-blue-500/50 rounded-xl p-6 transition duration-200 shadow-lg flex flex-col justify-between group"
          >
            <div>
              {/* Card Top Row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-600/20 text-cyan-400 border border-blue-500/30">
                  {c.case_id}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  c.jurisdiction === 'REG-NCR' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}>
                  {c.jurisdiction}
                </span>
              </div>

              {/* Title & Category */}
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                {c.title}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{c.category}</p>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                {c.description}
              </p>

              {/* Entity Breakdown Stats Pill */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Associated Extracted Metadata:
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-slate-300 font-medium">Evidence: <strong>{c.stats.evidence}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300 font-medium">People: <strong>{c.stats.people}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-slate-300 font-medium">Phones: <strong>{c.stats.phones}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-300 font-medium">Accounts: <strong>{c.stats.accounts}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                    <Car className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-slate-300 font-medium">Vehicles: <strong>{c.stats.vehicles}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-300 font-medium">Devices: <strong>{c.stats.devices}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => onOpenCase(c.case_id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Workspace
              </button>
              <button
                onClick={() => onStartReconstruction(c.case_id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
                title="Start AI Investigation Reconstruction"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                Investigate
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Cases Found for Current Filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try selecting "Super-Admin (Cross-Regional)" in the top navigation bar or clearing your search term to view all regional case records.
          </p>
        </div>
      )}
    </div>
  );
}
