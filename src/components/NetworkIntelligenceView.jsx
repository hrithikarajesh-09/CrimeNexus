import React from 'react';
import { GitBranch, ArrowRight, AlertTriangle } from 'lucide-react';

export default function NetworkIntelligenceView({ onSelectEntity, onAskCopilot }) {
  const analytics = [
    {
      person_id: "PER-103",
      name: "Devrat Sharma",
      betweenness: "0.892 (Rank #1)",
      pagerank: "0.142 (Rank #1)",
      degree: "14 Connections",
      community: "Community 1 & 2 Bridge",
      assessment: "Exhibits high network-brokerage characteristics bridging isolated clusters; primary bridge between Delhi & Mumbai rings.",
      status_badge: "Key Bridge Broker Node",
      badge_color: "text-brand-amber border-brand-amber/40 bg-brand-amber/10"
    },
    {
      person_id: "PER-101",
      name: "Rajesh Verma",
      betweenness: "0.614 (Rank #2)",
      pagerank: "0.098 (Rank #2)",
      degree: "9 Connections",
      community: "NCR Phishing Syndicate",
      assessment: "Central technical command node within NCR Cluster; multiple inbound telephony and device associations.",
      status_badge: "Syndicate Operator",
      badge_color: "text-brand-rose border-brand-rose/40 bg-brand-rose/10"
    },
    {
      person_id: "PER-105",
      name: "Tariq Merchant",
      betweenness: "0.588 (Rank #3)",
      pagerank: "0.091 (Rank #3)",
      degree: "8 Connections",
      community: "Mumbai Hawala Ring",
      assessment: "Primary liquidity routing node in Western region; coordinates bullion clearing transactions.",
      status_badge: "Hawala Clearing Node",
      badge_color: "text-brand-rose border-brand-rose/40 bg-brand-rose/10"
    },
    {
      person_id: "PER-107",
      name: "Anita D'Souza",
      betweenness: "0.412 (Rank #4)",
      pagerank: "0.064 (Rank #5)",
      degree: "6 Connections",
      community: "Mumbai Hawala Ring",
      assessment: "Director of corporate front company (Apex Trade Solutions); high transactional velocity.",
      status_badge: "Shell Company Director",
      badge_color: "text-slate-300 border-white/20 bg-white/5"
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="panel rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
                GRAPH ANALYTICS
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">Graph Centrality &amp; Community Analytics</h2>
            </div>
            <p className="text-xs text-brand-slate mt-1 max-w-2xl leading-relaxed">
              Powered by Neo4j Graph Data Science (GDS) &amp; NetworkX. Computes Betweenness Centrality, PageRank, Degree Centrality, and Louvain Community Detection across multi-jurisdiction criminal networks.
            </p>
          </div>

          <div className="bg-dark-bg border border-dark-border px-3 py-1.5 rounded-lg text-xs text-brand-slate flex items-center gap-2 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-brand-amber" />
            <span><strong className="text-white">Neutrality Protocol:</strong> Evidence-neutral analytical terminology enforced.</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.map((item) => (
          <div key={item.person_id} className="panel rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-dark-bg text-brand-accent border border-dark-border">
                  {item.person_id}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{item.name}</h3>
              </div>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${item.badge_color}`}>
                {item.status_badge}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-dark-bg p-2.5 rounded-lg border border-dark-border">
                <span className="text-[10px] text-dark-slate block font-medium">Betweenness</span>
                <span className="font-mono font-bold text-brand-amber text-xs">{item.betweenness}</span>
              </div>
              <div className="bg-dark-bg p-2.5 rounded-lg border border-dark-border">
                <span className="text-[10px] text-dark-slate block font-medium">PageRank</span>
                <span className="font-mono font-bold text-slate-200 text-xs">{item.pagerank}</span>
              </div>
              <div className="bg-dark-bg p-2.5 rounded-lg border border-dark-border">
                <span className="text-[10px] text-dark-slate block font-medium">Connectivity</span>
                <span className="font-mono font-bold text-brand-accent text-xs">{item.degree}</span>
              </div>
            </div>

            <p className="text-xs text-brand-slate leading-relaxed bg-dark-bg p-3 rounded-lg border border-dark-border">
              "{item.assessment}"
            </p>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs text-dark-slate">Cluster: <strong className="text-slate-300">{item.community}</strong></span>
              <button
                onClick={() => onSelectEntity({ person_id: item.person_id, name: item.name, role: item.status_badge, is_bridge: item.person_id === 'PER-103' })}
                className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1"
              >
                <span>Inspect Entity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
