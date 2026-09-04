import React, { useState } from 'react';
import { Search, Calendar, User, FileText, ArrowRight, ShieldCheck, Building2, CreditCard, Phone, Car, Laptop, ChevronRight } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function CasesView({ session, onOpenCase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('ALL');

  // Filter cases by jurisdiction and search query
  const filteredCases = RAW_DATASET.cases.filter((c) => {
    if (!session.isSuperAdmin && c.jurisdiction !== session.regionId) {
      return false;
    }
    if (selectedJurisdiction !== 'ALL' && c.jurisdiction !== selectedJurisdiction) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchBasic = c.case_id.toLowerCase().includes(q) ||
        c.case_number.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      if (matchBasic) return true;

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

  // Sort chronologically (most recent first)
  const sortedCases = [...filteredCases].sort((a, b) => {
    return new Date(b.registration_date) - new Date(a.registration_date);
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* Top Header & Search Bar */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/30 rounded-3xl p-7 shadow-2xl space-y-4 ethereal-glass">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-0.5 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/35">
                CHRONOLOGICAL REGISTRY
              </span>
              <span className="text-xs text-[#84CEEB] font-mono">[ Most Recent First ]</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1.5 font-display tracking-wide">
              Investigation Cases
            </h2>
            <p className="text-xs text-[#8e9cc2] mt-0.5">
              Select any file to launch its deep workspace, inspect point-wise narratives, real network graphs, and live documentary reconstruction.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8e9cc2]">Filter Jurisdiction:</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              disabled={!session.isSuperAdmin}
              className="bg-[#080c18] border border-[#5680E9]/30 text-xs font-medium text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#84CEEB] cursor-pointer disabled:opacity-50"
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
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8e9cc2]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID, Case Number, Suspect Name (e.g. Devrat, Rajesh), Phone, Account, or PAN..."
            className="w-full pl-11 pr-4 py-3 bg-[#080c18] border border-[#5680E9]/30 rounded-2xl text-xs text-white placeholder-[#8e9cc2] focus:outline-none focus:border-[#84CEEB] focus:ring-1 focus:ring-[#84CEEB]"
          />
        </div>
      </div>

      {/* Chronological List of Cases */}
      <div className="space-y-4">
        {sortedCases.length === 0 ? (
          <div className="text-center py-12 bg-[#0f1629]/80 border border-[#5680E9]/20 rounded-3xl">
            <p className="text-sm font-semibold text-[#8e9cc2]">No cases match your search query or regional jurisdiction.</p>
          </div>
        ) : (
          sortedCases.map((c) => (
            <div
              key={c.case_id}
              onClick={() => onOpenCase(c.case_id)}
              className="group bg-[#0f1629]/85 border border-[#5680E9]/25 hover:border-[#5680E9] rounded-3xl p-6 transition duration-200 shadow-xl cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 ethereal-glass"
            >
              {/* Left: Case Info */}
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/35">
                    {c.case_id}
                  </span>
                  <span className="text-xs font-mono text-[#84CEEB]">
                    {c.case_number}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#080c18] text-[#C1C8E4] border border-[#5680E9]/25 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#84CEEB]" />
                    {c.registration_date}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/40">
                    {c.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#84CEEB] transition font-display tracking-wide">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[#8e9cc2] font-medium">{c.category} &bull; Jurisdiction: <strong className="text-white">{c.region_name}</strong></p>
                </div>

                <p className="text-xs text-[#C1C8E4] leading-relaxed max-w-3xl line-clamp-2">
                  {c.description}
                </p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#8e9cc2]">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#84CEEB]" />
                    <span>Evidence: <strong className="text-white">{c.stats.evidence}</strong></span>
                  </span>
                  <span className="text-[#5680E9]/40">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#5AB9EA]" />
                    <span>People: <strong className="text-white">{c.stats.people}</strong></span>
                  </span>
                  <span className="text-[#5680E9]/40">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#84CEEB]" />
                    <span>Accounts: <strong className="text-white">{c.stats.accounts}</strong></span>
                  </span>
                  <span className="text-[#5680E9]/40">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8860D0]" />
                    <span>Phones: <strong className="text-white">{c.stats.phones}</strong></span>
                  </span>
                </div>
              </div>

              {/* Right: Lead Investigator & Action Button */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#5680E9]/20">
                <div className="text-left md:text-right text-xs">
                  <span className="text-[#8e9cc2] block text-[11px]">Lead Investigator</span>
                  <span className="font-semibold text-white">{c.investigator_name}</span>
                  <span className="text-[#84CEEB] font-mono block text-[10px]">{c.investigator_id}</span>
                </div>

                <button
                  onClick={() => onOpenCase(c.case_id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5680E9] to-[#8860D0] hover:opacity-95 text-white rounded-2xl text-xs font-bold tracking-wide transition shadow-lg shadow-[#5680E9]/20 active:scale-95"
                >
                  <span>Open Case Workspace</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition text-white" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
