import React from 'react';
import { FolderGit2, GitBranch, ArrowRight, ShieldCheck } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function HomePortal({ session, onNavigateToCases, onNavigateToIntelligence, onOpenRecentCase }) {
  const accessibleCases = RAW_DATASET.cases.filter(c => 
    session.isSuperAdmin || c.jurisdiction === session.regionId
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-5 font-sans">
      {/* Welcome & Session Header */}
      <div className="dossier-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#1F2430] text-[#C68A46] border border-[#2B313D]">
              {session.isSuperAdmin ? 'SUPER-ADMIN SCOPE' : session.regionId}
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#E8EAEE] mt-2 tracking-tight">
            Welcome, {session.officerName}
          </h2>
          <p className="text-xs text-[#6B7382] mt-0.5">
            Badge: <span className="text-[#C68A46] font-mono">{session.badgeNumber}</span> &bull; Jurisdiction: <strong className="text-[#E8EAEE]">{session.regionName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1F2430] border border-[#2B313D] px-3 py-1.5 rounded-[5px] text-xs">
          <ShieldCheck className="w-4 h-4 text-[#5FA876]" />
          <span className="font-mono text-[11px] text-[#9AA3B2]">RLS Active &bull; SHA-256 Ledger Verified</span>
        </div>
      </div>

      {/* Primary Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Cases Workspace */}
        <div 
          onClick={onNavigateToCases}
          className="dossier-card dossier-card-hover p-5 transition duration-150 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-[5px] bg-[#1F2430] border border-[#2B313D] flex items-center justify-center text-[#C68A46] mb-3.5">
              <FolderGit2 className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-serif font-bold text-[#E8EAEE]">
                Cases Workspace
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#1F2430] text-[#C68A46] border border-[#2B313D]">
                {accessibleCases.length} Active
              </span>
            </div>

            <p className="text-xs text-[#9AA3B2] leading-relaxed mt-2">
              Chronological case registry (most recent first). Access unboxed case briefings, topological entity graphs, suspect tables, and live documentary reconstructions.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#2B313D] flex items-center justify-between">
            <span className="text-xs text-[#6B7382] font-mono">Registry Index</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#C68A46]">
              <span>Open Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 2: Network Intelligence */}
        <div 
          onClick={onNavigateToIntelligence}
          className="dossier-card dossier-card-hover p-5 transition duration-150 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-[5px] bg-[#1F2430] border border-[#2B313D] flex items-center justify-center text-[#8B81C4] mb-3.5">
              <GitBranch className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-serif font-bold text-[#E8EAEE]">
                Network Intelligence
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#1F2430] text-[#8B81C4] border border-[#2B313D]">
                Macro Graph
              </span>
            </div>

            <p className="text-xs text-[#9AA3B2] leading-relaxed mt-2">
              Cross-case graph analytics powered by Neo4j GDS &amp; NetworkX. Calculate Betweenness Centrality, PageRank, and Louvain community detection to expose bridge broker nodes.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#2B313D] flex items-center justify-between">
            <span className="text-xs text-[#8B81C4] font-medium">1 Bridge Broker Identified</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#8B81C4]">
              <span>Inspect Centrality</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access to Primary Demonstration Case */}
      <div className="dossier-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[5px] bg-[#1F2430] border border-[#2B313D] flex items-center justify-center text-[#E8EAEE] font-mono font-bold text-xs">
            018
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-[#C68A46] uppercase">PRIMARY DOSSIER</span>
              <span className="text-sm font-semibold text-[#E8EAEE]">CASE-018: Operation PhishNet</span>
            </div>
            <p className="text-xs text-[#6B7382] mt-0.5">
              Spear-phishing wire fraud &bull; ₹1.0 Cr RTGS heist linking to Mumbai Hawala ring via Devrat Sharma (TXN_552).
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenRecentCase('CASE-018')}
          className="px-3.5 py-1.5 bg-[#C68A46] hover:bg-[#D49855] text-[#12151B] rounded-[5px] text-xs font-semibold transition flex items-center gap-1.5"
        >
          <span>Open Case #018</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* System Integrity & Metrics Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="dossier-card p-3">
          <span className="text-[11px] text-[#6B7382] block font-mono">REGIONAL STATIONS</span>
          <span className="text-sm font-mono font-bold text-[#E8EAEE] mt-0.5 block">3 Stations</span>
        </div>
        <div className="dossier-card p-3">
          <span className="text-[11px] text-[#6B7382] block font-mono">HASH INTEGRITY</span>
          <span className="text-sm font-mono font-bold text-[#5FA876] mt-0.5 block">100% Verified</span>
        </div>
        <div className="dossier-card p-3">
          <span className="text-[11px] text-[#6B7382] block font-mono">BRIDGE BROKER NODE</span>
          <span className="text-sm font-mono font-bold text-[#8B81C4] mt-0.5 block">PER-103 (Devrat)</span>
        </div>
        <div className="dossier-card p-3">
          <span className="text-[11px] text-[#6B7382] block font-mono">EVIDENTIARY STATUTE</span>
          <span className="text-sm font-mono font-bold text-[#C68A46] mt-0.5 block">Sec 63B BSA Compliant</span>
        </div>
      </div>
    </div>
  );
}
