import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { GitBranch, ZoomIn, ZoomOut, RefreshCw, Filter, Layers, Calendar, Info, ShieldAlert, Cpu } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function KnowledgeGraph({ onSelectEntity, activeCaseFilter }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [selectedCase, setSelectedCase] = useState(activeCaseFilter || 'ALL');
  const [nodeTypeFilter, setNodeTypeFilter] = useState('ALL');
  const [temporalMonth, setTemporalMonth] = useState('ALL'); // 'JUN', 'AUG', 'ALL'
  const [highlightBridge, setHighlightBridge] = useState(true);

  // Construct Vis.js Nodes and Edges from RAW_DATASET
  const buildGraphData = () => {
    const nodes = [];
    const edges = [];
    const addedNodeIds = new Set();

    // Helper to add node safely
    const addNode = (id, label, group, details, extra = {}) => {
      if (addedNodeIds.has(id)) return;
      addedNodeIds.add(id);

      let color = { background: '#1A2332', border: '#222D3F' };
      let shape = 'dot';
      let size = 18;

      switch (group) {
        case 'Person':
          color = extra.is_bridge ? { background: '#E05252', border: '#EF4444' } : { background: '#3B82F6', border: '#60A5FA' };
          size = extra.is_bridge ? 26 : 20;
          break;
        case 'Account':
          color = { background: '#14B8A6', border: '#2DD4BF' };
          size = 20;
          break;
        case 'Phone':
          color = { background: '#8B5CF6', border: '#A78BFA' };
          break;
        case 'Case':
          color = { background: '#D4A359', border: '#E0B268' };
          shape = 'diamond';
          size = 28;
          break;
        case 'Evidence':
          color = { background: '#D4A359', border: '#F59E0B' };
          shape = 'triangle';
          break;
        case 'Vehicle':
          color = { background: '#8B5CF6', border: '#C084FC' };
          break;
        case 'Cyber':
          color = { background: '#3B82F6', border: '#38BDF8' };
          break;
        default:
          break;
      }

      nodes.push({
        id,
        label: `${label}\n(${id})`,
        group,
        shape,
        size,
        color: {
          background: color.background,
          border: color.border,
          highlight: { background: '#D4A359', border: '#F1F5F9' }
        },
        font: { color: '#F1F5F9', size: 11, face: 'IBM Plex Sans, Inter, sans-serif' },
        borderWidth: extra.is_bridge ? 3 : 1.5,
        shadow: false,
        data: details
      });
    };

    // 1. Add Cases
    RAW_DATASET.cases.forEach((c) => {
      if (selectedCase !== 'ALL' && c.case_id !== selectedCase) return;
      addNode(c.case_id, c.title, 'Case', { ...c, entity_type: 'Case' });
    });

    // 2. Add People
    RAW_DATASET.people.forEach((p) => {
      if (selectedCase !== 'ALL' && p.primary_case_id !== selectedCase && !p.is_bridge) return;
      if (nodeTypeFilter !== 'ALL' && nodeTypeFilter !== 'Person') return;
      addNode(p.person_id, p.name, 'Person', { ...p, entity_type: 'Person' }, { is_bridge: p.is_bridge });

      // Edge to Case
      if (addedNodeIds.has(p.primary_case_id)) {
        edges.push({
          from: p.person_id,
          to: p.primary_case_id,
          label: 'SUSPECT_IN',
          color: { color: '#475569', opacity: 0.6 },
          dashes: true
        });
      }
    });

    // 3. Add Phones & Edges
    RAW_DATASET.phones.forEach((ph) => {
      if (nodeTypeFilter !== 'ALL' && nodeTypeFilter !== 'Phone') return;
      addNode(ph.phone_id, ph.msisdn, 'Phone', { ...ph, entity_type: 'Phone' });
      if (ph.owner_id && addedNodeIds.has(ph.owner_id)) {
        edges.push({
          from: ph.owner_id,
          to: ph.phone_id,
          label: 'OWNS_PHONE',
          color: { color: '#a855f7', opacity: 0.7 }
        });
      }
    });

    // 4. Add Accounts & Edges
    RAW_DATASET.accounts.forEach((acc) => {
      if (nodeTypeFilter !== 'ALL' && nodeTypeFilter !== 'Account') return;
      addNode(acc.account_id, `${acc.bank_name} ${acc.account_number.slice(-4)}`, 'Account', { ...acc, entity_type: 'Account' });
      if (acc.holder_id && addedNodeIds.has(acc.holder_id)) {
        edges.push({
          from: acc.holder_id,
          to: acc.account_id,
          label: 'HOLDS_ACCOUNT',
          color: { color: '#10b981', opacity: 0.7 }
        });
      }
    });

    // 5. Add Transactions Edges
    RAW_DATASET.transactions.forEach((txn) => {
      if (temporalMonth !== 'ALL') {
        if (temporalMonth === 'JUN' && !txn.timestamp.startsWith('2026-06')) return;
        if (temporalMonth === 'AUG' && !txn.timestamp.startsWith('2026-08')) return;
      }

      if (addedNodeIds.has(txn.sender_acc) && addedNodeIds.has(txn.receiver_acc)) {
        const isBridge = txn.is_cross_case;
        edges.push({
          from: txn.sender_acc,
          to: txn.receiver_acc,
          label: `${txn.amount} (${txn.type})`,
          font: { color: isBridge ? '#f43f5e' : '#34d399', size: 10, align: 'top' },
          color: isBridge ? { color: '#f43f5e', highlight: '#fda4af' } : { color: '#10b981', opacity: 0.8 },
          width: isBridge ? 3.5 : 2,
          arrows: 'to'
        });
      }
    });

    // 6. Add CDR Edges
    RAW_DATASET.cdr.forEach((c) => {
      if (temporalMonth !== 'ALL') {
        if (temporalMonth === 'JUN' && !c.timestamp.startsWith('2026-06')) return;
        if (temporalMonth === 'AUG' && !c.timestamp.startsWith('2026-08')) return;
      }

      if (addedNodeIds.has(c.caller_phone) && addedNodeIds.has(c.receiver_phone)) {
        edges.push({
          from: c.caller_phone,
          to: c.receiver_phone,
          label: `CALL (${c.duration})`,
          font: { color: '#c084fc', size: 9 },
          color: { color: '#a855f7', opacity: 0.6 },
          width: 1.5,
          arrows: 'to',
          dashes: true
        });
      }
    });

    // 7. Add Evidence Nodes
    RAW_DATASET.evidence.forEach((ev) => {
      if (nodeTypeFilter !== 'ALL' && nodeTypeFilter !== 'Evidence') return;
      if (selectedCase !== 'ALL' && ev.case_id !== selectedCase) return;
      addNode(ev.evidence_id, ev.file_name, 'Evidence', { ...ev, entity_type: 'Evidence' });
      if (addedNodeIds.has(ev.case_id)) {
        edges.push({
          from: ev.evidence_id,
          to: ev.case_id,
          label: 'EVIDENCE_FOR',
          color: { color: '#eab308', opacity: 0.6 }
        });
      }
    });

    return { nodes, edges };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const graphData = buildGraphData();
    const data = {
      nodes: graphData.nodes,
      edges: graphData.edges
    };

    const options = {
      nodes: {
        shape: 'dot',
        font: { strokeWidth: 2, strokeColor: '#0B0F17' }
      },
      edges: {
        smooth: { type: 'continuous' }
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -38,
          centralGravity: 0.015,
          springLength: 110,
          springConstant: 0.08
        },
        maxVelocity: 50,
        timestep: 0.35,
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true
      }
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    // Handle Click on Node
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const targetNode = graphData.nodes.find((n) => n.id === nodeId);
        if (targetNode && targetNode.data) {
          onSelectEntity(targetNode.data);
        }
      }
    });

    return () => {
      network.destroy();
    };
  }, [selectedCase, nodeTypeFilter, temporalMonth, highlightBridge]);

  const handleZoomIn = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale * 1.25 });
    }
  };

  const handleZoomOut = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale / 1.25 });
    }
  };

  const handleFitView = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: { duration: 500 } });
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Graph Controls Toolbar */}
      <div className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8]">
            <Filter className="w-4 h-4 text-[#D4A359]" />
            <span>Case View:</span>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="bg-[#1A2332] border border-[#222D3F] text-[#F1F5F9] rounded-[4px] px-2.5 py-1 text-xs focus:outline-none focus:border-[#D4A359]"
            >
              <option value="ALL">All Connected Cases (Cross-Case)</option>
              <option value="CASE-018">CASE-018: Operation PhishNet (NCR)</option>
              <option value="CASE-041">CASE-041: Operation ShadowLedge (MUM)</option>
              <option value="CASE-059">CASE-059: Operation DarkSIM (NCR)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] border-l border-[#222D3F] pl-3">
            <span>Entity Type:</span>
            <select
              value={nodeTypeFilter}
              onChange={(e) => setNodeTypeFilter(e.target.value)}
              className="bg-[#1A2332] border border-[#222D3F] text-[#F1F5F9] rounded-[4px] px-2.5 py-1 text-xs focus:outline-none focus:border-[#D4A359]"
            >
              <option value="ALL">All Entity Nodes</option>
              <option value="Person">People / Suspects</option>
              <option value="Account">Bank Accounts</option>
              <option value="Phone">Phone Lines</option>
              <option value="Evidence">Evidence Files</option>
            </select>
          </div>

          {/* Temporal Timeline Slider */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] border-l border-[#222D3F] pl-3">
            <Calendar className="w-4 h-4 text-[#D4A359]" />
            <span>Temporal Window:</span>
            <div className="flex items-center bg-[#1A2332] p-0.5 rounded-[4px] border border-[#222D3F]">
              <button
                onClick={() => setTemporalMonth('ALL')}
                className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold transition cursor-pointer ${
                  temporalMonth === 'ALL' ? 'bg-[#D4A359] text-[#0B0F17]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                Full Timeline
              </button>
              <button
                onClick={() => setTemporalMonth('JUN')}
                className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold transition cursor-pointer ${
                  temporalMonth === 'JUN' ? 'bg-[#D4A359] text-[#0B0F17]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                June 2026 (Heist)
              </button>
              <button
                onClick={() => setTemporalMonth('AUG')}
                className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold transition cursor-pointer ${
                  temporalMonth === 'AUG' ? 'bg-[#D4A359] text-[#0B0F17]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                August 2026 (Hawala Exit)
              </button>
            </div>
          </div>
        </div>

        {/* View Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#222D3F] transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#222D3F] transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitView}
            className="p-1.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#222D3F] transition cursor-pointer"
            title="Reset / Fit Graph View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Network Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#131A26] px-4 py-2 rounded-[6px] border border-[#222D3F]">
        <div className="flex items-center gap-4 flex-wrap font-medium">
          <span className="text-[#64748B]">Node Legend:</span>
          <span className="flex items-center gap-1.5 text-[#E05252]"><span className="w-2.5 h-2.5 rounded-full bg-[#E05252] inline-block"></span> Bridge Broker (Devrat PER-103)</span>
          <span className="flex items-center gap-1.5 text-[#3B82F6]"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] inline-block"></span> People / Operatives</span>
          <span className="flex items-center gap-1.5 text-[#14B8A6]"><span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] inline-block"></span> Bank Accounts</span>
          <span className="flex items-center gap-1.5 text-[#8B5CF6]"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] inline-block"></span> Phone Lines</span>
          <span className="flex items-center gap-1.5 text-[#D4A359]"><span className="w-2.5 h-2.5 rounded-full bg-[#D4A359] inline-block"></span> Case Workspaces</span>
        </div>

        <span className="text-[#64748B] italic font-mono text-[11px]">
          Click any node to inspect Entity Dossier
        </span>
      </div>

      {/* Vis.js Graph Canvas Container */}
      <div className="relative w-full h-[650px] bg-[#0B0F17] border border-[#222D3F] rounded-[6px] overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {/* Floating Callout for Key Discovery */}
        <div className="absolute top-4 left-4 bg-[#131A26]/95 border border-[#E05252]/40 rounded-[6px] p-3.5 max-w-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E05252]">
            <ShieldAlert className="w-4 h-4 text-[#E05252]" />
            <span>CROSS-CASE BRIDGE DISCOVERED</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            <strong className="text-[#F1F5F9]">Devrat Sharma (PER-103)</strong> links NCR Cyber Phishing (Case 018) to Mumbai Hawala Ring (Case 041) via ₹50,00,000 transfer (TXN_552).
          </p>
        </div>
      </div>
    </div>
  );
}
