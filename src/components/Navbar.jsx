import React from 'react';
import { Shield, Search, Upload, Lock, ShieldCheck, Database, GitBranch, Cpu, AlertTriangle, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function Navbar({ 
  currentRegion, 
  setCurrentRegion, 
  activeTab, 
  setActiveTab, 
  onOpenUpload, 
  searchQuery, 
  setSearchQuery,
  onOpenIntegrityModal
}) {
  const regions = [
    { id: "REG-NCR", name: "Region A (NCR / Gurugram)", badge: "Active Jurisdiction" },
    { id: "REG-MUM", name: "Region B (Mumbai HQ)", badge: "Active Jurisdiction" },
    { id: "REG-BLR", name: "Region C (Bengaluru Cyber)", badge: "Read-Only / Isolation" },
    { id: "ALL-REGIONS", name: "Super-Admin (Cross-Regional)", badge: "Full Audit Scope" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#181C24] border-b border-[#2B313D]">
      {/* Top Header Row */}
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[5px] bg-[#1F2430] border border-[#2B313D] flex items-center justify-center text-[#C68A46]">
            <Shield className="w-5 h-5 text-[#C68A46]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif font-bold text-[#E8EAEE] tracking-tight">
                CrimeNexus
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[3px] bg-[#1F2430] text-[#787167] border border-[#2B313D]">
                SIH26189 ARCHIVE
              </span>
            </div>
            <p className="text-[11px] text-[#787167] font-sans">
              Forensic Criminal Network Intelligence Platform
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#787167]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID, Person (e.g. Devrat), Phone, Account, Vehicle or IP..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#12151B] border border-[#2B313D] rounded-[5px] text-xs text-[#E8EAEE] placeholder-[#787167] focus:outline-none focus:border-[#C68A46] transition font-sans"
          />
        </div>

        {/* Regional Access Control Selector */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#12151B] border border-[#2B313D] rounded-[5px] px-2 py-1">
            <Lock className="w-3 h-3 text-[#C68A46]" />
            <span className="text-[11px] text-[#787167] font-mono">RLS:</span>
            <select
              value={currentRegion}
              onChange={(e) => setCurrentRegion(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#E8EAEE] focus:outline-none cursor-pointer"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#181C24] text-[#E8EAEE]">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#C68A46] hover:bg-[#D49855] text-[#12151B] text-xs font-semibold transition"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Evidence
          </button>

          <button
            onClick={onOpenIntegrityModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#1F2430] hover:bg-[#282F3F] border border-[#2B313D] text-xs font-medium text-[#9AA3B2] hover:text-[#E8EAEE] transition"
            title="Verify SHA-256 Blockchain Integrity"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5FA876]" />
            <span className="font-mono text-[11px]">SHA-256 Audit</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#12151B] border-t border-[#2B313D] px-4">
        <div className="max-w-[1700px] mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs font-medium">
          {[
            { id: 'cases', label: '1. Cases Workspace', icon: Database },
            { id: 'reconstruction', label: '2. Live Reconstruction', icon: Cpu, badge: 'NARRATED' },
            { id: 'graph', label: '3. Criminal Knowledge Graph', icon: GitBranch },
            { id: 'copilot', label: '4. AI Copilot Q&A', icon: HelpCircle },
            { id: 'gaps', label: '5. Gaps & Contradictions', icon: AlertTriangle },
            { id: 'similar', label: '6. Similar Cases / M.O.', icon: Search },
            { id: 'intelligence', label: '7. Network Intelligence', icon: Cpu },
            { id: 'integrity', label: '8. Evidence & Blockchain Audit', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] transition whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-[#C68A46] text-[#12151B] font-semibold'
                    : 'text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#1F2430]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#12151B]' : 'text-[#787167]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-[#12151B] text-[#C68A46]' : 'bg-[#8B2626] text-[#F4EFE6]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
