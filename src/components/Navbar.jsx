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
    <header className="sticky top-0 z-40 bg-[#131A26] border-b border-[#222D3F]">
      {/* Top Header Row */}
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-[#1A2332] border border-[#222D3F] flex items-center justify-center text-[#D4A359]">
            <Shield className="w-5 h-5 text-[#D4A359]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif font-bold text-[#F1F5F9] tracking-tight">
                CrimeNexus
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[3px] bg-[#1A2332] text-[#94A3B8] border border-[#222D3F]">
                SIH26189 ARCHIVE
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-sans">
              Forensic Criminal Network Intelligence Platform
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID, Person (e.g. Devrat), Phone, Account, Vehicle or IP..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#0B0F17] border border-[#222D3F] rounded-[6px] text-xs text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#D4A359] transition font-sans"
          />
        </div>

        {/* Regional Access Control Selector */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#0B0F17] border border-[#222D3F] rounded-[6px] px-2 py-1">
            <Lock className="w-3 h-3 text-[#D4A359]" />
            <span className="text-[11px] text-[#64748B] font-mono">RLS:</span>
            <select
              value={currentRegion}
              onChange={(e) => setCurrentRegion(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#F1F5F9] focus:outline-none cursor-pointer"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#131A26] text-[#F1F5F9]">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] text-xs font-semibold transition shadow-none cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Evidence
          </button>

          <button
            onClick={onOpenIntegrityModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#1A2332] hover:bg-[#1D2738] border border-[#222D3F] text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition cursor-pointer"
            title="Verify SHA-256 Blockchain Integrity"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="font-mono text-[11px]">SHA-256 Audit</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#0B0F17] border-t border-[#222D3F] px-4">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] transition whitespace-nowrap text-xs cursor-pointer ${
                  isActive
                    ? 'bg-[#D4A359] text-[#0B0F17] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1A2332]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0B0F17]' : 'text-[#64748B]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-[#0B0F17] text-[#D4A359]' : 'bg-[#E05252]/20 text-[#E05252] border border-[#E05252]/35'
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
