import React, { useState } from 'react';
import { Search, Calendar, User, FileText, ArrowRight, ShieldCheck, Building2, CreditCard, Phone, Car, Laptop, ChevronRight } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function CasesView({ session, onOpenCase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('ALL');

  // 1. Filter cases by access jurisdiction and search
  const filteredCases = RAW_DATASET.cases.filter((c) => {
    // Jurisdiction Filter
    if (!session.isSuperAdmin && c.jurisdiction !== session.regionId) {
      return false;
    }
    if (selectedJurisdiction !== 'ALL' && c.jurisdiction !== selectedJurisdiction) {
      return false;
    }
    // Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchBasic = c.case_id.toLowerCase().includes(q) ||
        c.case_number.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      if (matchBasic) return true;

      // Match suspects or accounts
      const matchPeople = RAW_DATASET.people.some(p => 
        (p.primary_case_id === c.case_id || p.is_bridge) && 
        (p.name.toLowerCase().includes(q) || p.alias.toLowerCase().includes(q) || (p.pan && p.pan.toLowerCase().includes(q)))
      );
      if (matchPeople) return true;

      const matchPhone = RAW_DATASET.phones.some(ph => ph.msisdn.includes(q));
      if (matchPhone) return true;

      const matchAccount = RAW_DATASET.accounts.some(acc => acc.account_number.includes(q) || acc.holder_name.toLowerCase().includes(q));
      return matchAccount;
    }
    return true;
  });

  // 2. Sort chronologically: most recent first!
  const sortedCases = [...filteredCases].sort((a, b) => {
    return new Date(b.registration_date) - new Date(a.registration_date);
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* Top Header & Search Bar */}
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                CHRONOLOGICAL REGISTRY
              </span>
              <span className="text-xs text-slate-400">Most Recent First</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Investigation Cases</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any case to launch its comprehensive case workspace, review investigation, and inspect the network graph.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Filter Jurisdiction:</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              disabled={!session.isSuperAdmin}
              className="bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
            >
              <option value="ALL">All Authorized ({session.isSuperAdmin ? '3 Regions' : session.regionId})</option>
              <option value="REG-NCR">Region A — NCR / Gurugram</option>
              <option value="REG-MUM">Region B — Western / Mumbai</option>
              <option value="REG-BLR">Region C — Southern / Bengaluru</option>
            </select>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID, Case Number, Suspect Name (e.g. Devrat, Rajesh), Phone, Account, or PAN..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chronological List of Cases */}
      <div className="space-y-4">
        {sortedCases.length === 0 ? (
          <div className="text-center py-12 bg-[#0f1422] border border-slate-800 rounded-2xl">
            <p className="text-sm font-semibold text-slate-400">No cases match your search query or regional jurisdiction.</p>
          </div>
        ) : (
          sortedCases.map((c, index) => {
            return (
              <div
                key={c.case_id}
                onClick={() => onOpenCase(c.case_id)}
                className="group bg-[#0f1422] border border-slate-800 hover:border-blue-500/60 rounded-2xl p-6 transition duration-200 shadow-lg cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Case Info */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20">
                      {c.case_id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {c.case_number}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {c.registration_date}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{c.category} &bull; Jurisdiction: <strong className="text-slate-300">{c.region_name}</strong></p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl line-clamp-2">
                    {c.description}
                  </p>

                  {/* Metadata Pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Evidence: <strong className="text-slate-200">{c.stats.evidence}</strong></span>
                    </span>
                    <span className="text-slate-700">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>People: <strong className="text-slate-200">{c.stats.people}</strong></span>
                    </span>
                    <span className="text-slate-700">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Accounts: <strong className="text-slate-200">{c.stats.accounts}</strong></span>
                    </span>
                    <span className="text-slate-700">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-purple-400" />
                      <span>Phones: <strong className="text-slate-200">{c.stats.phones}</strong></span>
                    </span>
                    <span className="text-slate-700">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-pink-400" />
                      <span>Vehicles: <strong className="text-slate-200">{c.stats.vehicles}</strong></span>
                    </span>
                  </div>
                </div>

                {/* Right: Lead Investigator & Action Button */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                  <div className="text-left md:text-right text-xs">
                    <span className="text-slate-500 block text-[11px]">Lead Investigator</span>
                    <span className="font-semibold text-slate-200">{c.investigator_name}</span>
                    <span className="text-slate-500 font-mono block text-[10px]">{c.investigator_id}</span>
                  </div>

                  <button
                    onClick={() => onOpenCase(c.case_id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 group-hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/10 active:scale-95"
                  >
                    <span>Open Case Workspace</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
