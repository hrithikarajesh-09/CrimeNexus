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
      badge_color: "text-[#8B81C4] border-[#8B81C4]/40 bg-[#1F2430]"
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
      badge_color: "text-[#C1655A] border-[#C1655A]/40 bg-[#1F2430]"
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
      badge_color: "text-[#C1655A] border-[#C1655A]/40 bg-[#1F2430]"
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
      badge_color: "text-[#9AA3B2] border-[#2B313D] bg-[#1F2430]"
    }
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Header Banner */}
      <div className="dossier-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#1F2430] text-[#C68A46] border border-[#2B313D]">
                GRAPH ANALYTICS
              </span>
              <h2 className="text-xl font-serif font-bold text-[#E8EAEE] tracking-tight">Centrality &amp; Community Detection</h2>
            </div>
            <p className="text-xs text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
              Powered by Neo4j Graph Data Science (GDS) &amp; NetworkX. Computes Betweenness Centrality, PageRank, Degree Centrality, and Louvain Community Detection across multi-jurisdiction criminal networks.
            </p>
          </div>

          <div className="bg-[#1F2430] border border-[#2B313D] px-3 py-1.5 rounded-[5px] text-xs text-[#9AA3B2] flex items-center gap-2 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-[#C68A46]" />
            <span><strong className="text-[#E8EAEE]">Neutrality Protocol:</strong> Evidence-neutral analytical terminology enforced.</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.map((item) => (
          <div key={item.person_id} className="dossier-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold px-1.5 py-0.2 rounded-[3px] bg-[#1F2430] text-[#6C93B8] border border-[#2B313D]">
                  {item.person_id}
                </span>
                <h3 className="text-base font-serif font-bold text-[#E8EAEE] mt-1">{item.name}</h3>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-[4px] border ${item.badge_color}`}>
                {item.status_badge}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#1F2430] p-2 rounded-[4px] border border-[#2B313D]">
                <span className="text-[10px] text-[#6B7382] block font-mono">Betweenness</span>
                <span className="font-mono font-bold text-[#C68A46] text-xs">{item.betweenness}</span>
              </div>
              <div className="bg-[#1F2430] p-2 rounded-[4px] border border-[#2B313D]">
                <span className="text-[10px] text-[#6B7382] block font-mono">PageRank</span>
                <span className="font-mono font-bold text-[#E8EAEE] text-xs">{item.pagerank}</span>
              </div>
              <div className="bg-[#1F2430] p-2 rounded-[4px] border border-[#2B313D]">
                <span className="text-[10px] text-[#6B7382] block font-mono">Degree</span>
                <span className="font-mono font-bold text-[#6C93B8] text-xs">{item.degree}</span>
              </div>
            </div>

            <p className="text-xs text-[#9AA3B2] leading-relaxed bg-[#1F2430] p-2.5 rounded-[4px] border border-[#2B313D]">
              "{item.assessment}"
            </p>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs text-[#6B7382]">Cluster: <strong className="text-[#E8EAEE]">{item.community}</strong></span>
              <button
                onClick={() => onSelectEntity({ person_id: item.person_id, name: item.name, role: item.status_badge, is_bridge: item.person_id === 'PER-103' })}
                className="text-xs font-medium text-[#C68A46] hover:underline flex items-center gap-1"
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
