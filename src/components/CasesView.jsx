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
      <div className="bg-[#1a2320]/90 border border-[#116466]/40 rounded-2xl p-6 shadow-xl space-y-4 futuristic-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#116466]/25 text-[#D1E8E2] border border-[#116466]/45">
                CHRONOLOGICAL REGISTRY
              </span>
              <span className="text-xs text-[#D9B08C] font-mono">[ Most Recent First ]</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1 font-display tracking-wide">
              Investigation Cases
            </h2>
            <p className="text-xs text-[#7e968e] mt-0.5">
              Select any file to launch its deep workspace, inspect Wikipedia-style evidence hovers, review live reconstruction, and examine legal violations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#7e968e]">Filter Jurisdiction:</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              disabled={!session.isSuperAdmin}
              className="bg-[#141a18] border border-[#116466]/40 text-xs font-medium text-[#D1E8E2] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#116466] cursor-pointer disabled:opacity-50"
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
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e968e]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID, Case Number, Suspect Name (e.g. Devrat, Rajesh), Phone, Account, or PAN..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#121816] border border-[#116466]/40 rounded-xl text-xs text-[#D1E8E2] placeholder-[#7e968e] focus:outline-none focus:border-[#116466] focus:ring-1 focus:ring-[#116466]"
          />
        </div>
      </div>

      {/* Chronological List of Cases */}
      <div className="space-y-4">
        {sortedCases.length === 0 ? (
          <div className="text-center py-12 bg-[#1a2320]/80 border border-[#116466]/30 rounded-2xl">
            <p className="text-sm font-semibold text-[#7e968e]">No cases match your search query or regional jurisdiction.</p>
          </div>
        ) : (
          sortedCases.map((c) => {
            return (
              <div
                key={c.case_id}
                onClick={() => onOpenCase(c.case_id)}
                className="group bg-[#1a2320]/85 border border-[#116466]/35 hover:border-[#116466] rounded-2xl p-6 transition duration-200 shadow-lg cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 futuristic-panel"
              >
                {/* Left: Case Info */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#116466]/20 text-[#D1E8E2] border border-[#116466]/40">
                      {c.case_id}
                    </span>
                    <span className="text-xs font-mono text-[#D9B08C]">
                      {c.case_number}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#141a18] text-[#D1E8E2] border border-[#116466]/30 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D9B08C]" />
                      {c.registration_date}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#116466]/30 text-[#D1E8E2] border border-[#116466]/50">
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#FFCB9A] transition font-display tracking-wide">
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#7e968e] font-medium">{c.category} &bull; Jurisdiction: <strong className="text-[#D9B08C]">{c.region_name}</strong></p>
                  </div>

                  <p className="text-xs text-[#a3b8b0] leading-relaxed max-w-3xl line-clamp-2">
                    {c.description}
                  </p>

                  {/* Metadata Pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#7e968e]">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#D1E8E2]" />
                      <span>Evidence: <strong className="text-white">{c.stats.evidence}</strong></span>
                    </span>
                    <span className="text-[#2C3531]">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D9B08C]" />
                      <span>People: <strong className="text-white">{c.stats.people}</strong></span>
                    </span>
                    <span className="text-[#2C3531]">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#FFCB9A]" />
                      <span>Accounts: <strong className="text-white">{c.stats.accounts}</strong></span>
                    </span>
                    <span className="text-[#2C3531]">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#D1E8E2]" />
                      <span>Phones: <strong className="text-white">{c.stats.phones}</strong></span>
                    </span>
                    <span className="text-[#2C3531]">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#D9B08C]" />
                      <span>Vehicles: <strong className="text-white">{c.stats.vehicles}</strong></span>
                    </span>
                  </div>
                </div>

                {/* Right: Lead Investigator & Action Button */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#116466]/20">
                  <div className="text-left md:text-right text-xs">
                    <span className="text-[#7e968e] block text-[11px]">Lead Investigator</span>
                    <span className="font-semibold text-[#D1E8E2]">{c.investigator_name}</span>
                    <span className="text-[#D9B08C] font-mono block text-[10px]">{c.investigator_id}</span>
                  </div>

                  <button
                    onClick={() => onOpenCase(c.case_id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#116466] group-hover:bg-[#167b7e] text-white rounded-xl text-xs font-bold tracking-wide transition shadow-md shadow-[#116466]/20 active:scale-95 border border-[#116466]"
                  >
                    <span>Open Case Workspace</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition text-[#D1E8E2]" />
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
