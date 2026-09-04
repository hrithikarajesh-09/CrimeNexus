import React, { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { User, CreditCard, Building2, Radio, Laptop } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

// Custom CrimeNexus Node Component for React Flow
function CrimeNexusNode({ data }) {
  const IconComponent = data.type === 'account' ? CreditCard : data.type === 'location' ? Radio : data.type === 'tech' ? Laptop : data.type === 'company' ? Building2 : User;

  return (
    <div className={`px-3 py-2 rounded-[6px] border shadow-lg bg-[#131A26] text-xs min-w-[140px] transition ${
      data.isBridge 
        ? 'border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30' 
        : data.isVictim
        ? 'border-[#34D399]'
        : 'border-[#222D3F] hover:border-[#D4A359]'
    }`}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[4px] bg-[#0B0F17] border border-[#222D3F] flex items-center justify-center shrink-0" style={{ color: data.color || '#D4A359' }}>
          <IconComponent className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="font-semibold text-[#F1F5F9] text-[11px] leading-tight">{data.label}</div>
          <div className="font-mono text-[9px] text-[#64748B] leading-tight">{data.sub}</div>
        </div>
      </div>
      {data.badge && (
        <span className="mt-1.5 inline-block text-[8.5px] font-mono font-bold px-1 py-0.2 rounded bg-[#1A2332] text-[#D4A359] border border-[#222D3F]">
          {data.badge}
        </span>
      )}
    </div>
  );
}

const nodeTypes = {
  crimeNode: CrimeNexusNode,
};

const initialNodes = [
  { id: 'PER-108', type: 'crimeNode', position: { x: 50, y: 140 }, data: { label: 'Vikramaditya', sub: 'CFO (Victim)', type: 'person', color: '#3B82F6', isVictim: true, badge: 'VICTIM' } },
  { id: 'ACC-1001', type: 'crimeNode', position: { x: 250, y: 140 }, data: { label: 'Zenith Tech A/C', sub: 'Corporate ACC-1001', type: 'account', color: '#14B8A6' } },
  { id: 'ACC-2201', type: 'crimeNode', position: { x: 470, y: 140 }, data: { label: 'Suman Roy A/C', sub: 'Primary Mule ACC-2201', type: 'account', color: '#E05252', badge: 'PRIMARY MULE' } },
  { id: 'PER-104', type: 'crimeNode', position: { x: 380, y: 270 }, data: { label: 'Suman Roy', sub: 'Mule Accountholder', type: 'person', color: '#3B82F6' } },
  { id: 'ACC-MULES', type: 'crimeNode', position: { x: 600, y: 270 }, data: { label: '5 Secondary Mules', sub: 'Layering Accounts', type: 'account', color: '#14B8A6', badge: 'LAYERING' } },
  { id: 'PER-101', type: 'crimeNode', position: { x: 470, y: 20 }, data: { label: 'Rajesh Verma', sub: 'Syndicate Operator', type: 'person', color: '#E05252', badge: 'WANTED' } },
  { id: 'LOC-101', type: 'crimeNode', position: { x: 670, y: 20 }, data: { label: 'Tower T-4401', sub: 'Sec 44 Gurugram', type: 'location', color: '#D4A359' } },
  { id: 'PER-103', type: 'crimeNode', position: { x: 720, y: 140 }, data: { label: 'Devrat Sharma', sub: 'Bridge Money Broker', type: 'person', color: '#8B5CF6', isBridge: true, badge: 'KEY BRIDGE' } },
  { id: 'ACC-7701', type: 'crimeNode', position: { x: 940, y: 140 }, data: { label: 'Apex Trade Solutions', sub: 'Case 041 Shell Front', type: 'company', color: '#8B5CF6', isBridge: true, badge: 'MUMBAI CO.' } },
  { id: 'PER-105', type: 'crimeNode', position: { x: 1140, y: 140 }, data: { label: 'Tariq Merchant', sub: 'Hawala Operator', type: 'person', color: '#E05252' } },
  { id: 'ACC-7705', type: 'crimeNode', position: { x: 1140, y: 270 }, data: { label: 'Dubai Bullion A/C', sub: 'Offshore Gold Account', type: 'account', color: '#14B8A6', badge: 'OFFSHORE' } },
];

const initialEdges = [
  { id: 'e1', source: 'PER-108', target: 'ACC-1001', label: 'Signatory', animated: false, style: { stroke: '#3B82F6' } },
  { id: 'e2', source: 'ACC-1001', target: 'ACC-2201', label: '₹1.00 Cr RTGS', animated: true, style: { stroke: '#D4A359', strokeWidth: 2 } },
  { id: 'e3', source: 'ACC-2201', target: 'PER-104', label: 'Registered To', style: { stroke: '#64748B' } },
  { id: 'e4', source: 'ACC-2201', target: 'ACC-MULES', label: '5x ₹20L Tranches', animated: true, style: { stroke: '#14B8A6' } },
  { id: 'e5', source: 'PER-101', target: 'LOC-101', label: 'Tower Presence', style: { stroke: '#64748B' } },
  { id: 'e6', source: 'ACC-MULES', target: 'PER-103', label: '₹70L Aggregated', animated: true, style: { stroke: '#D4A359' } },
  { id: 'e7', source: 'PER-103', target: 'ACC-7701', label: 'TXN_552 (Bridge)', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' }, style: { stroke: '#8B5CF6', strokeWidth: 2.5 } },
  { id: 'e8', source: 'ACC-7701', target: 'PER-105', label: '₹45L Cash Out', style: { stroke: '#E05252' } },
  { id: 'e9', source: 'PER-105', target: 'ACC-7705', label: 'SWIFT Wire', animated: true, style: { stroke: '#14B8A6' } },
];

export default function NetworkFlowBoard({ onSelectEntity }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback((event, node) => {
    if (onSelectEntity) {
      onSelectEntity({
        person_id: node.id,
        name: node.data.label,
        role: node.data.sub,
        is_bridge: node.data.isBridge
      });
    }
  }, [onSelectEntity]);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#222D3F] pb-2.5">
        <div className="flex items-center gap-2">
          <Badge variant="brass">REACT FLOW (@xyflow/react)</Badge>
          <h3 className="text-sm font-serif font-bold text-[#F1F5F9] tracking-wide">
            Interactive Drag &amp; Pan Network Graph
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#64748B]">
          Draggable Nodes &bull; Infinite Canvas &bull; Controls
        </span>
      </div>

      <div className="w-full h-[420px] bg-[#0B0F17] border border-[#222D3F] rounded-[6px] overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0B0F17]"
        >
          <Background color="#222D3F" gap={16} size={1} />
          <Controls className="bg-[#131A26] border border-[#222D3F] text-[#F1F5F9] rounded-[4px] p-1 shadow-lg" />
        </ReactFlow>
      </div>
    </Card>
  );
}
