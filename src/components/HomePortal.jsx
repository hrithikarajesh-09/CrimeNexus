import React from 'react';
import { FolderGit2, GitBranch, ArrowRight, ShieldCheck } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function HomePortal({ session, onNavigateToCases, onNavigateToIntelligence, onOpenRecentCase }) {
  const accessibleCases = RAW_DATASET.cases.filter(c => 
    session.isSuperAdmin || c.jurisdiction === session.regionId
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 font-sans">
      {/* Welcome & Session Header */}
      <div className="panel rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
              {session.isSuperAdmin ? 'SUPER-ADMIN SCOPE' : session.regionId}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2 tracking-tight">
            Welcome, {session.officerName}
          </h2>
          <p className="text-xs text-dark-slate mt-0.5">
            Badge: <span className="text-brand-accent font-mono">{session.badgeNumber}</span> &bull; Jurisdiction: <strong className="text-white">{session.regionName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-dark-bg border border-dark-border px-3 py-1.5 rounded-lg text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-[11px] text-brand-slate">RLS Active &bull; SHA-256 Verified</span>
        </div>
      </div>

      {/* Primary Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Cases Workspace */}
        <div 
          onClick={onNavigateToCases}
          className="panel panel-hover rounded-xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-primary mb-4">
              <FolderGit2 className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white">
                Cases Workspace
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-dark-bg text-brand-accent border border-dark-border">
                {accessibleCases.length} Active
              </span>
            </div>

            <p className="text-xs text-brand-slate leading-relaxed mt-2">
              Browse investigations in chronological order. Access unboxed case narratives, clean entity knowledge graphs, structured suspect tables, and documentary live video reconstructions.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-dark-border flex items-center justify-between">
            <span className="text-xs text-dark-slate font-medium">Chronological Registry</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-brand-accent">
              <span>Open Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 2: Network Intelligence */}
        <div 
          onClick={onNavigateToIntelligence}
          className="panel panel-hover rounded-xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center text-brand-amber mb-4">
              <GitBranch className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white">
                Network Intelligence
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-dark-bg text-brand-amber border border-dark-border">
                Macro Graph
              </span>
            </div>

            <p className="text-xs text-brand-slate leading-relaxed mt-2">
              Global graph analytics powered by Neo4j GDS &amp; NetworkX. Inspect Betweenness Centrality, PageRank, and Louvain community detection to expose broker nodes connecting isolated regional syndicates.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-dark-border flex items-center justify-between">
            <span className="text-xs text-brand-amber font-medium">1 Key Bridge Broker Flagged</span>
            <div className="flex items-center gap-1 text-xs font-semibold text-brand-amber">
              <span>Inspect Centrality</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access to Primary Demonstration Case */}
      <div className="panel rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-white font-mono font-bold text-xs">
            018
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-brand-accent uppercase">PRIMARY DEMO</span>
              <span className="text-sm font-semibold text-white">CASE-018: Operation PhishNet</span>
            </div>
            <p className="text-xs text-dark-slate mt-0.5">
              Spear-phishing wire fraud &bull; ₹1.0 Cr heist with cross-jurisdiction bridge to Mumbai Hawala syndicate.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenRecentCase('CASE-018')}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
        >
          <span>Open Case #018</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* System Integrity & Metrics Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="panel rounded-lg p-3">
          <span className="text-[11px] text-dark-slate block font-medium">Active Jurisdictions</span>
          <span className="text-sm font-mono font-bold text-white mt-0.5 block">3 Stations</span>
        </div>
        <div className="panel rounded-lg p-3">
          <span className="text-[11px] text-dark-slate block font-medium">Evidence Cryptography</span>
          <span className="text-sm font-mono font-bold text-emerald-400 mt-0.5 block">100% Verified</span>
        </div>
        <div className="panel rounded-lg p-3">
          <span className="text-[11px] text-dark-slate block font-medium">Bridge Broker Node</span>
          <span className="text-sm font-mono font-bold text-brand-amber mt-0.5 block">PER-103 (Devrat)</span>
        </div>
        <div className="panel rounded-lg p-3">
          <span className="text-[11px] text-dark-slate block font-medium">Security Standard</span>
          <span className="text-sm font-mono font-bold text-brand-accent mt-0.5 block">Sec 63B BSA Ready</span>
        </div>
      </div>
    </div>
  );
}
