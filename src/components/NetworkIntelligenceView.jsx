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
      badge_color: "bg-[#2C3531] text-[#FFCB9A] border-[#FFCB9A]/50 font-bold"
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
      badge_color: "bg-[#116466]/20 text-[#D1E8E2] border-[#116466]/40"
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
      badge_color: "bg-[#D9B08C]/15 text-[#D9B08C] border-[#D9B08C]/35"
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
      badge_color: "bg-[#116466]/20 text-[#D1E8E2] border-[#116466]/40"
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-[#1a2320]/90 border border-[#116466]/40 rounded-2xl p-6 shadow-xl futuristic-panel">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#116466]/25 text-[#D1E8E2] border border-[#116466]/45">
                NETWORK INTELLIGENCE &amp; GRAPH ANALYTICS
              </span>
              <h2 className="text-xl font-bold text-white font-display tracking-wide">Graph Centrality &amp; Community Analytics</h2>
            </div>
            <p className="text-xs text-[#7e968e] mt-1">
              Powered by Neo4j Graph Data Science (GDS) &amp; NetworkX. Computes Betweenness Centrality, PageRank, Degree Centrality, and Louvain Community Detection.
            </p>
          </div>

          <div className="bg-[#141a18] border border-[#D9B08C]/40 px-3.5 py-2 rounded-xl text-xs text-[#FFCB9A] flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-[#FFCB9A]" />
            <span><strong>Neutrality Protocol:</strong> Uses evidence-neutral analytical terminology.</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analytics.map((item) => (
          <div key={item.person_id} className="bg-[#1a2320]/80 border border-[#116466]/35 rounded-2xl p-6 shadow-xl space-y-4 futuristic-panel">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#116466]/20 text-[#D1E8E2] border border-[#116466]/40">
                  {item.person_id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5 font-display">{item.name}</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badge_color}`}>
                {item.status_badge}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#121816] p-2.5 rounded-lg border border-[#116466]/30">
                <span className="text-[10px] text-[#7e968e] block font-semibold font-mono">Betweenness</span>
                <span className="font-mono font-bold text-[#FFCB9A] text-sm">{item.betweenness}</span>
              </div>
              <div className="bg-[#121816] p-2.5 rounded-lg border border-[#116466]/30">
                <span className="text-[10px] text-[#7e968e] block font-semibold font-mono">PageRank Score</span>
                <span className="font-mono font-bold text-[#D1E8E2] text-sm">{item.pagerank}</span>
              </div>
              <div className="bg-[#121816] p-2.5 rounded-lg border border-[#116466]/30">
                <span className="text-[10px] text-[#7e968e] block font-semibold font-mono">Connectivity</span>
                <span className="font-mono font-bold text-[#D9B08C] text-sm">{item.degree}</span>
              </div>
            </div>

            <p className="text-xs text-[#a3b8b0] leading-relaxed bg-[#141a18] p-3 rounded-lg border border-[#116466]/25">
              "{item.assessment}"
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#7e968e]">Cluster: <strong className="text-[#D1E8E2]">{item.community}</strong></span>
              <button
                onClick={() => onSelectEntity({ person_id: item.person_id, name: item.name, role: item.status_badge, is_bridge: item.person_id === 'PER-103' })}
                className="text-xs font-bold text-[#D1E8E2] hover:text-[#FFCB9A] transition flex items-center gap-1"
              >
                <span>Inspect Entity</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D9B08C]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
