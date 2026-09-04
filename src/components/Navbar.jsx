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
    { id: "REG-NCR", name: "Region A (NCR / Gurugram)", badge: "Active Jurisdiction", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { id: "REG-MUM", name: "Region B (Mumbai HQ)", badge: "Active Jurisdiction", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    { id: "REG-BLR", name: "Region C (Bengaluru Cyber)", badge: "Read-Only / Isolation", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { id: "ALL-REGIONS", name: "Super-Admin (Cross-Regional)", badge: "Full Audit Scope", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d1322]/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Header Row */}
      <div className="max-w-[1700px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CrimeNexus
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                SIH26189 PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI-Powered Criminal Network Analysis System &bull; <span className="text-slate-300">Where Every Clue Connects</span>
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID, Person (e.g. Devrat), Phone, Account, Vehicle or IP..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
        </div>

        {/* Regional Access Control Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
            <Lock className="w-3.5 h-3.5 text-cyan-400 ml-2" />
            <span className="text-xs text-slate-400 font-medium mr-1">Region RLS:</span>
            <select
              value={currentRegion}
              onChange={(e) => setCurrentRegion(e.target.value)}
              className="bg-slate-800 text-xs font-semibold text-slate-200 rounded px-2 py-1 focus:outline-none cursor-pointer border border-slate-700"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Evidence Data
          </button>

          <button
            onClick={onOpenIntegrityModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition"
            title="Verify SHA-256 Blockchain Integrity"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SHA-256 Integrity</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#0b0f19]/90 border-t border-slate-800/80 px-4">
        <div className="max-w-[1700px] mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs font-medium">
          {[
            { id: 'cases', label: '1. Cases Workspace', icon: Database },
            { id: 'reconstruction', label: '2. AI Reconstruction (Signature)', icon: Cpu, badge: 'FEATURE' },
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
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
