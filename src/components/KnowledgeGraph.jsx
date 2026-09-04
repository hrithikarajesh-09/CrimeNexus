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

      let color = { background: '#1e293b', border: '#475569' };
      let shape = 'dot';
      let size = 18;

      switch (group) {
        case 'Person':
          color = extra.is_bridge ? { background: '#ef4444', border: '#f87171' } : { background: '#f97316', border: '#fb923c' };
          size = extra.is_bridge ? 26 : 20;
          break;
        case 'Account':
          color = { background: '#10b981', border: '#34d399' };
          size = 20;
          break;
        case 'Phone':
          color = { background: '#a855f7', border: '#c084fc' };
          break;
        case 'Case':
          color = { background: '#3b82f6', border: '#60a5fa' };
          shape = 'diamond';
          size = 28;
          break;
        case 'Evidence':
          color = { background: '#eab308', border: '#fde047' };
          shape = 'triangle';
          break;
        case 'Vehicle':
          color = { background: '#ec4899', border: '#f472b6' };
          break;
        case 'Cyber':
          color = { background: '#06b6d4', border: '#22d3ee' };
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
          highlight: { background: '#38bdf8', border: '#ffffff' }
        },
        font: { color: '#f8fafc', size: 11, face: 'Inter' },
        borderWidth: extra.is_bridge ? 3 : 1.5,
        shadow: true,
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
        font: { strokeWidth: 2, strokeColor: '#0b0f19' }
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
    <div className="space-y-4">
      {/* Graph Controls Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Case View:</span>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Connected Cases (Cross-Case)</option>
              <option value="CASE-018">CASE-018: Operation PhishNet (NCR)</option>
              <option value="CASE-041">CASE-041: Operation ShadowLedge (MUM)</option>
              <option value="CASE-059">CASE-059: Operation DarkSIM (NCR)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 border-l border-slate-800 pl-3">
            <span>Entity Type:</span>
            <select
              value={nodeTypeFilter}
              onChange={(e) => setNodeTypeFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Entity Nodes</option>
              <option value="Person">People / Suspects</option>
              <option value="Account">Bank Accounts</option>
              <option value="Phone">Phone Lines</option>
              <option value="Evidence">Evidence Files</option>
            </select>
          </div>

          {/* Temporal Timeline Slider */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 border-l border-slate-800 pl-3">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Temporal Window:</span>
            <div className="flex items-center bg-slate-800 p-0.5 rounded border border-slate-700">
              <button
                onClick={() => setTemporalMonth('ALL')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  temporalMonth === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Full Timeline
              </button>
              <button
                onClick={() => setTemporalMonth('JUN')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  temporalMonth === 'JUN' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                June 2026 (Heist)
              </button>
              <button
                onClick={() => setTemporalMonth('AUG')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  temporalMonth === 'AUG' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
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
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitView}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset / Fit Graph View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Network Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 px-4 py-2 rounded-lg border border-slate-800/80">
        <div className="flex items-center gap-4 flex-wrap font-medium">
          <span className="text-slate-400">Node Legend:</span>
          <span className="flex items-center gap-1.5 text-red-400"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Bridge Broker (Devrat PER-103)</span>
          <span className="flex items-center gap-1.5 text-orange-400"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> People / Operatives</span>
          <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Bank Accounts</span>
          <span className="flex items-center gap-1.5 text-purple-400"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span> Phone Lines</span>
          <span className="flex items-center gap-1.5 text-blue-400"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Case Workspaces</span>
          <span className="flex items-center gap-1.5 text-yellow-400"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Evidence Artifacts</span>
        </div>

        <span className="text-slate-400 italic">
          Click any graph node to inspect Expandable Entity Card
        </span>
      </div>

      {/* Vis.js Graph Canvas Container */}
      <div className="relative w-full h-[650px] bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div ref={containerRef} className="w-full h-full" />

        {/* Floating Callout for Key Discovery */}
        <div className="absolute top-4 left-4 bg-slate-900/90 border border-red-500/40 rounded-xl p-3.5 max-w-sm shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-red-400">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>CROSS-CASE BRIDGE DISCOVERED</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            <strong>Devrat Sharma (PER-103)</strong> links NCR Cyber Phishing (Case 018) to Mumbai Hawala Ring (Case 041) via ₹50,00,000 transfer (TXN_552).
          </p>
        </div>
      </div>
    </div>
  );
}
