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
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* Top Header & Search Bar */}
      <div className="panel rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
                CHRONOLOGICAL REGISTRY
              </span>
              <span className="text-xs text-brand-accent font-mono">[ Most Recent First ]</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Active Investigations
            </h2>
            <p className="text-xs text-brand-slate">
              Select a file to inspect point-wise narratives, real network graphs, and live documentary reconstruction.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-slate">Filter Jurisdiction:</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              disabled={!session.isSuperAdmin}
              className="bg-dark-bg border border-dark-border text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-primary cursor-pointer disabled:opacity-50"
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
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-slate" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID, Case Number, Suspect Name (e.g. Devrat, Rajesh), Phone, Account, or PAN..."
            className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-xs text-white placeholder-dark-slate focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {/* Chronological List of Cases */}
      <div className="space-y-3">
        {sortedCases.length === 0 ? (
          <div className="text-center py-10 panel rounded-xl">
            <p className="text-xs text-dark-slate">No cases match your search query or regional jurisdiction.</p>
          </div>
        ) : (
          sortedCases.map((c) => (
            <div
              key={c.case_id}
              onClick={() => onOpenCase(c.case_id)}
              className="panel panel-hover rounded-xl p-5 transition duration-150 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Left: Case Info */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
                    {c.case_id}
                  </span>
                  <span className="text-xs font-mono text-dark-slate">
                    {c.case_number}
                  </span>
                  <span className="text-[11px] font-mono text-dark-slate flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-slate" />
                    {c.registration_date}
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                    {c.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-accent transition">
                    {c.title}
                  </h3>
                  <p className="text-xs text-dark-slate font-medium">{c.category} &bull; Jurisdiction: <strong className="text-white">{c.region_name}</strong></p>
                </div>

                <p className="text-xs text-brand-slate leading-relaxed line-clamp-2">
                  {c.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-dark-slate">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Evidence: <strong className="text-white">{c.stats.evidence}</strong></span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-slate" />
                    <span>People: <strong className="text-white">{c.stats.people}</strong></span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-brand-slate" />
                    <span>Accounts: <strong className="text-white">{c.stats.accounts}</strong></span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-slate" />
                    <span>Phones: <strong className="text-white">{c.stats.phones}</strong></span>
                  </span>
                </div>
              </div>

              {/* Right: Lead Investigator & Action Button */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-dark-border">
                <div className="text-left md:text-right text-xs">
                  <span className="text-dark-slate block text-[11px]">Lead Investigator</span>
                  <span className="font-medium text-white">{c.investigator_name}</span>
                  <span className="text-brand-accent font-mono block text-[10px]">{c.investigator_id}</span>
                </div>

                <button
                  onClick={() => onOpenCase(c.case_id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  <span>Open Workspace</span>
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
