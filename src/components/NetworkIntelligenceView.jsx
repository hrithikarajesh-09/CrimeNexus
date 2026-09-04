import React from 'react';
import { Cpu, ShieldCheck, Activity, Users, GitBranch, ArrowRight, BarChart3, AlertTriangle } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function NetworkIntelligenceView({ onSelectEntity, onAskCopilot }) {
  const analytics = [
    {
      person_id: "PER-103",
      name: "Devrat Sharma",
      betweenness: "0.892 (Rank #1)",
      pagerank: "0.142 (Rank #1)",
      degree: "14 Connections",
      community: "Community 1 & 2 Bridge",
      assessment: "Exhibits high network-brokerage characteristics bridging isolated clusters; may warrant further investigative review.",
      status_badge: "Key Bridge Broker Node",
      badge_color: "bg-red-500/20 text-red-300 border-red-500/40"
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
      badge_color: "bg-orange-500/20 text-orange-300 border-orange-500/40"
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
      badge_color: "bg-purple-500/20 text-purple-300 border-purple-500/40"
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
      badge_color: "bg-blue-500/20 text-blue-300 border-blue-500/40"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                SECTION 10 &bull; NETWORK INTELLIGENCE & GRAPH ANALYTICS
              </span>
              <h2 className="text-xl font-bold text-white">Graph Centrality & Community Analytics</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Powered by Neo4j Graph Data Science (GDS) & NetworkX. Computes Betweenness Centrality, PageRank, Degree Centrality, and Louvain Community Detection.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span><strong>Neutrality Protocol:</strong> Uses evidence-neutral analytical terminology.</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analytics.map((item) => (
          <div key={item.person_id} className="bg-[#131b2e] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-600/20 text-cyan-300 border border-blue-500/30">
                  {item.person_id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{item.name}</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badge_color}`}>
                {item.status_badge}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Betweenness Centrality</span>
                <span className="font-mono font-bold text-cyan-300 text-sm">{item.betweenness}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">PageRank Score</span>
                <span className="font-mono font-bold text-emerald-300 text-sm">{item.pagerank}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Degree Count</span>
                <span className="font-mono font-bold text-purple-300 text-sm">{item.degree}</span>
              </div>
            </div>

            {/* Neutral Assessment */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-slate-400 block">Analytical Finding:</span>
              <p className="leading-relaxed font-mono text-[11px] text-cyan-200">"{item.assessment}"</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Detected Cluster: <strong className="text-slate-200">{item.community}</strong></span>
              <button
                onClick={() => onAskCopilot(`Explain graph centrality for ${item.name} (${item.person_id})`)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                Inspect Centrality <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
