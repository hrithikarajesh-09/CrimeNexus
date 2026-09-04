import React, { useState } from 'react';
import { Search, Calendar, User, FileText, ChevronRight, CreditCard, Phone } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-5 font-sans">
      {/* Top Header & Search Bar Card */}
      <div className="dossier-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#1F2430] text-[#C68A46] border border-[#2B313D]">
                CHRONOLOGICAL REGISTRY
              </span>
              <span className="text-xs text-[#6B7382] font-mono">[ Most Recent First ]</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#E8EAEE] mt-1 tracking-tight">
              Active Investigations
            </h2>
            <p className="text-xs text-[#9AA3B2]">
              Authorized incident dockets and case dossiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7382]">Filter Station:</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              disabled={!session.isSuperAdmin}
              className="bg-[#1F2430] border border-[#2B313D] text-xs text-[#E8EAEE] rounded-[5px] px-2.5 py-1.5 focus:outline-none focus:border-[#C68A46] cursor-pointer disabled:opacity-50"
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
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7382]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID, Case Number, Suspect Name (e.g. Devrat, Rajesh), Phone, Account, or PAN..."
            className="w-full pl-9 pr-3 py-2 bg-[#1F2430] border border-[#2B313D] rounded-[5px] text-xs text-[#E8EAEE] placeholder-[#6B7382] focus:outline-none focus:border-[#C68A46]"
          />
        </div>
      </div>

      {/* Chronological List of Cases */}
      <div className="space-y-3">
        {sortedCases.length === 0 ? (
          <div className="text-center py-10 dossier-card">
            <p className="text-xs text-[#6B7382]">No cases match your search query or regional jurisdiction.</p>
          </div>
        ) : (
          sortedCases.map((c) => (
            <div
              key={c.case_id}
              onClick={() => onOpenCase(c.case_id)}
              className="dossier-card dossier-card-hover p-4 transition duration-150 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left: Case Info */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#1F2430] text-[#C68A46] border border-[#2B313D]">
                    {c.case_id}
                  </span>
                  <span className="text-xs font-mono text-[#6B7382]">
                    {c.case_number}
                  </span>
                  <span className="text-[11px] font-mono text-[#6B7382] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#6B7382]" />
                    {c.registration_date}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[3px] bg-[#1F2430] text-[#9AA3B2] border border-[#2B313D]">
                    {c.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-[#E8EAEE] group-hover:text-[#C68A46] transition">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[#6B7382]">{c.category} &bull; Jurisdiction: <strong className="text-[#E8EAEE]">{c.region_name}</strong></p>
                </div>

                <p className="text-xs text-[#9AA3B2] leading-relaxed line-clamp-2">
                  {c.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-[#6B7382] font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#4E9C93]" />
                    <span>Evidence: <strong className="text-[#E8EAEE]">{c.stats.evidence}</strong></span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-[#6C93B8]" />
                    <span>People: <strong className="text-[#E8EAEE]">{c.stats.people}</strong></span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-[#4E9C93]" />
                    <span>Accounts: <strong className="text-[#E8EAEE]">{c.stats.accounts}</strong></span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#8B81C4]" />
                    <span>Phones: <strong className="text-[#E8EAEE]">{c.stats.phones}</strong></span>
                  </span>
                </div>
              </div>

              {/* Right: Lead Investigator & Action Button */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 shrink-0 border-t md:border-t-0 pt-2.5 md:pt-0 border-[#2B313D]">
                <div className="text-left md:text-right text-xs">
                  <span className="text-[#6B7382] block text-[11px] font-mono">LEAD OFFICER</span>
                  <span className="font-medium text-[#E8EAEE]">{c.investigator_name}</span>
                  <span className="text-[#C68A46] font-mono block text-[10px]">{c.investigator_id}</span>
                </div>

                <button
                  onClick={() => onOpenCase(c.case_id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C68A46] hover:bg-[#D49855] text-[#12151B] rounded-[5px] text-xs font-semibold transition"
                >
                  <span>Open Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
