import React from 'react';
import { FolderGit2, GitBranch, ArrowRight, ShieldCheck, Database, Users, AlertTriangle, Sparkles, Building2 } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function HomePortal({ session, onNavigateToCases, onNavigateToIntelligence, onOpenRecentCase }) {
  const accessibleCases = RAW_DATASET.cases.filter(c => 
    session.isSuperAdmin || c.jurisdiction === session.regionId
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 font-sans">
      {/* Welcome & Session Header */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/30 rounded-3xl p-7 shadow-2xl ethereal-glass">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
                {session.isSuperAdmin ? 'SUPER-ADMIN ACCESS' : 'REGIONAL JURISDICTION'}
              </span>
              <span className="text-xs text-[#84CEEB] font-mono">NODE // {session.regionId}</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 font-display tracking-wide">
              Welcome, {session.officerName}
            </h2>
            <p className="text-xs text-[#8e9cc2] mt-0.5">
              Badge: <span className="text-[#84CEEB] font-mono">{session.badgeNumber}</span> &bull; Jurisdiction: <strong className="text-white">{session.regionName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-[#080c18] border border-[#5680E9]/30 px-4 py-2.5 rounded-2xl text-xs text-[#C1C8E4]">
            <ShieldCheck className="w-4 h-4 text-[#84CEEB]" />
            <span className="font-mono text-[11px]">RLS ACTIVE &bull; SHA-256 VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Cases Workspace */}
        <div 
          onClick={onNavigateToCases}
          className="group bg-[#0f1629]/80 border border-[#5680E9]/25 hover:border-[#5680E9] rounded-3xl p-8 transition duration-200 shadow-2xl cursor-pointer flex flex-col justify-between ethereal-glass"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5680E9]/20 to-[#8860D0]/20 border border-[#5680E9]/40 flex items-center justify-center text-[#84CEEB] mb-6 group-hover:bg-[#5680E9] group-hover:text-white transition duration-200 shadow-md">
              <FolderGit2 className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xl font-bold text-white group-hover:text-[#84CEEB] transition font-display tracking-wide">
                Cases Workspace
              </h3>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#080c18] text-[#84CEEB] border border-[#5680E9]/30">
                {accessibleCases.length} ACTIVE
              </span>
            </div>

            <p className="text-xs text-[#8e9cc2] leading-relaxed mt-2">
              Browse investigations in strict chronological order (most recent first). Access point-wise case narratives, real interconnected network graphs, structured suspect tables, and documentary live video reconstructions.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#5680E9]/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8e9cc2]">View Chronological Registry</span>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#84CEEB] group-hover:text-white transition">
              <span>Open Cases</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>

        {/* Card 2: Network Intelligence */}
        <div 
          onClick={onNavigateToIntelligence}
          className="group bg-[#0f1629]/80 border border-[#5680E9]/25 hover:border-[#8860D0] rounded-3xl p-8 transition duration-200 shadow-2xl cursor-pointer flex flex-col justify-between ethereal-glass"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8860D0]/20 to-[#5680E9]/20 border border-[#8860D0]/40 flex items-center justify-center text-[#8860D0] mb-6 group-hover:bg-[#8860D0] group-hover:text-white transition duration-200 shadow-md">
              <GitBranch className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xl font-bold text-white group-hover:text-[#8860D0] transition font-display tracking-wide">
                Network Intelligence
              </h3>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#080c18] text-[#8860D0] border border-[#8860D0]/30">
                MACRO GRAPH
              </span>
            </div>

            <p className="text-xs text-[#8e9cc2] leading-relaxed mt-2">
              Global graph analytics powered by Neo4j GDS &amp; NetworkX. Calculate Betweenness Centrality, PageRank, and Louvain community detection to expose hidden broker nodes connecting isolated regional crime syndicates.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#5680E9]/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8860D0]">1 Bridge Broker Flagged (Devrat Sharma)</span>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#8860D0] group-hover:text-white transition">
              <span>Explore Analytics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access to Primary Demonstration Case */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/35 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 ethereal-glass">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5680E9]/20 border border-[#5680E9]/40 flex items-center justify-center text-[#84CEEB] font-black font-mono text-sm shadow-md">
            018
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#84CEEB] tracking-wider uppercase">[ PRIMARY DEMO FILE ]</span>
              <span className="text-sm font-bold text-white">CASE-018: Operation PhishNet</span>
            </div>
            <p className="text-xs text-[#8e9cc2] mt-0.5">
              Spear-phishing corporate wire fraud &bull; ₹1.0 Cr heist with cross-jurisdiction bridge to Mumbai Hawala ring.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenRecentCase('CASE-018')}
          className="px-5 py-2.5 bg-gradient-to-r from-[#5680E9] to-[#8860D0] hover:opacity-95 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#5680E9]/20"
        >
          <span>Open Case #018 Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* System Integrity & Metrics Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-[#0f1629]/70 border border-[#5680E9]/25 p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-[#8e9cc2] uppercase block tracking-wider font-mono">Active Regions</span>
          <span className="text-sm font-mono font-bold text-white mt-1 block">3 Stations</span>
        </div>
        <div className="bg-[#0f1629]/70 border border-[#5680E9]/25 p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-[#8e9cc2] uppercase block tracking-wider font-mono">SHA-256 Hashes</span>
          <span className="text-sm font-mono font-bold text-[#84CEEB] mt-1 block">100% Verified</span>
        </div>
        <div className="bg-[#0f1629]/70 border border-[#5680E9]/25 p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-[#8e9cc2] uppercase block tracking-wider font-mono">Broker Nodes</span>
          <span className="text-sm font-mono font-bold text-[#8860D0] mt-1 block">1 Key Bridge Identified</span>
        </div>
        <div className="bg-[#0f1629]/70 border border-[#5680E9]/25 p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-[#8e9cc2] uppercase block tracking-wider font-mono">Security Model</span>
          <span className="text-sm font-mono font-bold text-[#5AB9EA] mt-1 block">RLS + Fabric Ledger</span>
        </div>
      </div>
    </div>
  );
}
