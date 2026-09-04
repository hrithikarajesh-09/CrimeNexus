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
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {session.isSuperAdmin ? 'SUPER-ADMIN ACCESS' : 'REGIONAL JURISDICTION'}
              </span>
              <span className="text-xs text-slate-400 font-mono">CODE: {session.regionId}</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Welcome, {session.officerName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Badge: <span className="text-slate-300 font-mono">{session.badgeNumber}</span> &bull; Jurisdiction: <strong className="text-slate-200">{session.regionName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>RLS Active &bull; Evidence Hashes Verified (SHA-256)</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Cases Workspace */}
        <div 
          onClick={onNavigateToCases}
          className="group bg-[#0f1422] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-7 transition duration-200 shadow-xl cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-600 group-hover:text-white transition duration-200 shadow-sm">
              <FolderGit2 className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition">
                Cases Workspace
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">
                {accessibleCases.length} ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Browse investigation files in chronological order (most recent first). Open any case to inspect the interactive summary with Wikipedia-style evidence hovers, real entity network map, prime suspects, live investigation reconstruction, and statutory law violations.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">View Chronological Cases</span>
            <button className="flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300 transition">
              <span>Open Cases</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>

        {/* Card 2: Network Intelligence */}
        <div 
          onClick={onNavigateToIntelligence}
          className="group bg-[#0f1422] border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-7 transition duration-200 shadow-xl cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-600 group-hover:text-white transition duration-200 shadow-sm">
              <GitBranch className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                Network Intelligence
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                MACRO GRAPH
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Global graph analytics powered by Neo4j GDS & NetworkX. Inspect Betweenness Centrality, PageRank, and Louvain community clusters to automatically discover hidden broker nodes connecting otherwise disconnected regional syndicates.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">1 Bridge Broker Flagged (Devrat Sharma)</span>
            <button className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition">
              <span>Explore Analytics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access to Primary Demonstration Case */}
      <div className="bg-[#0f1422] border border-slate-800/90 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400 font-bold font-mono text-xs">
            018
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-blue-400">PRIMARY DEMO CASE</span>
              <span className="text-xs font-bold text-white">CASE-018: Operation PhishNet</span>
            </div>
            <p className="text-xs text-slate-400">
              Corporate spear-phishing heist &bull; ₹1.0 Cr wire fraud with cross-case bridge to Mumbai Hawala Ring.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenRecentCase('CASE-018')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
        >
          <span>Open Case #018 Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* System Integrity & Metrics Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Active Jurisdictions</span>
          <span className="text-sm font-mono font-bold text-white mt-1 block">3 Regions</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">SHA-256 Evidence</span>
          <span className="text-sm font-mono font-bold text-emerald-400 mt-1 block">100% Cryptographic Match</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Identified Brokers</span>
          <span className="text-sm font-mono font-bold text-red-400 mt-1 block">1 High-Betweenness Node</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Security Architecture</span>
          <span className="text-sm font-mono font-bold text-blue-400 mt-1 block">RLS + Fabric Ledger</span>
        </div>
      </div>
    </div>
  );
}
