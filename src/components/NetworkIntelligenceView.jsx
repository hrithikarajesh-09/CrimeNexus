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
      assessment: "Exhibits high network-brokerage characteristics bridging isolated clusters; primary bridge between Delhi & Mumbai rings.",
      status_badge: "Key Bridge Broker Node",
      badge_color: "bg-[#8860D0]/20 text-[#8860D0] border-[#8860D0]/50 font-bold shadow-[0_0_12px_rgba(136,96,208,0.25)]"
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
      badge_color: "bg-[#5680E9]/20 text-[#84CEEB] border-[#5680E9]/40"
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
      badge_color: "bg-[#5AB9EA]/20 text-[#84CEEB] border-[#5AB9EA]/40"
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
      badge_color: "bg-[#8860D0]/15 text-[#C1C8E4] border-[#8860D0]/30"
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="ethereal-glass rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
                NETWORK INTELLIGENCE &amp; GRAPH ANALYTICS
              </span>
              <h2 className="text-xl font-bold text-white font-display tracking-wide">Graph Centrality &amp; Community Analytics</h2>
            </div>
            <p className="text-xs text-[#C1C8E4] mt-1.5 max-w-3xl leading-relaxed">
              Powered by Neo4j Graph Data Science (GDS) &amp; NetworkX. Computes Betweenness Centrality, PageRank, Degree Centrality, and Louvain Community Detection across multi-jurisdiction criminal networks.
            </p>
          </div>

          <div className="bg-[#141d33]/90 border border-[#8860D0]/40 px-4 py-2.5 rounded-2xl text-xs text-[#C1C8E4] flex items-center gap-2.5 font-mono shadow-lg">
            <AlertTriangle className="w-4 h-4 text-[#84CEEB]" />
            <span><strong className="text-white">Neutrality Protocol:</strong> Evidence-neutral analytical terminology enforced.</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analytics.map((item) => (
          <div key={item.person_id} className="ethereal-glass rounded-3xl p-6 shadow-xl space-y-4 hover:border-[#5680E9]/50 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
                  {item.person_id}
                </span>
                <h3 className="text-lg font-bold text-white mt-2 font-display">{item.name}</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badge_color}`}>
                {item.status_badge}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#141d33]/80 p-3 rounded-2xl border border-[#5680E9]/20">
                <span className="text-[10px] text-[#8b9bb4] block font-semibold font-mono">Betweenness</span>
                <span className="font-mono font-bold text-[#84CEEB] text-sm">{item.betweenness}</span>
              </div>
              <div className="bg-[#141d33]/80 p-3 rounded-2xl border border-[#5680E9]/20">
                <span className="text-[10px] text-[#8b9bb4] block font-semibold font-mono">PageRank Score</span>
                <span className="font-mono font-bold text-[#C1C8E4] text-sm">{item.pagerank}</span>
              </div>
              <div className="bg-[#141d33]/80 p-3 rounded-2xl border border-[#5680E9]/20">
                <span className="text-[10px] text-[#8b9bb4] block font-semibold font-mono">Connectivity</span>
                <span className="font-mono font-bold text-[#8860D0] text-sm">{item.degree}</span>
              </div>
            </div>

            <p className="text-xs text-[#C1C8E4] leading-relaxed bg-[#080c18]/60 p-3.5 rounded-2xl border border-[#5680E9]/20">
              "{item.assessment}"
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#8b9bb4]">Cluster: <strong className="text-white">{item.community}</strong></span>
              <button
                onClick={() => onSelectEntity({ person_id: item.person_id, name: item.name, role: item.status_badge, is_bridge: item.person_id === 'PER-103' })}
                className="text-xs font-bold text-[#84CEEB] hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5680E9]/15 hover:bg-[#5680E9]/30 border border-[#5680E9]/30"
              >
                <span>Inspect Entity</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#84CEEB]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
