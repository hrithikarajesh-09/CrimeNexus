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
              <h2 className="text-xl font-serif font-bold text-[#F1F5F9] tracking-tight">Criminal Network Intelligence</h2>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
              Computes Betweenness Centrality, PageRank, Degree Centrality, and Louvain Community Detection across multi-jurisdiction criminal networks.
            </p>
          </div>

          {/* Sub-tab Switcher: Overview / Recharts / React Flow */}
          <div className="flex items-center gap-1 bg-[#0B0F17] border border-[#222D3F] p-1 rounded-[6px]">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeSubTab === 'overview'
                  ? 'bg-[#D4A359] text-[#0B0F17] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dossiers</span>
            </button>

            <button
              onClick={() => setActiveSubTab('charts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeSubTab === 'charts'
                  ? 'bg-[#D4A359] text-[#0B0F17] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Recharts Analysis</span>
            </button>

            <button
              onClick={() => setActiveSubTab('flow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeSubTab === 'flow'
                  ? 'bg-[#D4A359] text-[#0B0F17] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
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
          <div className="flex items-center justify-between border-b border-[#222D3F] pb-3">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#F1F5F9] tracking-wide flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D4A359]" />
                Topological Centrality &amp; Brokerage Distribution (Recharts Analytics)
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-sans">
                Quantifies conspirator bridging roles and liquidity pipeline bottlenecks.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] bg-[#0B0F17] px-2.5 py-1 rounded border border-[#222D3F]">
              Normalized Scale 0–100%
            </span>
          </div>

          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centralityChartData} margin={{ top: 15, right: 25, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222D3F" opacity={0.6} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} fontFamily="IBM Plex Sans, sans-serif" />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} fontFamily="Courier Prime, monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131A26',
                    borderColor: '#222D3F',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'Courier Prime, monospace',
                    color: '#F1F5F9',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Courier Prime, monospace', paddingTop: '10px' }} />
                <Bar dataKey="betweenness" name="Betweenness Centrality (%)" fill="#D4A359" radius={[3, 3, 0, 0]} />
                <Bar dataKey="degree" name="Conduit Degree Count" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pagerank" name="PageRank Score (x100)" fill="#34D399" radius={[3, 3, 0, 0]} />
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
              <Card className="p-4 space-y-3 hover:border-[#2E3D55] transition-colors h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="steel">
                        {item.person_id}
                      </Badge>
                      <h3 className="text-base font-serif font-bold text-[#F1F5F9] mt-1">{item.name}</h3>
                    </div>
                    <Badge variant={item.badge_variant}>
                      {item.status_badge}
                    </Badge>
                  </div>

                  {/* Metrics Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#0B0F17] p-2 rounded-[4px] border border-[#222D3F]">
                      <span className="text-[10px] text-[#64748B] block font-mono uppercase">Betweenness</span>
                      <span className="font-mono font-bold text-[#D4A359] text-xs">{item.betweenness}</span>
                    </div>
                    <div className="bg-[#0B0F17] p-2 rounded-[4px] border border-[#222D3F]">
                      <span className="text-[10px] text-[#64748B] block font-mono uppercase">PageRank</span>
                      <span className="font-mono font-bold text-[#F1F5F9] text-xs">{item.pagerank}</span>
                    </div>
                    <div className="bg-[#0B0F17] p-2 rounded-[4px] border border-[#222D3F]">
                      <span className="text-[10px] text-[#64748B] block font-mono uppercase">Degree</span>
                      <span className="font-mono font-bold text-[#3B82F6] text-xs">{item.degree}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#1A2332] p-2.5 rounded-[4px] border border-[#222D3F]">
                    "{item.assessment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#222D3F] flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">Cluster: <strong className="text-[#F1F5F9]">{item.community}</strong></span>
                  <Button
                    onClick={() => onSelectEntity({ person_id: item.person_id, name: item.name, role: item.status_badge, is_bridge: item.person_id === 'PER-103' })}
                    variant="ghost"
                    size="sm"
                    className="text-[#D4A359] hover:text-[#E0B268]"
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
