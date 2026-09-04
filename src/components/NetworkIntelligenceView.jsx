import React, { useState } from 'react';
import { GitBranch, ArrowRight, AlertTriangle, BarChart3, Network, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import NetworkFlowBoard from './NetworkFlowBoard';

export default function NetworkIntelligenceView({ onSelectEntity, onAskCopilot }) {
  const [activeSubTab, setActiveSubTab] = useState('overview');

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
      badge_variant: "violet"
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
      badge_variant: "red"
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
      badge_variant: "red"
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
      badge_variant: "default"
    }
  ];

  // Quantitative dataset for Recharts analytics
  const centralityChartData = [
    { name: 'Devrat Sharma', betweenness: 89.2, degree: 14, pagerank: 14.2, id: 'PER-103' },
    { name: 'Rajesh Verma', betweenness: 61.4, degree: 9, pagerank: 9.8, id: 'PER-101' },
    { name: 'Tariq Merchant', betweenness: 58.8, degree: 8, pagerank: 9.1, id: 'PER-105' },
    { name: 'Anita D\'Souza', betweenness: 41.2, degree: 6, pagerank: 6.4, id: 'PER-107' }
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Header Banner with Stack Badges */}
      <Card className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="stamp-tag stamp-amber">NEO4J GDS &bull; RECHARTS &bull; REACT FLOW</span>
              <h2 className="text-xl font-serif font-bold text-[#E8EAEE] tracking-tight">Criminal Network Intelligence</h2>
            </div>
            <p className="text-xs text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
              Computes Betweenness Centrality, PageRank, Degree Centrality, and Louvain Community Detection across multi-jurisdiction criminal networks.
            </p>
          </div>

          {/* Sub-tab Switcher: Overview / Recharts / React Flow */}
          <div className="flex items-center gap-1 bg-[#12151B] border border-[#2B313D] p-1 rounded-[5px]">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeSubTab === 'overview'
                  ? 'bg-[#C68A46] text-[#12151B] font-semibold'
                  : 'text-[#9AA3B2] hover:text-[#E8EAEE]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dossiers</span>
            </button>

            <button
              onClick={() => setActiveSubTab('charts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeSubTab === 'charts'
                  ? 'bg-[#C68A46] text-[#12151B] font-semibold'
                  : 'text-[#9AA3B2] hover:text-[#E8EAEE]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Recharts Analysis</span>
            </button>

            <button
              onClick={() => setActiveSubTab('flow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeSubTab === 'flow'
                  ? 'bg-[#C68A46] text-[#12151B] font-semibold'
                  : 'text-[#9AA3B2] hover:text-[#E8EAEE]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>React Flow Graph</span>
            </button>
          </div>
        </div>
      </Card>

      {/* SUB-TAB 1: RECHARTS VISUALIZATION */}
      {activeSubTab === 'charts' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2B313D] pb-3">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#E8EAEE] tracking-wide flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#C68A46]" />
                Topological Centrality &amp; Brokerage Distribution (Recharts Analytics)
              </h3>
              <p className="text-xs text-[#9AA3B2] mt-0.5 font-sans">
                Quantifies conspirator bridging roles and liquidity pipeline bottlenecks.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#787167] bg-[#12151B] px-2.5 py-1 rounded border border-[#2B313D]">
              Normalized Scale 0–100%
            </span>
          </div>

          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centralityChartData} margin={{ top: 15, right: 25, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2B313D" opacity={0.6} />
                <XAxis dataKey="name" stroke="#787167" fontSize={11} tickLine={false} fontFamily="IBM Plex Sans, sans-serif" />
                <YAxis stroke="#787167" fontSize={10} tickLine={false} fontFamily="Courier Prime, monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181C24',
                    borderColor: '#2B313D',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'Courier Prime, monospace',
                    color: '#E8EAEE',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Courier Prime, monospace', paddingTop: '10px' }} />
                <Bar dataKey="betweenness" name="Betweenness Centrality (%)" fill="#C68A46" radius={[3, 3, 0, 0]} />
                <Bar dataKey="degree" name="Conduit Degree Count" fill="#6C93B8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pagerank" name="PageRank Score (x100)" fill="#5FA876" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* SUB-TAB 2: REACT FLOW INTERACTIVE CANVAS */}
      {activeSubTab === 'flow' && (
        <NetworkFlowBoard onSelectEntity={onSelectEntity} />
      )}

      {/* SUB-TAB 3: GDS ANALYTICS DOSSIERS (DEFAULT) */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.map((item, idx) => (
            <motion.div
              key={item.person_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.06 }}
              whileHover={{ y: -2 }}
            >
              <Card className="p-4 space-y-3 hover:border-[#4A5468] transition-colors h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="steel">
                        {item.person_id}
                      </Badge>
                      <h3 className="text-base font-serif font-bold text-[#E8EAEE] mt-1">{item.name}</h3>
                    </div>
                    <Badge variant={item.badge_variant}>
                      {item.status_badge}
                    </Badge>
                  </div>

                  {/* Metrics Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#12151B] p-2 rounded-[4px] border border-[#2B313D]">
                      <span className="text-[10px] text-[#787167] block font-mono uppercase">Betweenness</span>
                      <span className="font-mono font-bold text-[#C68A46] text-xs">{item.betweenness}</span>
                    </div>
                    <div className="bg-[#12151B] p-2 rounded-[4px] border border-[#2B313D]">
                      <span className="text-[10px] text-[#787167] block font-mono uppercase">PageRank</span>
                      <span className="font-mono font-bold text-[#E8EAEE] text-xs">{item.pagerank}</span>
                    </div>
                    <div className="bg-[#12151B] p-2 rounded-[4px] border border-[#2B313D]">
                      <span className="text-[10px] text-[#787167] block font-mono uppercase">Degree</span>
                      <span className="font-mono font-bold text-[#6C93B8] text-xs">{item.degree}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#9AA3B2] leading-relaxed bg-[#1F2430] p-2.5 rounded-[4px] border border-[#2B313D]">
                    "{item.assessment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#2B313D] flex items-center justify-between">
                  <span className="text-xs text-[#6B7382]">Cluster: <strong className="text-[#E8EAEE]">{item.community}</strong></span>
                  <Button
                    onClick={() => onSelectEntity({ person_id: item.person_id, name: item.name, role: item.status_badge, is_bridge: item.person_id === 'PER-103' })}
                    variant="ghost"
                    size="sm"
                    className="text-[#C68A46] hover:text-[#D49855]"
                  >
                    <span>Inspect Entity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
