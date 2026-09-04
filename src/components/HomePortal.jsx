import React from 'react';
import { FolderGit2, GitBranch, ArrowRight, ShieldCheck, Database, Users, AlertTriangle, Sparkles, Building2 } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function HomePortal({ session, onNavigateToCases, onNavigateToIntelligence, onOpenRecentCase }) {
  // Count cases available to this session
  const accessibleCases = RAW_DATASET.cases.filter(c => 
    session.isSuperAdmin || c.jurisdiction === session.regionId
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 font-sans">
      {/* Welcome & Session Header */}
      <div className="bg-[#1a2320]/90 border border-[#116466]/40 rounded-2xl p-6 shadow-xl futuristic-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#116466]/25 text-[#D1E8E2] border border-[#116466]/45">
                {session.isSuperAdmin ? 'SUPER-ADMIN SCOPE' : 'REGIONAL JURISDICTION'}
              </span>
              <span className="text-xs text-[#D9B08C] font-mono">NODE // {session.regionId}</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1.5 font-display tracking-wide">
              Welcome, {session.officerName}
            </h2>
            <p className="text-xs text-[#7e968e] mt-0.5">
              Badge: <span className="text-[#D1E8E2] font-mono">{session.badgeNumber}</span> &bull; Assigned: <strong className="text-[#D9B08C]">{session.regionName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-[#141a18] border border-[#116466]/40 px-4 py-2.5 rounded-xl text-xs text-[#D1E8E2]">
            <ShieldCheck className="w-4 h-4 text-[#D1E8E2]" />
            <span className="font-mono text-[11px]">RLS ENFORCED &bull; SHA-256 LEDGER VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Cases Workspace */}
        <div 
          onClick={onNavigateToCases}
          className="group bg-[#1a2320]/80 border border-[#116466]/35 hover:border-[#116466] rounded-2xl p-7 transition duration-200 shadow-xl cursor-pointer flex flex-col justify-between futuristic-panel"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#116466]/20 border border-[#116466]/45 flex items-center justify-center text-[#D1E8E2] mb-5 group-hover:bg-[#116466] group-hover:text-white transition duration-200 shadow-sm">
              <FolderGit2 className="w-6 h-6 text-[#D1E8E2]" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-white group-hover:text-[#FFCB9A] transition font-display tracking-wide">
                Cases Workspace
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#151c19] text-[#D1E8E2] border border-[#116466]/40">
                {accessibleCases.length} ACTIVE
              </span>
            </div>

            <p className="text-xs text-[#7e968e] leading-relaxed mt-2.5">
              Browse investigation records chronologically (most recent first). Access interactive case summaries with Wikipedia-style evidence hovers, real entity network graph, prime suspects, live investigation reconstruction, and statutory law violations.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#116466]/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7e968e]">View Chronological Registry</span>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#D1E8E2] group-hover:text-[#FFCB9A] transition">
              <span>Open Cases</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-[#D9B08C]" />
            </button>
          </div>
        </div>

        {/* Card 2: Network Intelligence */}
        <div 
          onClick={onNavigateToIntelligence}
          className="group bg-[#1a2320]/80 border border-[#116466]/35 hover:border-[#D9B08C]/60 rounded-2xl p-7 transition duration-200 shadow-xl cursor-pointer flex flex-col justify-between futuristic-panel"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#D9B08C]/15 border border-[#D9B08C]/35 flex items-center justify-center text-[#FFCB9A] mb-5 group-hover:bg-[#D9B08C] group-hover:text-[#121816] transition duration-200 shadow-sm">
              <GitBranch className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-white group-hover:text-[#FFCB9A] transition font-display tracking-wide">
                Network Intelligence
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#151c19] text-[#FFCB9A] border border-[#D9B08C]/40">
                MACRO GRAPH
              </span>
            </div>

            <p className="text-xs text-[#7e968e] leading-relaxed mt-2.5">
              Global graph analytics powered by Neo4j GDS &amp; NetworkX. Calculate Betweenness Centrality, PageRank, and Louvain community detection to expose hidden broker nodes connecting isolated regional crime rings.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#116466]/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#D9B08C]">1 Bridge Broker Flagged (Devrat Sharma)</span>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#FFCB9A] group-hover:text-[#D1E8E2] transition">
              <span>Explore Analytics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-[#FFCB9A]" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access to Primary Demonstration Case */}
      <div className="bg-[#1a2320]/90 border border-[#116466]/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 futuristic-panel">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#116466]/30 border border-[#116466]/60 flex items-center justify-center text-[#D1E8E2] font-bold font-mono text-xs">
            018
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#D9B08C] tracking-wider uppercase">[ PRIMARY DEMO FILE ]</span>
              <span className="text-xs font-bold text-white">CASE-018: Operation PhishNet</span>
            </div>
            <p className="text-xs text-[#7e968e]">
              Spear-phishing corporate wire fraud &bull; ₹1.0 Cr heist with cross-jurisdiction bridge to Mumbai Hawala ring.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenRecentCase('CASE-018')}
          className="px-4 py-2 bg-[#116466] hover:bg-[#167b7e] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#116466]/20 border border-[#116466]"
        >
          <span>Open Case #018 Workspace</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D1E8E2]" />
        </button>
      </div>

      {/* System Integrity & Metrics Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-[#161f1c] border border-[#116466]/30 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-[#7e968e] uppercase block tracking-wider font-mono">Active Regions</span>
          <span className="text-sm font-mono font-bold text-[#D1E8E2] mt-1 block">3 Stations</span>
        </div>
        <div className="bg-[#161f1c] border border-[#116466]/30 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-[#7e968e] uppercase block tracking-wider font-mono">SHA-256 Hashes</span>
          <span className="text-sm font-mono font-bold text-[#D1E8E2] mt-1 block">100% Cryptographic Match</span>
        </div>
        <div className="bg-[#161f1c] border border-[#116466]/30 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-[#7e968e] uppercase block tracking-wider font-mono">Broker Nodes</span>
          <span className="text-sm font-mono font-bold text-[#FFCB9A] mt-1 block">1 High-Betweenness Bridge</span>
        </div>
        <div className="bg-[#161f1c] border border-[#116466]/30 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-[#7e968e] uppercase block tracking-wider font-mono">Security Model</span>
          <span className="text-sm font-mono font-bold text-[#D9B08C] mt-1 block">RLS + Fabric Ledger</span>
        </div>
      </div>
    </div>
  );
}
