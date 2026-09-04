import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, FileText, User, CreditCard, Radio, Laptop, Building2,
  Play, Pause, RotateCcw, Volume2, VolumeX, Scale, Sparkles, X, Info,
  CheckCircle2, AlertTriangle, Film, ZoomIn, ZoomOut, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { RAW_DATASET } from '../data/dataset';
import { 
  playPinStamp, 
  playConduitSnap, 
  playStageChime, 
  speakNarration, 
  stopNarration, 
  pauseNarration,
  resumeNarration,
  unlockAudio,
  getActiveVoiceDescription
} from '../lib/soundEngine';

export default function CaseWorkspace({ caseId, onBack, onSelectEntity, onAskCopilot }) {
  const caseData = RAW_DATASET.cases.find(c => c.case_id === caseId) || RAW_DATASET.cases[0];
  const allEvents = RAW_DATASET.groundTruth.chronological_reconstruction_events;

  // Filter events relevant to this case
  const caseEvents = allEvents.filter(e => 
    e.case_id.includes(caseId) || e.case_id.includes('CASE-018 -> CASE-041')
  );

  // Active workspace sub-tab: 'summary' (default), 'suspects', 'reconstruction', 'statutes'
  const [activeTab, setActiveTab] = useState('summary');

  // Zoom and pan state for the Interactive Entity Graph
  const [graphZoom, setGraphZoom] = useState(1);
  const [graphPan, setGraphPan] = useState({ x: 0, y: 0 });
  const [isDraggingGraph, setIsDraggingGraph] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const hasDraggedGraphRef = useRef(false);
  const graphContainerRef = useRef(null);
  const inspectorDrawerRef = useRef(null);
  const touchDistRef = useRef(null);

  // Native non-passive event listener: PREVENTS THE WHOLE WEBPAGE FROM ZOOMING
  // when the user pinches or scrolls with 2 fingers on the graph canvas.
  useEffect(() => {
    const container = graphContainerRef.current;
    if (!container) return;

    const handleWheelNative = (e) => {
      // Crucial: stops the browser from zooming the entire page/window
      e.preventDefault();
      e.stopPropagation();

      if (e.ctrlKey) {
        // Trackpad pinch-to-zoom gesture
        const factor = -e.deltaY * 0.008;
        setGraphZoom((prev) => Math.max(0.5, Math.min(3.5, +(prev + factor).toFixed(2))));
      } else {
        // Mouse wheel or 2-finger scroll
        const delta = e.deltaY < 0 ? 0.09 : -0.09;
        setGraphZoom((prev) => Math.max(0.5, Math.min(3.5, +(prev + delta).toFixed(2))));
      }
    };

    // Safari/macOS trackpad gesture prevention
    const handleGesture = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Touchscreen multi-touch pinch prevention & handling
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDistRef.current = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && touchDistRef.current) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scaleChange = dist / touchDistRef.current;
        touchDistRef.current = dist;
        setGraphZoom((prev) => Math.max(0.5, Math.min(3.5, +(prev * scaleChange).toFixed(2))));
      }
    };

    const handleTouchEnd = () => {
      touchDistRef.current = null;
    };

    container.addEventListener('wheel', handleWheelNative, { passive: false });
    container.addEventListener('gesturestart', handleGesture, { passive: false });
    container.addEventListener('gesturechange', handleGesture, { passive: false });
    container.addEventListener('gestureend', handleGesture, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheelNative);
      container.removeEventListener('gesturestart', handleGesture);
      container.removeEventListener('gesturechange', handleGesture);
      container.removeEventListener('gestureend', handleGesture);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab]);

  const handleGraphMouseDown = (e) => {
    setHoveredNode(null);
    hasDraggedGraphRef.current = false;
    if (e.target.closest && e.target.closest('.group')) {
      return;
    }
    setIsDraggingGraph(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: graphPan.x,
      panY: graphPan.y,
    };
  };

  const handleGraphMouseMove = (e) => {
    if (!isDraggingGraph) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.hypot(dx, dy) > 4) {
      hasDraggedGraphRef.current = true;
    }
    setGraphPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleGraphMouseUp = () => {
    if (isDraggingGraph && !hasDraggedGraphRef.current) {
      // Clicked on empty canvas background!
      setSelectedMapNode(null);
    }
    setIsDraggingGraph(false);
  };

  const handleZoomIn = () => {
    setHoveredNode(null);
    setGraphZoom(z => Math.min(3.5, +(z + 0.15).toFixed(2)));
  };
  const handleZoomOut = () => {
    setHoveredNode(null);
    setGraphZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)));
  };
  const handleResetZoom = () => {
    setHoveredNode(null);
    setGraphZoom(1);
    setGraphPan({ x: 0, y: 0 });
  };

  // Spatial Hover Popover state for graph nodes
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodeHoverPos, setNodeHoverPos] = useState({ x: 0, y: 0, flipY: false });

  const handleNodeHover = (e, node) => {
    if (isDraggingGraph) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const popoverWidth = 350;
    const popoverHeight = 250;

    // Viewport spatial awareness & boundary detection (flips upwards if near bottom of screen)
    const flipY = rect.bottom + popoverHeight + 15 > window.innerHeight;

    let x = rect.left + rect.width / 2 - popoverWidth / 2;
    if (x + popoverWidth > window.innerWidth - 16) {
      x = window.innerWidth - popoverWidth - 16;
    }
    if (x < 16) {
      x = 16;
    }

    let y = flipY 
      ? Math.max(12, rect.top - popoverHeight - 10) 
      : rect.bottom + 10;

    setNodeHoverPos({ x, y, flipY });
    setHoveredNode(node);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  // =========================================================================
  // GRAPH NODES (Semantic Dossier Tokens: steel = person/info, teal = account)
  // =========================================================================
  const allGraphNodes = [
    { id: 'PER-108', label: 'Vikramaditya', sub: 'CFO (Victim)', type: 'person', x: 90, y: 220, icon: User, color: '#6C93B8' },
    { id: 'ACC-1001', label: 'Zenith Tech A/C', sub: 'Corporate ACC-1001', type: 'account', x: 285, y: 220, icon: CreditCard, color: '#4E9C93' },
    { id: 'ACC-2201', label: 'Suman Roy A/C', sub: 'Primary Mule ACC-2201', type: 'account', x: 485, y: 220, icon: CreditCard, color: '#4E9C93', isFraud: true },
    { id: 'PER-104', label: 'Suman Roy', sub: 'Mule Accountholder', type: 'person', x: 385, y: 365, icon: User, color: '#6C93B8' },
    { id: 'ACC-MULES', label: '5 Secondary Mules', sub: 'Layering Accounts', type: 'account', x: 590, y: 365, icon: CreditCard, color: '#4E9C93' },
    { id: 'PER-101', label: 'Rajesh Verma', sub: 'Syndicate Operator', type: 'person', x: 510, y: 75, icon: User, color: '#6C93B8' },
    { id: 'LOC-101', label: 'Tower T-4401', sub: 'Sec 44 Gurugram', type: 'location', x: 695, y: 75, icon: Radio, color: '#6C93B8' },
    { id: 'PER-102', label: 'Kunal Shah', sub: 'Technical Operator', type: 'person', x: 880, y: 75, icon: Laptop, color: '#6C93B8' },
    { id: 'PER-103', label: 'Devrat Sharma', sub: 'Bridge Money Broker', type: 'person', x: 695, y: 220, icon: User, color: '#8B81C4', isBridge: true },
    { id: 'ACC-7701', label: 'Apex Trade Solutions', sub: 'Case 041 Shell Front', type: 'account', x: 900, y: 220, icon: Building2, color: '#8B81C4', isBridge: true },
    { id: 'PER-105', label: 'Tariq Merchant', sub: 'Hawala Operator', type: 'person', x: 1090, y: 220, icon: User, color: '#6C93B8' },
    { id: 'ACC-7705', label: 'Dubai Bullion A/C', sub: 'Offshore Account', type: 'account', x: 1090, y: 365, icon: CreditCard, color: '#4E9C93' }
  ];

  // =========================================================================
  // GRAPH EDGES (violet = cross-case, teal/brass = financial conduits)
  // =========================================================================
  const allGraphEdges = [
    { from: 'PER-108', to: 'ACC-1001', label: 'Signatory', color: '#6C93B8' },
    { from: 'ACC-1001', to: 'ACC-2201', label: '₹1.00 Cr RTGS', color: '#C68A46', strokeWidth: 2, animated: true },
    { from: 'ACC-2201', to: 'PER-104', label: 'Registered To', color: '#6B7382' },
    { from: 'ACC-2201', to: 'ACC-MULES', label: '5x ₹20L Tranches', color: '#4E9C93', animated: true },
    { from: 'PER-101', to: 'LOC-101', label: 'Tower Presence', color: '#6B7382' },
    { from: 'PER-102', to: 'LOC-101', label: 'IP / Dev Logs', color: '#6B7382' },
    { from: 'ACC-MULES', to: 'PER-103', label: '₹70L Aggregated', color: '#C68A46', animated: true },
    { from: 'LOC-101', to: 'PER-103', label: 'Voice Call', color: '#6B7382' },
    { from: 'PER-103', to: 'ACC-7701', label: 'TXN_552 (Bridge)', color: '#8B81C4', strokeWidth: 2.5, animated: true, isBridge: true },
    { from: 'ACC-7701', to: 'PER-105', label: '₹45L Cash Out', color: '#C1655A' },
    { from: 'PER-105', to: 'ACC-7705', label: 'SWIFT Wire', color: '#4E9C93', animated: true }
  ];

  // 6 Chronological Reconstruction Stages (Plus Stage 0: Initial Board Cleared)
  const reconstructionStages = [
    {
      stageNumber: 0,
      phaseTitle: 'Initial Forensic Board (Cleared)',
      timestamp: '09-JUN-2026 10:00 IST',
      evidence: 'Awaiting Investigation Execution',
      narration: 'Forensic evidence board cleared. Press Play Reconstruction to start the chronological recreation of the investigation.',
      nodes: [],
      edges: [],
      newNodes: [],
    },
    {
      stageNumber: 1,
      phaseTitle: 'Spear-Phishing Infiltration & 2FA Theft',
      timestamp: '09-JUN-2026 11:30 IST',
      evidence: 'FIR 0018/2026 & Email Headers (EVD-001)',
      narration: 'CFO Vikramaditya Rathore receives a spoofed email disguised as Zenith CEO Rajiv Singhania. Clicking the link takes him to a duplicate portal where hackers capture his corporate password and OTP token.',
      nodes: ['PER-108', 'ACC-1001'],
      edges: [{ from: 'PER-108', to: 'ACC-1001' }],
      newNodes: ['PER-108', 'ACC-1001'],
    },
    {
      stageNumber: 2,
      phaseTitle: '₹1.00 Crore Corporate RTGS Heist',
      timestamp: '09-JUN-2026 14:10 IST',
      evidence: 'RTGS Transfer Slip TXN-1001',
      narration: 'Using the stolen credentials, attackers execute an unauthorized ₹1.00 Crore RTGS transfer directly out of Zenith Technologies corporate account into primary mule Suman Roy\'s bank account.',
      nodes: ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104'],
      edges: [
        { from: 'PER-108', to: 'ACC-1001' },
        { from: 'ACC-1001', to: 'ACC-2201' },
        { from: 'ACC-2201', to: 'PER-104' }
      ],
      newNodes: ['ACC-2201', 'PER-104'],
    },
    {
      stageNumber: 3,
      phaseTitle: 'Rapid 5-Account Mule Fan-Out Layering',
      timestamp: '09-JUN-2026 14:35 IST',
      evidence: 'IMPS Bank Slips TXN-1002 to 1006',
      narration: 'Within 25 minutes, Suman Roy rapidly divides the ₹1.00 Crore across five secondary student and shell accounts in ₹20 Lakh tranches to avoid automated banking AML security freezes.',
      nodes: ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104', 'ACC-MULES'],
      edges: [
        { from: 'PER-108', to: 'ACC-1001' },
        { from: 'ACC-1001', to: 'ACC-2201' },
        { from: 'ACC-2201', to: 'PER-104' },
        { from: 'ACC-2201', to: 'ACC-MULES' }
      ],
      newNodes: ['ACC-MULES'],
    },
    {
      stageNumber: 4,
      phaseTitle: 'Cell Tower Telephony & Syndicate Call Dump',
      timestamp: '09-JUN-2026 14:45 IST',
      evidence: 'Sector 44 Tower T-4401 Dump (EVD-003)',
      narration: 'Cell tower records in Gurugram prove syndicate boss Rajesh Verma and technician Kunal Shah were on active phone calls coordinating with mule handlers while the heist took place.',
      nodes: ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104', 'ACC-MULES', 'LOC-101', 'PER-101', 'PER-102'],
      edges: [
        { from: 'PER-108', to: 'ACC-1001' },
        { from: 'ACC-1001', to: 'ACC-2201' },
        { from: 'ACC-2201', to: 'PER-104' },
        { from: 'ACC-2201', to: 'ACC-MULES' },
        { from: 'PER-101', to: 'LOC-101' },
        { from: 'PER-102', to: 'LOC-101' }
      ],
      newNodes: ['LOC-101', 'PER-101', 'PER-102'],
    },
    {
      stageNumber: 5,
      phaseTitle: 'Broker Devrat Sharma & Cross-Case Bridge (TXN_552)',
      timestamp: '07-AUG-2026 15:30 IST',
      evidence: 'FIU-IND Advisory STR-88912 & TXN_552',
      narration: 'Strategic money broker Devrat Sharma collects ₹70 Lakhs from the mules and sends ₹50 Lakhs via transfer TXN_552 directly into Mumbai company Apex Trade Solutions, bridging Case 018 with Case 041.',
      nodes: ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104', 'ACC-MULES', 'LOC-101', 'PER-101', 'PER-102', 'PER-103', 'ACC-7701'],
      edges: [
        { from: 'PER-108', to: 'ACC-1001' },
        { from: 'ACC-1001', to: 'ACC-2201' },
        { from: 'ACC-2201', to: 'PER-104' },
        { from: 'ACC-2201', to: 'ACC-MULES' },
        { from: 'PER-101', to: 'LOC-101' },
        { from: 'PER-102', to: 'LOC-101' },
        { from: 'ACC-MULES', to: 'PER-103' },
        { from: 'LOC-101', to: 'PER-103' },
        { from: 'PER-103', to: 'ACC-7701' }
      ],
      newNodes: ['PER-103', 'ACC-7701'],
    },
    {
      stageNumber: 6,
      phaseTitle: 'Hawala Cash-Out & Offshore Flight to Dubai',
      timestamp: '10-AUG-2026 12:00 IST',
      evidence: 'SWIFT MT-103 International Wire Records',
      narration: 'Apex Trade Solutions cashes out ₹45 Lakhs to hawala operator Tariq Merchant, who wires the proceeds via SWIFT into a Dubai bullion account to convert the stolen cash into offshore gold.',
      nodes: ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104', 'ACC-MULES', 'LOC-101', 'PER-101', 'PER-102', 'PER-103', 'ACC-7701', 'PER-105', 'ACC-7705'],
      edges: allGraphEdges,
      newNodes: ['PER-105', 'ACC-7705'],
    }
  ];

  // Wikipedia-style tooltip hover state
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Live Graph Video Reconstruction Player state (Starts at Stage 0 = Empty Board)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceAudio, setVoiceAudio] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioTestStatus, setAudioTestStatus] = useState(null);

  // Zoom & Pan state for Review Investigation Reconstruction Canvas
  const [reconZoom, setReconZoom] = useState(1);
  const [reconPan, setReconPan] = useState({ x: 0, y: 0 });
  const [isDraggingRecon, setIsDraggingRecon] = useState(false);
  const reconDragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const reconContainerRef = useRef(null);

  const handleReconZoomIn = () => {
    setReconZoom(z => Math.min(2.8, +(z + 0.15).toFixed(2)));
  };
  const handleReconZoomOut = () => {
    setReconZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)));
  };
  const handleReconResetZoom = () => {
    setReconZoom(1);
    setReconPan({ x: 0, y: 0 });
  };

  // Wheel zoom listener on reconstruction canvas
  useEffect(() => {
    const el = reconContainerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.09 : -0.09;
      setReconZoom((prev) => Math.max(0.5, Math.min(2.8, +(prev + delta).toFixed(2))));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const handleReconMouseDown = (e) => {
    // Only pan if not clicking on action buttons
    if (e.target.closest && (e.target.closest('button') || e.target.closest('a'))) return;
    setIsDraggingRecon(true);
    reconDragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: reconPan.x,
      panY: reconPan.y
    };
  };

  const handleReconMouseMove = (e) => {
    if (!isDraggingRecon) return;
    const dx = e.clientX - reconDragStartRef.current.x;
    const dy = e.clientY - reconDragStartRef.current.y;
    setReconPan({
      x: reconDragStartRef.current.panX + dx,
      y: reconDragStartRef.current.panY + dy
    });
  };

  const handleReconMouseUp = () => {
    setIsDraggingRecon(false);
  };

  const currentStage = reconstructionStages[Math.min(currentStep, reconstructionStages.length - 1)] || reconstructionStages[0];
  const activeReplayNodes = currentStage.nodes;
  const activeReplayEdges = currentStage.edges;
  const newlyMaterializedNodes = currentStage.newNodes;

  // Refs for tracking playback state without stale closures
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const advanceTimeoutRef = useRef(null);

  const clearAdvanceTimer = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  };

  // Advance to next stage smoothly
  const advanceToNextStage = () => {
    setCurrentStep((prev) => {
      if (prev < reconstructionStages.length - 1) {
        const next = prev + 1;
        triggerStagePlayback(next);
        return next;
      } else {
        setIsPlaying(false);
        setIsSpeaking(false);
        stopNarration();
        return prev;
      }
    });
  };

  const scheduleNextStage = (delayMs = 1200) => {
    clearAdvanceTimer();
    advanceTimeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        advanceToNextStage();
      }
    }, delayMs / playbackSpeed);
  };

  // Trigger audio playback and speech for a given stage
  const triggerStagePlayback = (stageIdx) => {
    clearAdvanceTimer();
    const stage = reconstructionStages[stageIdx];
    if (!stage) return;

    // 1. Play sound effects
    if (stageIdx > 0) {
      playStageChime();
      setTimeout(() => {
        playPinStamp();
      }, 120);
    }

    // 2. Event-driven speech synthesis: NEVER cut off before sentence is completed!
    if (voiceAudio && stage.narration && stageIdx > 0) {
      setIsSpeaking(true);
      speakNarration(stage.narration, {
        speed: playbackSpeed,
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          // When full sentence finishes, pause 1.3s so user can digest the graph, then advance
          if (isPlayingRef.current) {
            scheduleNextStage(1300);
          }
        },
        onError: () => {
          setIsSpeaking(false);
          if (isPlayingRef.current) {
            scheduleNextStage(4000);
          }
        }
      });
    } else {
      // Voice muted or initial stage: use comfortable text-length reading duration
      if (isPlayingRef.current) {
        const readingMs = Math.max(5000, (stage.narration || '').length * 52);
        scheduleNextStage(readingMs);
      }
    }
  };

  // Cleanup timers and voice on unmount
  useEffect(() => {
    return () => {
      clearAdvanceTimer();
      stopNarration();
    };
  }, []);

  const handleStartVideo = () => {
    unlockAudio();
    clearAdvanceTimer();
    setIsPaused(false);
    let startStep = currentStep;
    if (currentStep === 0 || currentStep >= reconstructionStages.length - 1) {
      startStep = 1;
      setCurrentStep(1);
    }
    isPlayingRef.current = true;
    setIsPlaying(true);
    triggerStagePlayback(startStep);
  };

  const handlePauseVideo = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsPaused(true);
    clearAdvanceTimer();
    pauseNarration();
  };

  const handleResumeVideo = () => {
    unlockAudio();
    clearAdvanceTimer();
    setIsPaused(false);
    isPlayingRef.current = true;
    setIsPlaying(true);

    if (voiceAudio && isSpeaking) {
      const didResume = resumeNarration();
      if (!didResume) {
        triggerStagePlayback(currentStep || 1);
      }
    } else {
      scheduleNextStage(900);
    }
  };

  const handleResetVideo = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsPaused(false);
    clearAdvanceTimer();
    stopNarration();
    setIsSpeaking(false);
    setCurrentStep(0);
    setProgressPercent(0);
  };

  const handleScrub = (index) => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsPaused(false);
    clearAdvanceTimer();
    stopNarration();
    unlockAudio();
    setCurrentStep(index);
    setProgressPercent(((index) / (reconstructionStages.length - 1)) * 100);
    triggerStagePlayback(index);
  };

  const handleTestAudio = () => {
    unlockAudio();
    playStageChime();
    setAudioTestStatus('Testing...');
    speakNarration('CrimeNexus audio system online. Indian English forensic synthesizer active for Case 018 Gurugram heist.', {
      speed: 1,
      onStart: () => {
        setIsSpeaking(true);
        setAudioTestStatus('Playing');
      },
      onEnd: () => {
        setIsSpeaking(false);
        setAudioTestStatus('OK');
        setTimeout(() => setAudioTestStatus(null), 2500);
      },
      onError: () => {
        setIsSpeaking(false);
        setAudioTestStatus('Error');
        setTimeout(() => setAudioTestStatus(null), 2500);
      }
    });
  };

  // Wikipedia hover helper dictionary
  const evidenceEntities = {
    'EVD-001': {
      title: 'Police FIR 0018/2026',
      type: 'Police Complaint',
      docId: 'Cyber Crime Police Station',
      snippet: 'Official police complaint filed by CFO Vikramaditya Rathore after ₹1 Crore was stolen via a fake CEO email.',
      status: 'Official Record'
    },
    'EVD-002': {
      title: 'Bank Alert Report STR-88912',
      type: 'Bank Alert',
      docId: 'Financial Intelligence Unit',
      snippet: 'Bank alert showing ₹50 Lakhs moved from broker Devrat Sharma to Mumbai shell company Apex Trade Solutions.',
      status: 'Verified Transfer'
    },
    'EVD-003': {
      title: 'Tower 4401 Phone Location Records',
      type: 'Phone Records',
      docId: 'Sector 44, Gurugram',
      snippet: 'Mobile tower records proving Rajesh Verma was near the crime location at the time of the heist.',
      status: 'Location Proved'
    },
    'ACC-1001': {
      title: 'Zenith Tech Bank Account',
      type: 'Victim Account',
      docId: 'Apex Global Bank',
      snippet: 'Company account from which ₹1 Crore was stolen using the fake approval link.',
      status: '₹1 Crore Stolen'
    },
    'ACC-2201': {
      title: 'Suman Roy Bank Account',
      type: 'Mule Account',
      docId: 'Royal Crest Bank',
      snippet: 'The first account that received the stolen ₹1 Crore before splitting it into 5 smaller accounts.',
      status: 'Frozen by Police'
    },
    'ACC-7701': {
      title: 'Apex Trade Solutions Account',
      type: 'Fake Company Account',
      docId: 'Nariman Point, Mumbai',
      snippet: 'Fake company account in Mumbai that received ₹50 Lakhs and links this case to the Mumbai investigation.',
      status: 'Account Frozen'
    },
    'PER-103': {
      title: 'Devrat Sharma',
      type: 'Money Broker',
      docId: 'Alias: Broker D',
      snippet: 'The money broker who transferred cash from Delhi to Mumbai to help hide the stolen money.',
      status: 'Prime Suspect'
    },
    'TXN_552': {
      title: 'Transfer TXN_552 (₹50 Lakhs)',
      type: 'Bank Transfer',
      docId: 'RTGS Transfer #552',
      snippet: '₹50 Lakhs transferred from Devrat Sharma to Apex Trade Solutions, linking Case 018 to Case 041.',
      status: 'Cross-Case Link'
    },
    'DOMAIN-AUTH': {
      title: 'Fake Login Page',
      type: 'Phishing Website',
      docId: 'secure-zenithcorp-auth.com',
      snippet: 'Fake website made by hackers to trick Vikramaditya and steal his password and OTP.',
      status: 'Blocked by Police'
    },
    'PER-108': {
      title: 'Vikramaditya Rathore',
      type: 'CFO (Victim)',
      docId: 'Chief Financial Officer',
      snippet: 'Victim who received the fake CEO email and reported the ₹1 Crore theft to the police.',
      status: 'Victim'
    }
  };

  const handleWikiHover = (e, key) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 210;

    // Viewport spatial awareness (flips upwards if near bottom of screen/taskbar)
    let y = rect.bottom + 8;
    if (rect.bottom + tooltipHeight > window.innerHeight - 10) {
      y = Math.max(10, rect.top - tooltipHeight - 8);
    }

    let x = rect.left;
    if (x + tooltipWidth > window.innerWidth - 16) {
      x = Math.max(16, window.innerWidth - tooltipWidth - 16);
    }

    setTooltipPos({ x, y });
    setActiveTooltip(evidenceEntities[key]);
  };

  const handleWikiLeave = () => {
    setActiveTooltip(null);
  };

  // Prime suspects for this case
  const primeSuspects = RAW_DATASET.people.filter(p => 
    p.primary_case_id === caseId || (p.is_bridge && (caseId === 'CASE-018' || caseId === 'CASE-041'))
  );

  // Laws broken mapping for this case (Articles, simple reason why violated, and evidence)
  const lawsBroken = [
    {
      id: 'SEC-66C',
      act: 'Information Technology Act, 2000',
      actShort: 'IT Act, 2000',
      section: 'Section 66C',
      title: 'Punishment for Identity Theft',
      simpleWhy: 'Hackers stole CFO Vikramaditya\'s corporate password and OTP token using a spoofed executive email and fake login site.',
      penalty: 'Imprisonment up to 3 years and fine up to ₹1,00,000',
      description: 'Fraudulent capture and unauthorized use of electronic signature, password, and corporate 2FA authentication credentials of CFO Vikramaditya Rathore to access Zenith corporate banking portal.',
      evidenceRef: 'EVD-001 (Phishing domain secure-zenithcorp-auth.com logs)',
      evidenceDoc: 'Phishing Server Access Logs, Captured POST Credentials & Forensic IP Trails',
      evidenceHash: 'SHA256: d4c56ad10356cf2cc8ddfdc26fd4c04f... (Verified Police Cyber Cell)',
      suspects: ['Kunal Shah (Technical Operator)', 'Rajesh Verma (Syndicate Leader)'],
    },
    {
      id: 'SEC-66D',
      act: 'Information Technology Act, 2000',
      actShort: 'IT Act, 2000',
      section: 'Section 66D',
      title: 'Cheating by Personation using Computer Resource',
      simpleWhy: 'The scammers impersonated Zenith CEO Rajiv Singhania in a forged email to trick the CFO into clearing emergency vendor funds.',
      penalty: 'Imprisonment up to 3 years and fine up to ₹1,00,000',
      description: 'Cheating by personating executive corporate management via forged email headers (RFC-822 Return-Path spoofing) to induce fraudulent corporate fund clearance.',
      evidenceRef: 'EVD-001 (Spoofed email artifacts & IP 198.51.100.45)',
      evidenceDoc: 'RFC-822 Email Header Dump, Spoofed Mail Server Connection Records & VPN Logs',
      evidenceHash: 'SHA256: a89f0102cd3e9942bb11005a77ef9102... (Seized Digital Exhibit)',
      suspects: ['Rajesh Verma (Operator)', 'Kunal Shah (Technical Operator)'],
    },
    {
      id: 'SEC-318-4',
      act: 'Bharatiya Nyaya Sanhita (BNS), 2023',
      actShort: 'BNS, 2023',
      section: 'Section 318(4)',
      title: 'Cheating and Dishonestly Inducing Delivery of Property',
      simpleWhy: 'Dishonestly tricked the company into executing an unauthorized ₹1,00,00,000 (One Crore) RTGS wire into mule bank accounts.',
      penalty: 'Rigorous imprisonment up to 7 years and fine',
      description: 'Dishonestly inducing Zenith Technologies to part with ₹1,00,00,000 RTGS fund transfer into mule bank account ACC-2201 under fraudulent pretexts.',
      evidenceRef: 'EVD-001 & Core Banking Transaction TXN-1001',
      evidenceDoc: 'Apex Global Bank Core RTGS Transfer Slip (UTR: APEX202606090011) & Ledger Debit Records',
      evidenceHash: 'SHA256: 3c91a0f882b45012da779e0011244bb5... (Core Banking Record)',
      suspects: ['Suman Roy (Primary Mule Accountholder)', 'Rajesh Verma (Syndicate Leader)'],
    },
    {
      id: 'SEC-61-2',
      act: 'Bharatiya Nyaya Sanhita (BNS), 2023',
      actShort: 'BNS, 2023',
      section: 'Section 61(2)',
      title: 'Criminal Conspiracy',
      simpleWhy: 'Technical developers, syndicate operators, and money brokers coordinated together across cities to execute wire fraud.',
      penalty: 'Same punishment as for the abetment of the principal offence',
      description: 'Criminal agreement, phone call coordination, and joint criminal planning between technical operators (Kunal Shah), syndicate heads (Rajesh Verma), and money brokers (Devrat Sharma) to carry out the heist and distribute stolen proceeds.',
      evidenceRef: 'EVD-003 (Nodal Tower T-4401 CDR Call Dump Logs)',
      evidenceDoc: 'Sector 44 Gurugram Cell Tower Telephony CDR Dump, Inter-Suspect Call Records & SIM Box Logs',
      evidenceHash: 'SHA256: ccfb08874fc7038d541678894b70eee7... (Telecom CDR Exhibit)',
      suspects: ['Rajesh Verma', 'Devrat Sharma (Broker)', 'Kunal Shah'],
    },
    {
      id: 'SEC-PMLA',
      act: 'Prevention of Money Laundering Act (PMLA), 2002',
      actShort: 'PMLA, 2002',
      section: 'Section 3 & Section 4',
      title: 'Offence of Money-Laundering & Layering',
      simpleWhy: 'Rapidly split the ₹1 Crore into 5 secondary accounts and wired ₹50 Lakhs to Mumbai to conceal the criminal origin of the money.',
      penalty: 'Rigorous imprisonment up to 7 to 10 years and fine',
      description: 'Direct involvement in laundering and layering proceeds of crime from primary mule account ACC-2201 across 5 secondary student accounts, onwards to money broker Devrat Sharma, and cross-case bridge transfer TXN_552 to Mumbai shell company Apex Trade Solutions.',
      evidenceRef: 'EVD-002 (STR-88912 & Cross-Case Bridge TXN_552)',
      evidenceDoc: 'FIU-IND Suspicious Transaction Report STR-88912, Cross-Case Wire TXN_552 & SWIFT MT-103 Logs',
      evidenceHash: 'SHA256: afeb4ed06feb8f55c8a7028172dec410... (FIU-IND Financial Trail)',
      suspects: ['Devrat Sharma (Broker)', 'Apex Trade Solutions (Case 041 Shell)', 'Tariq Merchant (Hawala)'],
    }
  ];

  // Dossier details for inspect drawer

  const entityDossierDetails = {
    'PER-108': {
      name: 'Vikramaditya Rathore',
      alias: 'Victim CFO',
      category: 'Victim',
      categoryVariant: 'green',
      status: 'Verified Victim',
      role: 'Chief Financial Officer (CFO) at Zenith Technologies',
      location: 'DLF Phase 5, Gurugram, Haryana',
      phone: '+91 98100 11808',
      idNumber: 'PAN: VRTPR8821Z • Laptop IP: 10.0.4.12',
      deviceIp: 'Corporate Laptop (MacBook Pro)',
      riskLevel: '0% (Victim — No Blame)',
      riskScore: 10,
      whatHappened: 'Received a fake email pretending to be from his CEO Rajiv Singhania asking to approve an urgent vendor bill. When he clicked the link to clear the payment, hackers stole his password and OTP, and immediately transferred ₹1 Crore out of Zenith\'s bank account.',
      legalEvidence: 'Police FIR 0018/2026 & Email Headers',
      actionTaken: 'Reported to police immediately. Statement recorded and computer checked by forensics.'
    },
    'ACC-1001': {
      name: 'Zenith Tech Bank Account',
      alias: 'Victim Company Account',
      category: 'Target Account',
      categoryVariant: 'teal',
      status: '₹1 Crore Stolen',
      role: 'Official Company Account of Zenith Technologies',
      location: 'Apex Global Bank, Cyber City, Gurugram',
      phone: 'Signatory: Vikramaditya Rathore',
      idNumber: 'A/C: 001199884401 • IFSC: APEX0001044',
      deviceIp: 'NetBanking Gateway',
      riskLevel: 'Company Account (Victim)',
      riskScore: 15,
      whatHappened: '₹1,00,00,000 (One Crore) was stolen directly from this account on June 9, 2026 at 2:10 PM. Hackers used the stolen OTP to send the entire sum to Suman Roy\'s bank account.',
      legalEvidence: 'Bank transfer slip TXN-1001 (UTR: APEX202606090011)',
      actionTaken: 'Recall request submitted to RBI to stop and recover the stolen money.'
    },
    'ACC-2201': {
      name: 'Suman Roy Bank Account',
      alias: 'First Mule Account',
      category: 'Mule Account',
      categoryVariant: 'red',
      status: 'Frozen by Police',
      role: 'First bank account where the stolen ₹1 Crore landed',
      location: 'Royal Crest Bank, Sector 14, Gurugram',
      phone: 'Linked Mobile: +91 98110 04455',
      idNumber: 'A/C: 9988220144 • Registered to: Suman Roy',
      deviceIp: 'Mobile Banking (IP: 198.51.100.45)',
      riskLevel: 'Crime Account (92% Risk)',
      riskScore: 92,
      whatHappened: 'The stolen ₹1 Crore arrived here first from Zenith. Within 25 minutes, this account quickly split the ₹1 Crore into 5 smaller transfers of ₹20 Lakhs each so the bank wouldn\'t detect fraud or freeze the funds.',
      legalEvidence: 'Bank statement & transfer alert STR-44102',
      actionTaken: 'Frozen by cyber police. Remaining balance of ₹1.2 Lakhs seized.'
    },
    'PER-104': {
      name: 'Suman Roy',
      alias: 'Mule Accountholder',
      category: 'Mule Suspect',
      categoryVariant: 'brass',
      status: 'Arrested (In Police Custody)',
      role: 'Rented his bank account to the gang for ₹50,000',
      location: 'Old Railway Road, Gurugram, Haryana',
      phone: '+91 98110 04455 (Vi Prepaid)',
      idNumber: 'PAN: SMRPS1122M • Redmi Note 11',
      deviceIp: 'Phone: Redmi Note 11',
      riskLevel: 'High Risk (75%)',
      riskScore: 75,
      whatHappened: 'Agreed to rent out his bank account to Rajesh Verma in exchange for ₹50,000. Handed over his debit card, net banking login, and SIM card to the gang so they could receive and move the stolen money.',
      legalEvidence: 'Confession, signed bank opening forms, seized SIM card',
      actionTaken: 'Arrested on June 12, 2026. Currently in 7-day police custody.'
    },
    'ACC-MULES': {
      name: '5 Secondary Mule Accounts',
      alias: '5 Layering Accounts',
      category: 'Mule Accounts',
      categoryVariant: 'teal',
      status: '3 Frozen / 2 Emptied',
      role: '5 bank accounts used to split and hide the ₹1 Crore',
      location: 'Banks in Faridabad, Noida, and South Delhi',
      phone: 'Managed by sub-mule network (Meera Nair & others)',
      idNumber: 'Accounts: ACC-3301, 4402, 5503, 6604, 8809',
      deviceIp: 'Layering IPs routed through Gurugram SIM box',
      riskLevel: 'High Risk (84%)',
      riskScore: 84,
      whatHappened: 'Received ₹20 Lakhs each from Suman Roy. They quickly sent ₹70 Lakhs to broker Devrat Sharma, and withdrew ₹10 Lakhs in cash from ATMs in Faridabad and Noida.',
      legalEvidence: 'Bank transfer slips TXN-1002 to 1007 & ATM CCTV footage',
      actionTaken: '3 accounts frozen by police. ₹18.5 Lakhs recovered.'
    },
    'PER-101': {
      name: 'Rajesh Verma',
      alias: 'Gang Leader ("Viper")',
      category: 'Mastermind',
      categoryVariant: 'red',
      status: 'Wanted (Arrest Warrant Issued)',
      role: 'Planned and ran the entire scam gang',
      location: 'Sector 45, Gurugram (Currently on the run)',
      phone: '+91 98110 01122 • PAN: ABCPV9012K',
      idNumber: 'Passport: Z-9921404 • Laptop: ThinkPad X1',
      deviceIp: 'ProtonVPN & Tor Exit Nodes',
      riskLevel: 'Critical Threat (94%)',
      riskScore: 94,
      whatHappened: 'The mastermind of the entire scam. Hired Kunal Shah to build the fake website, arranged mule accounts through Suman Roy, and told broker Devrat Sharma where to send the money. Mobile tower data caught him coordinating the theft in Gurugram.',
      legalEvidence: 'Telegram chats, phone records & mobile tower dump T-4401',
      actionTaken: 'Arrest warrant issued by court. Airport lookout notices issued to stop him leaving India.'
    },
    'LOC-101': {
      name: 'Cell Tower T-4401',
      alias: 'Sector 44 Mobile Tower',
      category: 'Cell Tower',
      categoryVariant: 'violet',
      status: 'Call Records Verified',
      role: 'Mobile phone tower in Sector 44, Gurugram',
      location: 'Sector 44, Gurugram (Near Cyber Hub)',
      phone: 'Carriers: Airtel, Jio, and Vi',
      idNumber: 'Tower ID: DEL-GUR-T4401',
      deviceIp: 'Telecom Nodal Switch',
      riskLevel: 'Key Evidence Location',
      riskScore: 60,
      whatHappened: 'Captured 14 phone calls between gang leader Rajesh Verma, coder Kunal Shah, and mule Suman Roy right when the ₹1 Crore was stolen, proving they were working together.',
      legalEvidence: 'Official telecom call dump logs (EVD-003)',
      actionTaken: 'Call records verified by telecom company and submitted as court evidence.'
    },
    'PER-102': {
      name: 'Kunal Shah',
      alias: 'The Coder ("Coder K")',
      category: 'Hacker',
      categoryVariant: 'red',
      status: 'Arrested (In Jail)',
      role: 'Built the fake login website to steal passwords',
      location: 'Sector 62, Noida, Uttar Pradesh',
      phone: '+91 98110 02233 • PAN: KSHPK4410P',
      idNumber: 'Server IP: 198.51.100.45 • GitHub dev-kunal-ops',
      deviceIp: 'Phishing Server IP 198.51.100.45',
      riskLevel: 'High Risk (88%)',
      riskScore: 88,
      whatHappened: 'Created the fake website secure-zenithcorp-auth.com that copied Zenith\'s real login page. His computer code captured the CFO\'s password and OTP in real time.',
      legalEvidence: 'Website code, server files, 2 seized laptops and crypto wallets',
      actionTaken: 'Arrested at his Noida flat on June 15, 2026. Currently in jail.'
    },
    'PER-103': {
      name: 'Devrat Sharma',
      alias: 'Broker D / The Accountant',
      category: 'Money Broker (Bridge)',
      categoryVariant: 'violet',
      status: 'Prime Target (Under Police Watch)',
      role: 'Money broker connecting North India scam to Mumbai hawala',
      location: 'Panchsheel Enclave, Delhi & Nariman Point, Mumbai',
      phone: '+91 98110 03344 • PAN: DSRPS3311L',
      idNumber: 'Broker Account: ACC-7702',
      deviceIp: 'Encrypted Signal App @broker_d',
      riskLevel: 'Critical Link (96%)',
      riskScore: 96,
      whatHappened: 'The vital link between the cyber gang and hawala money launderers. Collected ₹70 Lakhs from the mule accounts, and sent ₹50 Lakhs directly to Mumbai company Apex Trade Solutions (TXN_552), linking this case to Mumbai Case 041.',
      legalEvidence: 'Bank transfer slip TXN_552 & financial intelligence report STR-88912',
      actionTaken: 'Bank accounts frozen. Put under 24/7 technical surveillance.'
    },
    'ACC-7701': {
      name: 'Apex Trade Solutions Pvt Ltd',
      alias: 'Mumbai Fake Company Account',
      category: 'Front Company',
      categoryVariant: 'violet',
      status: 'Company Raided & Frozen',
      role: 'Fake company used to wash stolen money in Mumbai',
      location: 'Mittal Towers, Nariman Point, Mumbai',
      phone: 'Director: Anita D\'Souza (+91 98220 07788)',
      idNumber: 'A/C: 4455770199 • CIN: U51909MH2024PTC99214',
      deviceIp: 'Office IP: 203.0.113.88',
      riskLevel: 'High Risk (90%)',
      riskScore: 90,
      whatHappened: 'A fake company with no real business. Received ₹50 Lakhs from Devrat Sharma, and sent ₹45 Lakhs to hawala cash operator Tariq Merchant within 2 hours disguised as a payment for raw silk.',
      legalEvidence: 'Fake silk bills & financial report STR-88912',
      actionTaken: 'Office raided by Mumbai police. Bank accounts frozen and company license suspended.'
    },
    'PER-105': {
      name: 'Tariq Merchant',
      alias: 'Goldman',
      category: 'Hawala Operator',
      categoryVariant: 'red',
      status: 'Wanted (Arrest Warrant Issued)',
      role: 'Hawala cash broker who sends money overseas',
      location: 'Zaveri Bazaar & Bandra West, Mumbai',
      phone: '+91 98220 05566 • PAN: TMKPM9901A',
      idNumber: 'UAE Trade Reg: DXB-2024-8812',
      deviceIp: 'Encrypted phone on Dubai roaming',
      riskLevel: 'Critical Target (92%)',
      riskScore: 92,
      whatHappened: 'Took ₹45 Lakhs from Apex Trade Solutions, bought gold credits, and wired the money overseas through SWIFT to an offshore bullion account in Dubai.',
      legalEvidence: 'Cash chits from Zaveri Bazaar raid & SWIFT foreign wire receipts',
      actionTaken: 'Arrest warrant issued by Mumbai court. Overseas travel alert active.'
    },
    'ACC-7705': {
      name: 'Dubai Bullion Trading Account',
      alias: 'Overseas Account',
      category: 'Offshore Account',
      categoryVariant: 'teal',
      status: 'Overseas Freeze Requested',
      role: 'Final bank account in Dubai where the stolen money ended up',
      location: 'Emirates National Bank, Deira Branch, Dubai, UAE',
      phone: 'Agent: Farooq Sheikh (+971 50 123 4567)',
      idNumber: 'IBAN: AE982001190244109822 • SWIFT: EBILAEAD',
      deviceIp: 'Dubai Financial Gateway',
      riskLevel: 'Offshore Destination (86%)',
      riskScore: 86,
      whatHappened: 'The final destination outside India. Money was converted into gold bullion contracts to hide who truly owns it and prevent Indian police from recovering it.',
      legalEvidence: 'SWIFT wire confirmation MT-103',
      actionTaken: 'Govt sent formal international request (MLAT) to UAE authorities to freeze funds.'
    }
  };

  const selectedNodeData = selectedMapNode 
    ? allGraphNodes.find(n => n.id === selectedMapNode)
    : null;

  const selectedSuspectInfo = selectedNodeData
    ? primeSuspects.find(s => s.person_id === selectedNodeData.id)
    : null;

  const connectedEdgesCount = selectedMapNode
    ? allGraphEdges.filter(e => e.from === selectedMapNode || e.to === selectedMapNode).length
    : 0;

  // Calculate container pixel coordinates for placing the expanded card directly over the entity
  const getNodeContainerPos = (node) => {
    if (!graphContainerRef.current || !node) return { left: 100, top: 50, cardW: 355, cardH: 295 };
    const rect = graphContainerRef.current.getBoundingClientRect();
    const containerW = rect.width || 750;
    const containerH = rect.height || 400;

    const scale = Math.min(containerW / 1180, containerH / 440);
    const offsetX = (containerW - 1180 * scale) / 2;
    const offsetY = (containerH - 440 * scale) / 2;

    const cx = 590;
    const cy = 220;
    const transformedX = cx + (node.x - cx) * graphZoom + graphPan.x;
    const transformedY = cy + (node.y - cy) * graphZoom + graphPan.y;

    const pixelX = offsetX + transformedX * scale;
    const pixelY = offsetY + transformedY * scale;

    const cardW = 355;
    const cardH = 295;

    let left = pixelX - cardW / 2;
    let top = pixelY - cardH / 2;

    // Clamping within container boundaries with 10px margin
    if (left < 10) left = 10;
    if (left + cardW > containerW - 10) left = Math.max(10, containerW - cardW - 10);
    if (top < 10) top = 10;
    if (top + cardH > containerH - 10) top = Math.max(10, containerH - cardH - 10);

    return { left, top, cardW, cardH };
  };

  return (
    <div className="max-w-7xl mx-auto py-5 px-4 space-y-5 font-sans">
      
      {/* Top Header Card (Shadcn-style unopinionated dossier container) */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Button
              onClick={onBack}
              variant="secondary"
              size="sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C68A46]" />
              <span>Back</span>
            </Button>
            <div className="h-4 w-px bg-[#2B313D]" />
            <Badge variant="brass">
              {caseData.case_id}
            </Badge>
            <span className="text-xs font-mono text-[#6B7382]">
              {caseData.case_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsBsaModalOpen(true)}
              variant="secondary"
              size="default"
              className="text-[#5FA876] hover:text-[#5FA876]"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Sec 63B BSA Certificate</span>
            </Button>

            <Button
              onClick={() => onAskCopilot(`Provide a complete executive summary of ${caseData.case_id}`)}
              variant="brass"
              size="default"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Copilot</span>
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-serif font-bold text-[#E8EAEE] tracking-tight">{caseData.title}</h1>
          <p className="text-xs text-[#9AA3B2] mt-0.5">
            Category: <strong className="text-[#E8EAEE]">{caseData.category}</strong> &bull; Jurisdiction: <strong className="text-[#C68A46]">{caseData.region_name}</strong> &bull; Registered: <span className="font-mono text-[#6B7382]">{caseData.registration_date}</span>
          </p>
        </div>

        {/* Minimal Officer Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-[#2B313D] text-xs">
          <div>
            <span className="text-[#6B7382] block text-[11px] font-mono">LEAD OFFICER</span>
            <span className="font-medium text-[#E8EAEE] mt-0.5 block">{caseData.investigator_name}</span>
          </div>
          <div>
            <span className="text-[#6B7382] block text-[11px] font-mono">STATUS</span>
            <span className="font-medium text-[#C68A46] mt-0.5 block">{caseData.status}</span>
          </div>
          <div>
            <span className="text-[#6B7382] block text-[11px] font-mono">EVIDENCE FILES</span>
            <span className="font-medium text-[#5FA876] mt-0.5 block">{caseData.stats.evidence} Verified Records</span>
          </div>
          <div>
            <span className="text-[#6B7382] block text-[11px] font-mono">CROSS-CASE LINK</span>
            <span className="font-medium text-[#8B81C4] mt-0.5 block">Bridge to CASE-041 (TXN_552)</span>
          </div>
        </div>
      </Card>

      {/* ========================================================= */}
      {/* WORKSPACE SUB-TABS NAVIGATION BAR                         */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B313D] pb-3">
        <TabsList className="bg-[#181C24]">
          <TabsTrigger 
            isActive={activeTab === 'summary'} 
            onClick={() => setActiveTab('summary')}
            className="flex items-center gap-2"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Summary &amp; Entity Graph</span>
          </TabsTrigger>
          <TabsTrigger 
            isActive={activeTab === 'suspects'} 
            onClick={() => setActiveTab('suspects')}
            className="flex items-center gap-2"
          >
            <User className="w-3.5 h-3.5" />
            <span>Prime Suspects</span>
            <Badge variant="brass" className="ml-1 px-1.5 py-0 text-[10px] leading-tight">
              {primeSuspects.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            isActive={activeTab === 'reconstruction'} 
            onClick={() => setActiveTab('reconstruction')}
            className="flex items-center gap-2"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Review Investigation</span>
          </TabsTrigger>
          <TabsTrigger 
            isActive={activeTab === 'statutes'} 
            onClick={() => setActiveTab('statutes')}
            className="flex items-center gap-2"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Statutory Offences</span>
            <Badge variant="green" className="ml-1 px-1.5 py-0 text-[10px] leading-tight">
              {lawsBroken.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: SUMMARY & INTERACTIVE ENTITY GRAPH (SPLIT 2-COL) */}
      {/* ========================================================= */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT COLUMN: ZOOMABLE INTERACTIVE ENTITY GRAPH (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-3">
            <Card className="p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2B313D] pb-2.5">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#C68A46]" />
                  <h2 className="text-sm font-serif font-bold text-[#E8EAEE] tracking-wide">Interactive Entity Graph Map</h2>
                </div>

                {/* Canvas Zoom & Pan Controls */}
                <div className="flex items-center gap-1.5 bg-[#1F2430] border border-[#2B313D] p-1 rounded-[4px] text-xs font-mono">
                  <button
                    onClick={handleZoomOut}
                    className="p-1 rounded-[3px] text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#282F3F] transition"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 text-[11px] text-[#C68A46] font-semibold min-w-[42px] text-center">
                    {Math.round(graphZoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1 rounded-[3px] text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#282F3F] transition"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3.5 bg-[#2B313D] mx-0.5" />
                  <button
                    onClick={handleResetZoom}
                    className="px-2 py-0.5 rounded-[3px] text-[10px] text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#282F3F] transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Legend Strip */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#6B7382]">
                <span className="flex items-center gap-1.5 text-[#9AA3B2]">
                  <span className="w-2 h-2 rounded-full bg-[#6C93B8]" /> Person / Info
                </span>
                <span className="flex items-center gap-1.5 text-[#9AA3B2]">
                  <span className="w-2 h-2 rounded-full bg-[#4E9C93]" /> Account / Mule
                </span>
                <span className="flex items-center gap-1.5 text-[#8B81C4] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#8B81C4]" /> Cross-Case Link
                </span>
              </div>

              {/* Zoomable / Pannable SVG Canvas Container */}
              <div 
                ref={graphContainerRef}
                className="bg-[#12151B] border border-[#2B313D] rounded-[5px] h-[400px] relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
                style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
                onMouseDown={handleGraphMouseDown}
                onMouseMove={handleGraphMouseMove}
                onMouseUp={handleGraphMouseUp}
                onMouseLeave={handleGraphMouseUp}
              >
                <svg className="w-full h-full" viewBox="0 0 1180 440" preserveAspectRatio="xMidYMid meet">
                  <g 
                    transform={`translate(${graphPan.x}, ${graphPan.y}) scale(${graphZoom})`}
                    style={{ 
                      transformOrigin: '590px 220px', 
                      transition: isDraggingGraph ? 'none' : 'transform 0.1s ease-out' 
                    }}
                  >
                    {/* Render Connecting Lines with Anti-Collision Mid-Stroke Badges */}
                    {allGraphEdges.map((edge, i) => {
                      const srcNode = allGraphNodes.find(n => n.id === edge.from);
                      const tgtNode = allGraphNodes.find(n => n.id === edge.to);
                      if (!srcNode || !tgtNode) return null;

                      const isHighlighted = selectedMapNode 
                        ? (selectedMapNode === srcNode.id || selectedMapNode === tgtNode.id) 
                        : true;
                      const opacity = isHighlighted ? 1 : 0.22;
                      const midX = (srcNode.x + tgtNode.x) / 2;
                      const midY = (srcNode.y + tgtNode.y) / 2;
                      const labelWidth = Math.max(54, edge.label.length * 6.2 + 14);

                      return (
                        <g key={i} style={{ opacity, transition: 'opacity 0.2s' }}>
                          <line
                            x1={srcNode.x}
                            y1={srcNode.y}
                            x2={tgtNode.x}
                            y2={tgtNode.y}
                            stroke={edge.color}
                            strokeWidth={edge.strokeWidth || 1.6}
                            strokeOpacity={0.75}
                            className={edge.animated ? 'animated-stream' : ''}
                          />
                          {/* Dedicated opaque badge so lines and background never clash with text */}
                          <rect
                            x={midX - labelWidth / 2}
                            y={midY - 8}
                            width={labelWidth}
                            height={16}
                            rx={3}
                            fill="#12151B"
                            stroke="#2B313D"
                            strokeWidth="0.75"
                          />
                          <text
                            x={midX}
                            y={midY + 3.5}
                            textAnchor="middle"
                            fill={edge.color}
                            fontSize="8.5"
                            fontFamily="IBM Plex Mono, monospace"
                            fontWeight="500"
                          >
                            {edge.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Render Clean Entity Nodes with Backdrops to Guarantee No Overwritten Text */}
                    {allGraphNodes.map((node) => {
                      const isSelected = selectedMapNode === node.id;
                      const NodeIcon = node.icon;
                      const r = node.isBridge ? 19 : 15;
                      const boxWidth = node.isBridge ? 112 : 98;

                      // When clicked, the entity becomes the card!
                      // Inside SVG, we render a subtle pulse anchor where connecting lines meet.
                      if (isSelected) {
                        return (
                          <g 
                            key={node.id} 
                            transform={`translate(${node.x}, ${node.y})`}
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMapNode(null); // Declick on re-click
                            }}
                          >
                            <circle r={8} fill="#C68A46" opacity="0.35" className="animate-ping" />
                            <circle r={5} fill="#C68A46" />
                          </g>
                        );
                      }

                      return (
                        <g 
                          key={node.id}
                          transform={`translate(${node.x}, ${node.y})`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMapNode(node.id);
                            playPinStamp();
                          }}
                          onMouseEnter={(e) => handleNodeHover(e, node)}
                          onMouseLeave={handleNodeLeave}
                          className="cursor-pointer group"
                        >
                          <circle
                            r={r}
                            fill="#181C24"
                            stroke={node.color}
                            strokeWidth={node.isBridge ? "2" : "1.5"}
                          />

                          <foreignObject 
                            x={node.isBridge ? -9 : -8} 
                            y={node.isBridge ? -9 : -8} 
                            width={node.isBridge ? 18 : 16} 
                            height={node.isBridge ? 18 : 16}
                            className="pointer-events-none"
                          >
                            <NodeIcon className="w-full h-full" style={{ color: node.color }} />
                          </foreignObject>

                          {/* Opaque backdrop pill behind text to ensure zero overwritten or obscured text */}
                          <rect
                            x={-boxWidth / 2}
                            y={r + 3}
                            width={boxWidth}
                            height={24}
                            rx={3}
                            fill="#12151B"
                            stroke="#2B313D"
                            strokeWidth="0.5"
                          />

                          <text
                            textAnchor="middle"
                            y={r + 13.5}
                            fill="#E8EAEE"
                            fontSize="9.5"
                            fontWeight="600"
                            fontFamily="IBM Plex Sans, sans-serif"
                          >
                            {node.label}
                          </text>
                          <text
                            textAnchor="middle"
                            y={r + 23}
                            fill="#6B7382"
                            fontSize="8"
                            fontFamily="IBM Plex Mono, monospace"
                          >
                            {node.sub}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* IN-PLACE EXPANDED ENTITY CARD: Click entity to become card, declick to return to entity */}
                <AnimatePresence>
                  {selectedNodeData && (() => {
                    const node = selectedNodeData;
                    const dossier = entityDossierDetails[node.id] || {
                      name: node.label,
                      alias: node.id,
                      category: node.type.toUpperCase(),
                      categoryVariant: node.isBridge ? 'violet' : 'brass',
                      status: 'Identified Network Entity',
                      role: node.sub,
                      location: 'NCR Cyber PS Jurisdiction',
                      phone: 'N/A',
                      idNumber: node.id,
                      riskLevel: 'Active Network Node',
                      riskScore: 50,
                      whatHappened: `Entity participating in topological flow of ${caseData.case_id}.`,
                      legalEvidence: 'FIR 0018/2026',
                      actionTaken: 'Under active case analysis'
                    };

                    const directConduits = allGraphEdges.filter(e => e.from === node.id || e.to === node.id);
                    const pos = getNodeContainerPos(node);

                    return (
                      <motion.div
                        key={`expanded-card-${node.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
                        className="absolute z-30 w-[355px] bg-[#181C24] border border-[#C68A46] rounded-[8px] p-3.5 space-y-2.5 text-xs shadow-2xl depth-floating select-text"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {/* Top Banner with Badges and Declick Button */}
                        <div className="flex items-center justify-between border-b border-[#2B313D] pb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={dossier.categoryVariant || 'brass'} className="text-[10px] px-2 py-0.5 font-mono">
                              {dossier.category}
                            </Badge>
                            <span className="text-[10.5px] font-mono text-[#5FA876] flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#5FA876]" />
                              {dossier.status}
                            </span>
                          </div>

                          {/* Declick button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMapNode(null);
                            }}
                            className="stamp-tag stamp-crimson hover:bg-[#8B2626] hover:text-[#F4EFE6] transition flex items-center gap-1 cursor-pointer"
                            title="Declick / Collapse back to entity"
                          >
                            <span className="text-[9.5px]">DECLICK</span>
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Name & Alias & Subtitle */}
                        <div>
                          <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
                            <h4 className="font-serif font-bold text-[#E8EAEE] text-sm tracking-tight">
                              {dossier.name}
                            </h4>
                            <span className="text-[11px] font-mono text-[#C68A46]">
                              "{dossier.alias}"
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9AA3B2] font-sans mt-0.5 leading-snug">
                            {dossier.role}
                          </p>
                        </div>

                        {/* 2-Column Meta Grid: LOCATION & IDENTIFIER */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#12151B] p-2 rounded-[5px] border border-[#2B313D]">
                          <div>
                            <span className="text-[#787167] block text-[9px] font-mono uppercase tracking-wider">LOCATION</span>
                            <span className="text-[#E8EAEE] block truncate mt-0.5 font-sans">{dossier.location}</span>
                          </div>
                          <div>
                            <span className="text-[#787167] block text-[9px] font-mono uppercase tracking-wider">IDENTIFIER</span>
                            <span className="text-[#6C93B8] font-mono block truncate mt-0.5">{dossier.idNumber}</span>
                          </div>
                        </div>

                        {/* WHAT HAPPENED Section */}
                        <div className="bg-[#1F2430] p-2.5 rounded-[5px] border border-[#2B313D] space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C68A46] font-bold tracking-wide">
                            <Info className="w-3.5 h-3.5 text-[#C68A46]" />
                            <span>WHAT HAPPENED</span>
                          </div>
                          <p className="text-[11px] text-[#E8EAEE] leading-relaxed font-sans line-clamp-4">
                            {dossier.whatHappened}
                          </p>
                        </div>

                        {/* Connected Conduits Quick Jump */}
                        {directConduits.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            <span className="text-[9.5px] font-mono text-[#787167] uppercase">LINKS:</span>
                            {directConduits.slice(0, 3).map((edge, idx) => {
                              const isOutgoing = edge.from === node.id;
                              const otherNodeId = isOutgoing ? edge.to : edge.from;
                              const otherNode = allGraphNodes.find(n => n.id === otherNodeId);
                              return (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMapNode(otherNodeId);
                                    playPinStamp();
                                  }}
                                  className="px-1.5 py-0.2 rounded bg-[#12151B] border border-[#2B313D] hover:border-[#C68A46] text-[9.5px] text-[#9AA3B2] hover:text-[#E8EAEE] flex items-center gap-1 transition"
                                  title={`Switch to ${otherNode?.label || otherNodeId}`}
                                >
                                  <strong className="text-[#E8EAEE]">{otherNode?.label || otherNodeId}</strong>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Footer Strip with Risk Index and Actions */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#787167] pt-1.5 border-t border-[#2B313D]">
                          <div>
                            Risk Index: <strong className={dossier.riskScore >= 80 ? 'text-[#C1655A]' : dossier.riskScore >= 40 ? 'text-[#C68A46]' : 'text-[#5FA876]'}>
                              {dossier.riskScore}%
                            </strong>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectEntity({
                                  person_id: node.id,
                                  name: dossier.name,
                                  role: dossier.role,
                                  is_bridge: node.isBridge
                                });
                              }}
                              className="text-[#C68A46] hover:text-[#D49855] text-[10.5px] font-medium underline underline-offset-2 flex items-center gap-0.5 transition"
                            >
                              <span>Full Dossier</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>

                            <span className="text-[#2B313D]">&bull;</span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMapNode(null);
                              }}
                              className="hover:text-[#E8EAEE] text-[10px] transition"
                              title="Declick back to entity"
                            >
                              Declick [✕]
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>

              {/* Spatial Floating Node Popover on Hover (Only when NO card is open!) */}
              <AnimatePresence>
                {hoveredNode && !selectedMapNode && (() => {
                  const dossier = entityDossierDetails[hoveredNode.id] || {
                    name: hoveredNode.label,
                    alias: hoveredNode.id,
                    category: hoveredNode.type.toUpperCase(),
                    categoryVariant: hoveredNode.isBridge ? 'violet' : 'steel',
                    status: 'Network Node',
                    role: hoveredNode.sub,
                    location: 'NCR Cyber Jurisdiction',
                    phone: 'N/A',
                    idNumber: hoveredNode.id,
                    riskScore: 50,
                    whatHappened: `Topological entity in ${caseData.case_id}.`
                  };

                  return (
                    <motion.div
                      key={hoveredNode.id}
                      initial={{ opacity: 0, y: nodeHoverPos.flipY ? 8 : -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      style={{ top: `${nodeHoverPos.y}px`, left: `${nodeHoverPos.x}px` }}
                      className="fixed z-50 w-[350px] bg-[#181C24] border border-[#C68A46] rounded-[6px] p-3.5 space-y-2.5 text-xs shadow-2xl pointer-events-none"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-[#2B313D] pb-1.5">
                        <Badge variant={dossier.categoryVariant || 'brass'} className="text-[10px] px-1.5 py-0.5">
                          {dossier.category}
                        </Badge>
                        <span className="text-[10px] font-mono text-[#5FA876] flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-[#5FA876]" />
                          {dossier.status}
                        </span>
                      </div>

                      {/* Name & Role */}
                      <div>
                        <div className="flex items-baseline justify-between gap-1">
                          <h4 className="font-serif font-bold text-[#E8EAEE] text-sm tracking-tight">
                            {dossier.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#C68A46]">
                            "{dossier.alias}"
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9AA3B2] font-mono mt-0.5">
                          {dossier.role}
                        </p>
                      </div>

                      {/* 2-Column Meta Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#12151B] p-2 rounded-[4px] border border-[#2B313D]">
                        <div>
                          <span className="text-[#6B7382] block text-[9px] font-mono uppercase">LOCATION</span>
                          <span className="text-[#E8EAEE] block truncate">{dossier.location}</span>
                        </div>
                        <div>
                          <span className="text-[#6B7382] block text-[9px] font-mono uppercase">IDENTIFIER</span>
                          <span className="text-[#6C93B8] font-mono block truncate">{dossier.idNumber}</span>
                        </div>
                      </div>

                      {/* Incident Narrative / What Happened snippet */}
                      <div className="bg-[#1F2430] p-2 rounded-[4px] border border-[#2B313D] space-y-1">
                        <span className="text-[10px] font-mono text-[#C68A46] font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3 text-[#C68A46]" />
                          WHAT HAPPENED
                        </span>
                        <p className="text-[11px] text-[#E8EAEE] leading-snug line-clamp-4">
                          {dossier.whatHappened}
                        </p>
                      </div>

                      {/* Footer info strip */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7382] pt-0.5 border-t border-[#2B313D]">
                        <span>Risk Index: <strong className={dossier.riskScore >= 80 ? 'text-[#C1655A]' : dossier.riskScore >= 40 ? 'text-[#C68A46]' : 'text-[#5FA876]'}>{dossier.riskScore}%</strong></span>
                        <span className="text-[#9AA3B2]">{dossier.category}</span>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </Card>
          </div>

          {/* RIGHT COLUMN: POINT-WISE CASE SUMMARY & INVESTIGATION BRIEFING (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-3">
            <Card className="p-5 space-y-3.5 relative">
              <div className="flex items-center justify-between border-b border-[#2B313D] pb-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C68A46]" />
                  <h2 className="text-sm font-serif font-bold text-[#E8EAEE] tracking-wide">Case Summary &amp; Briefing</h2>
                </div>
                <Badge variant="green">
                  Verified FIR
                </Badge>
              </div>

              {/* Point-wise natural readable chronological flow */}
              <div className="space-y-3 text-xs text-[#9AA3B2] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#C68A46] font-mono text-sm leading-none mt-0.5">•</span>
                  <p>
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'PER-108')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#6C93B8] font-semibold hover:underline cursor-pointer border-b border-[#6C93B8]/50"
                    >
                      CFO Vikramaditya Rathore
                    </span>{' '}
                    received an executive spoofing email on June 9, 2026 at 11:30 IST, purportedly from Zenith CEO Rajiv Singhania instructing urgent vendor clearance.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#C68A46] font-mono text-sm leading-none mt-0.5">•</span>
                  <p>
                    Then he was directed to duplicate phishing portal{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'DOMAIN-AUTH')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#6C93B8] hover:underline font-mono cursor-pointer border-b border-[#6C93B8]/50"
                    >
                      secure-zenithcorp-auth.com
                    </span>
                    , where rogue reverse proxy IP 198.51.100.45 intercepted his corporate 2FA authentication token.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#C68A46] font-mono text-sm leading-none mt-0.5">•</span>
                  <p>
                    Then an unauthorized RTGS debit of{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'ACC-1001')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#E8EAEE] font-semibold hover:underline cursor-pointer border-b border-[#E8EAEE]/50"
                    >
                      ₹1,00,00,000 (One Crore INR)
                    </span>{' '}
                    was executed from{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'ACC-1001')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#4E9C93] font-mono hover:underline cursor-pointer border-b border-[#4E9C93]/50"
                    >
                      Zenith Corporate Account ACC-1001
                    </span>{' '}
                    directly into primary mule account{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'ACC-2201')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#C1655A] font-mono hover:underline cursor-pointer border-b border-[#C1655A]/50"
                    >
                      ACC-2201 (Suman Roy)
                    </span>
                    , registered under police{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'EVD-001')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#5FA876] font-mono font-medium hover:underline cursor-pointer border-b border-[#5FA876]/50"
                    >
                      FIR 0018/2026 (EVD-001)
                    </span>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#C68A46] font-mono text-sm leading-none mt-0.5">•</span>
                  <p>
                    Then within 25 minutes, Suman Roy rapidly split the ₹1.0 Cr across 5 secondary student and shell accounts (ACC-3301 through ACC-8809) in ₹20L tranches to prevent automated banking AML freezes.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#C68A46] font-mono text-sm leading-none mt-0.5">•</span>
                  <p>
                    Then ₹70,00,000 was funneled into broker account ACC-7702 controlled by{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'PER-103')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#C68A46] font-semibold hover:underline cursor-pointer border-b border-[#C68A46]/50"
                    >
                      Devrat Sharma (PER-103, alias Broker D)
                    </span>
                    , while Cell Tower Dump{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'EVD-003')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#6C93B8] font-mono hover:underline cursor-pointer border-b border-[#6C93B8]/50"
                    >
                      T-4401 (EVD-003)
                    </span>{' '}
                    confirmed simultaneous telephony coordination with syndicate chief Rajesh Verma and technician Kunal Shah.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#C68A46] font-mono text-sm leading-none mt-0.5">•</span>
                  <p>
                    Then Devrat Sharma executed cross-case bridge transfer{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'TXN_552')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#8B81C4] font-mono font-semibold hover:underline cursor-pointer border-b border-[#8B81C4]/50"
                    >
                      TXN_552 (₹50,00,000)
                    </span>{' '}
                    into Mumbai shell front company{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'ACC-7701')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#8B81C4] font-mono hover:underline cursor-pointer border-b border-[#8B81C4]/50"
                    >
                      Apex Trade Solutions (ACC-7701)
                    </span>
                    , directly linking Case #018 with Case #041 under{' '}
                    <span
                      onMouseEnter={(e) => handleWikiHover(e, 'EVD-002')}
                      onMouseLeave={handleWikiLeave}
                      className="text-[#5FA876] font-mono font-medium hover:underline cursor-pointer border-b border-[#5FA876]/50"
                    >
                      FIU Advisory STR-88912 (EVD-002)
                    </span>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#C68A46] font-mono text-sm leading-none mt-0.5">•</span>
                  <p>
                    Then Apex Trade Solutions cashed out ₹45,00,000 to hawala operator Tariq Merchant, who wired the proceeds via international SWIFT transfer into Dubai Bullion Account ACC-7705.
                  </p>
                </div>
              </div>

              {/* Wikipedia Popover Tooltip with Framer Motion */}
              <AnimatePresence>
                {activeTooltip && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                    style={{ top: `${tooltipPos.y}px`, left: `${tooltipPos.x}px` }}
                    className="fixed z-50 w-80 bg-[#181C24] border border-[#2B313D] rounded-[5px] p-3.5 space-y-2 text-xs pointer-events-none shadow-none"
                  >
                    <div className="flex items-center justify-between border-b border-[#2B313D] pb-1.5">
                      <Badge variant="brass">
                        {activeTooltip.type}
                      </Badge>
                      <span className="text-[10px] font-mono text-[#5FA876] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {activeTooltip.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-[#E8EAEE] text-sm">{activeTooltip.title}</h4>
                      <p className="text-[11px] text-[#9AA3B2] font-mono mt-0.5">{activeTooltip.docId}</p>
                    </div>

                    <p className="text-[11px] text-[#9AA3B2] leading-snug bg-[#1F2430] p-2 rounded-[4px] border border-[#2B313D]">
                      "{activeTooltip.snippet}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: PRIME SUSPECTS ROSTER                          */}
      {/* ========================================================= */}
      {activeTab === 'suspects' && (
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#2B313D] pb-2.5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#C68A46]" />
              <h2 className="text-sm font-serif font-bold text-[#E8EAEE] tracking-wide">Prime Suspects Roster</h2>
            </div>
            <span className="text-xs font-mono text-[#6B7382]">
              {primeSuspects.length} Identified Persons of Interest
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SUSPECT IDENTITY</TableHead>
                <TableHead>ALIAS</TableHead>
                <TableHead>OPERATIONAL ROLE</TableHead>
                <TableHead>PHONE &amp; LOCATION</TableHead>
                <TableHead>PAN</TableHead>
                <TableHead>RISK INDEX</TableHead>
                <TableHead className="text-right">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {primeSuspects.map((suspect) => (
                <TableRow key={suspect.person_id}>
                  <TableCell className="font-medium text-[#E8EAEE]">
                    {suspect.name}
                  </TableCell>
                  <TableCell className="font-mono text-[#C68A46]">
                    "{suspect.alias}"
                  </TableCell>
                  <TableCell>
                    {suspect.is_bridge ? (
                      <Badge variant="violet">
                        {suspect.role} (Bridge Broker)
                      </Badge>
                    ) : (
                      suspect.role
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-[11px]">
                    <span className="text-[#E8EAEE] block">{suspect.phone}</span>
                    <span className="text-[#6B7382]">{suspect.location}</span>
                  </TableCell>
                  <TableCell className="font-mono text-[11px]">
                    {suspect.pan || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-semibold ${suspect.risk_score >= 90 ? 'text-[#C1655A]' : 'text-[#C68A46]'}`}>
                        {suspect.risk_score}%
                      </span>
                      <div className="w-16 bg-[#12151B] h-1.5 rounded-[2px] overflow-hidden border border-[#2B313D]">
                        <div 
                          className={`h-full ${suspect.risk_score >= 90 ? 'bg-[#C1655A]' : 'bg-[#C68A46]'}`}
                          style={{ width: `${suspect.risk_score}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => onSelectEntity(suspect)}
                      variant="secondary"
                      size="sm"
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: REVIEW INVESTIGATION (DYNAMIC GRAPH VIDEO)     */}
      {/* ========================================================= */}
      {activeTab === 'reconstruction' && (
        <Card className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B313D] pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#C68A46]" />
                <h2 className="text-sm font-serif font-bold text-[#E8EAEE] tracking-wide">Review Investigation</h2>
              </div>
              <p className="text-xs text-[#9AA3B2] mt-0.5">
                Chronological incident reconstruction and topological entity graph sequence.
              </p>
            </div>

            {/* Player Controls Bar */}
            <div className="flex items-center gap-1.5 bg-[#1F2430] border border-[#2B313D] p-1 rounded-[5px]">
              <button
                onClick={isPlaying ? handlePauseVideo : isPaused ? handleResumeVideo : handleStartVideo}
                className={`px-3 py-1 rounded-[4px] font-semibold text-xs transition flex items-center gap-1.5 ${
                  isPlaying
                    ? 'bg-[#C68A46] text-[#12151B]'
                    : isPaused
                    ? 'bg-[#8B2626] text-[#F4EFE6] hover:bg-[#A32E2E]'
                    : 'bg-[#C68A46] text-[#12151B] hover:bg-[#D49855]'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : isPaused ? 'Resume' : currentStep === 0 ? 'Play Reconstruction' : 'Resume'}</span>
              </button>

              <button
                onClick={handleResetVideo}
                className="p-1 rounded-[4px] bg-[#181C24] hover:bg-[#282F3F] text-[#9AA3B2] hover:text-[#E8EAEE] transition"
                title="Reset to Empty Board"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setVoiceAudio(!voiceAudio)}
                className={`p-1 rounded-[4px] border text-xs font-mono transition flex items-center gap-1 ${
                  voiceAudio ? 'bg-[#181C24] text-[#C68A46] border-[#2B313D]' : 'bg-[#181C24] text-[#6B7382] border-[#2B313D]'
                }`}
                title="Toggle Voice Narration"
              >
                {voiceAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline text-[11px]">{voiceAudio ? 'Voice ON' : 'Muted'}</span>
              </button>

              <button
                onClick={handleTestAudio}
                className={`px-2 py-1 rounded-[4px] border text-xs font-mono transition flex items-center gap-1 bg-[#181C24] border-[#2B313D] hover:border-[#C68A46] ${
                  audioTestStatus ? 'text-[#C68A46]' : 'text-[#9AA3B2]'
                }`}
                title="Test voice synthesis and procedural sound effects"
              >
                <Volume2 className="w-3 h-3" />
                <span className="text-[10.5px]">{audioTestStatus ? audioTestStatus : 'Test Voice'}</span>
              </button>

              <div className="flex items-center gap-0.5 px-1 text-xs font-mono">
                {[1, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-1.5 py-0.2 rounded-[3px] text-[10px] font-medium ${
                      playbackSpeed === s ? 'bg-[#C68A46] text-[#12151B] font-bold' : 'text-[#6B7382] hover:text-[#E8EAEE]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Progress Scrubber */}
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2">
              {reconstructionStages.slice(1).map((stg) => {
                const stageNum = stg.stageNumber;
                const isPast = stageNum < currentStep;
                const isCurrent = stageNum === currentStep;
                return (
                  <button
                    key={stg.stageNumber}
                    onClick={() => handleScrub(stageNum)}
                    className={`h-2 rounded-[3px] transition-all duration-200 text-left relative overflow-hidden ${
                      isCurrent
                        ? 'bg-[#C68A46] ring-2 ring-[#C68A46]/40 shadow-sm'
                        : isPast
                        ? 'bg-[#8B2626]'
                        : 'bg-[#1F2430] hover:bg-[#282F3F]'
                    }`}
                    title={`Stage ${stg.stageNumber}: ${stg.phaseTitle}`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              {currentStep === 0 ? (
                <div className="flex items-center gap-2">
                  <span className="stamp-tag stamp-brass px-1.5 py-0.5 text-[10px] font-bold">
                    BOARD CLEARED
                  </span>
                  <span className="font-semibold text-[#E8EAEE] tracking-wide font-sans text-xs">
                    Awaiting Investigation Recreation
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="stamp-tag stamp-crimson px-1.5 py-0.5 text-[10px] font-bold">
                    STAGE {currentStep} OF 6
                  </span>
                  <span className="font-semibold text-[#E8EAEE] tracking-wide font-sans text-xs">
                    {currentStage.phaseTitle}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-[11px] text-[#9AA3B2]">
                <span>Timestamp: <strong className="text-[#E8EAEE] font-mono">{currentStage.timestamp}</strong></span>
                <span>Exhibit: <strong className="text-[#C68A46] font-mono">{currentStage.evidence}</strong></span>
              </div>
            </div>
          </div>

          {/* Narration Subtitle Box with Voice Description */}
          <div className="bg-[#181C24] border border-[#2B313D] p-4 rounded-[5px] flex items-start gap-3 relative shadow-md">
            <div className="mt-1 shrink-0 flex items-center gap-1.5">
              {isSpeaking ? (
                <div className="flex items-center gap-0.5 h-4">
                  <span className="w-0.5 bg-[#C68A46] rounded-full wave-bar" />
                  <span className="w-0.5 bg-[#8B2626] rounded-full wave-bar" />
                  <span className="w-0.5 bg-[#F4EFE6] rounded-full wave-bar" />
                  <span className="w-0.5 bg-[#C68A46] rounded-full wave-bar" />
                </div>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-[#C68A46] block" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-[#787167]">
                <span>Narrated Sequence Dispatch &bull; {currentStep === 0 ? 'Ready' : `Phase ${currentStep}`}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#C68A46] bg-[#12151B] px-2 py-0.5 rounded border border-[#2B313D] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C68A46]" />
                    {getActiveVoiceDescription()}
                  </span>
                  {isPaused ? (
                    <span className="text-[#C1655A] bg-[#8B2626]/20 px-2 py-0.5 rounded border border-[#8B2626]/40 flex items-center gap-1 font-mono text-[10px]">
                      <Pause className="w-3 h-3 text-[#C1655A]" />
                      Paused
                    </span>
                  ) : isSpeaking && (
                    <span className="text-[#5FA876] flex items-center gap-1 font-mono text-[10px]">
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      Speaking
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-[#F4EFE6] leading-relaxed font-sans">
                "{currentStage.narration}"
              </p>
            </div>
          </div>

          {/* LIVE GRAPH RECONSTRUCTION CANVAS: Zoomable, Pannable, with In-Place Elements */}
          <div 
            ref={reconContainerRef}
            onMouseDown={handleReconMouseDown}
            onMouseMove={handleReconMouseMove}
            onMouseUp={handleReconMouseUp}
            onMouseLeave={handleReconMouseUp}
            className={`bg-[#12151B] border border-[#2B313D] rounded-[5px] p-2 min-h-[410px] relative overflow-hidden select-none ${
              isDraggingRecon ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Zoom Controls Toolbar */}
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-[#181C24]/95 backdrop-blur-sm border border-[#2B313D] p-1 rounded-[5px] text-xs font-mono shadow-lg">
              <button
                onClick={handleReconZoomOut}
                className="p-1 rounded-[3px] hover:bg-[#232834] text-[#9AA3B2] hover:text-[#E8EAEE] transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] text-[#C68A46] font-semibold min-w-[38px] text-center select-none">
                {Math.round(reconZoom * 100)}%
              </span>
              <button
                onClick={handleReconZoomIn}
                className="p-1 rounded-[3px] hover:bg-[#232834] text-[#9AA3B2] hover:text-[#E8EAEE] transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3.5 bg-[#2B313D] mx-0.5" />
              <button
                onClick={handleReconResetZoom}
                className="px-1.5 py-0.5 rounded-[3px] hover:bg-[#232834] text-[10px] text-[#9AA3B2] hover:text-[#E8EAEE] transition"
                title="Reset Zoom and Pan to Center"
              >
                Reset
              </button>
              <span className="hidden md:inline text-[9.5px] text-[#6B7382] border-l border-[#2B313D] pl-1.5 ml-0.5">
                Scroll to Zoom &bull; Drag to Pan
              </span>
            </div>

            {/* Stage & Count Status Badge */}
            <div className="absolute top-2.5 right-2.5 text-[10px] font-mono text-[#787167] bg-[#181C24]/95 backdrop-blur-sm px-2.5 py-1 rounded-[4px] border border-[#2B313D] z-10 flex items-center gap-2 shadow-lg">
              <span>{currentStep === 0 ? 'Board Cleared' : `Phase ${currentStep}: ${currentStage.phaseTitle}`}</span>
              <span className="text-[#2B313D]">&bull;</span>
              <span className="text-[#C68A46]">{activeReplayNodes.length} Dossier Entities</span>
              <span className="text-[#2B313D]">&bull;</span>
              <span className="text-[#8B81C4]">{activeReplayEdges.length} Active Conduits</span>
            </div>

            <svg className="w-full h-[400px]" viewBox="0 0 1180 440" preserveAspectRatio="xMidYMid meet">
              <g 
                transform={`translate(${reconPan.x}, ${reconPan.y}) scale(${reconZoom})`}
                style={{ 
                  transformOrigin: '590px 220px', 
                  transition: isDraggingRecon ? 'none' : 'transform 0.1s ease-out' 
                }}
              >
                {/* Empty State Watermark: Displayed when Board is Initialized / Cleared */}
                {activeReplayNodes.length === 0 && (
                  <g transform="translate(590, 210)" className="pointer-events-none select-none">
                    <circle r="44" fill="#181C24" stroke="#C68A46" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.6" />
                    <foreignObject x="-20" y="-20" width="40" height="40">
                      <div className="w-full h-full flex items-center justify-center text-[#C68A46]">
                        <Film className="w-7 h-7" />
                      </div>
                    </foreignObject>
                    <text textAnchor="middle" y="70" fill="#E8EAEE" fontSize="13" fontWeight="600" fontFamily="Source Serif 4, serif">
                      Investigation Evidence Board Cleared
                    </text>
                    <text textAnchor="middle" y="90" fill="#787167" fontSize="10.5" fontFamily="Courier Prime, monospace">
                      Click "Play Reconstruction" above to generate live chronological graph and Indian English narration
                    </text>
                  </g>
                )}

                {/* Render Active Edges that have been built so far */}
                {allGraphEdges.map((edge, i) => {
                  const isActive = activeReplayEdges.some(e => e.from === edge.from && e.to === edge.to);
                  if (!isActive) return null;

                  const srcNode = allGraphNodes.find(n => n.id === edge.from);
                  const tgtNode = allGraphNodes.find(n => n.id === edge.to);
                  if (!srcNode || !tgtNode) return null;

                  const midX = (srcNode.x + tgtNode.x) / 2;
                  const midY = (srcNode.y + tgtNode.y) / 2;
                  const labelWidth = Math.max(54, edge.label.length * 6.2 + 14);

                  return (
                    <g key={i}>
                      <line
                        x1={srcNode.x}
                        y1={srcNode.y}
                        x2={tgtNode.x}
                        y2={tgtNode.y}
                        stroke={edge.color}
                        strokeWidth={edge.strokeWidth || 1.8}
                        strokeOpacity={0.85}
                        className="line-draw-anim"
                      />
                      <rect
                        x={midX - labelWidth / 2}
                        y={midY - 8}
                        width={labelWidth}
                        height={16}
                        rx={3}
                        fill="#12151B"
                        stroke="#2B313D"
                        strokeWidth="0.75"
                      />
                      <text
                        x={midX}
                        y={midY + 3.5}
                        textAnchor="middle"
                        fill={edge.color}
                        fontSize="8.5"
                        fontFamily="Courier Prime, monospace"
                        fontWeight="500"
                        className="animate-in fade-in duration-300"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {/* Render Active Nodes: Placed strictly at (node.x, node.y) */}
                {allGraphNodes.map((node) => {
                  const isVisible = activeReplayNodes.includes(node.id);
                  if (!isVisible) return null;

                  const isNewlyAdded = newlyMaterializedNodes && newlyMaterializedNodes.includes(node.id);
                  const NodeIcon = node.icon;
                  const r = node.isBridge ? 20 : 16;
                  const boxWidth = node.isBridge ? 116 : 100;

                  return (
                    <g 
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer group"
                      onClick={() => onSelectEntity({ person_id: node.id, name: node.label, role: node.sub, is_bridge: node.isBridge })}
                    >
                      {/* Stage pulse ring around newly introduced entities */}
                      {isNewlyAdded && (
                        <circle
                          r={r + 6}
                          fill="none"
                          stroke="#C68A46"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                          className="animate-spin"
                          style={{ animationDuration: '6s' }}
                        />
                      )}

                      {/* Newly Materialized Phase Tag */}
                      {isNewlyAdded && (
                        <g transform={`translate(0, -${r + 7})`}>
                          <rect
                            x="-28"
                            y="-9"
                            width="56"
                            height="12"
                            rx="2"
                            fill="#8B2626"
                            stroke="#B83232"
                            strokeWidth="0.5"
                          />
                          <text
                            textAnchor="middle"
                            y="-0.5"
                            fill="#F4EFE6"
                            fontSize="6.5"
                            fontWeight="700"
                            fontFamily="Courier Prime, monospace"
                          >
                            PHASE {currentStep}
                          </text>
                        </g>
                      )}

                      <g className="transition-transform duration-200 group-hover:scale-105">
                        <circle
                          r={r}
                          fill="#181C24"
                          stroke={node.color}
                          strokeWidth={node.isBridge ? "2" : "1.5"}
                        />

                        <foreignObject 
                          x={node.isBridge ? -9 : -8} 
                          y={node.isBridge ? -9 : -8} 
                          width={node.isBridge ? 18 : 16} 
                          height={node.isBridge ? 18 : 16}
                        >
                          <NodeIcon className="w-full h-full" style={{ color: node.color }} />
                        </foreignObject>

                        <rect
                          x={-boxWidth / 2}
                          y={r + 3}
                          width={boxWidth}
                          height={24}
                          rx={3}
                          fill="#12151B"
                          stroke={isNewlyAdded ? "#C68A46" : "#2B313D"}
                          strokeWidth={isNewlyAdded ? "1" : "0.5"}
                        />

                        <text
                          textAnchor="middle"
                          y={r + 13.5}
                          fill="#E8EAEE"
                          fontSize="9.5"
                          fontWeight="600"
                          fontFamily="IBM Plex Sans, sans-serif"
                        >
                          {node.label}
                        </text>
                        <text
                          textAnchor="middle"
                          y={r + 23}
                          fill="#787167"
                          fontSize="8"
                          fontFamily="Courier Prime, monospace"
                        >
                          {node.sub}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </Card>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: STATUTORY VIOLATIONS & LAWS BROKEN (LIST-WISE) */}
      {/* ========================================================= */}
      {activeTab === 'statutes' && (
        <Card className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B313D] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#C68A46]" />
                <h2 className="text-base font-serif font-bold text-[#E8EAEE] tracking-tight">
                  Statutory Criminal Law Violations
                </h2>
              </div>
              <p className="text-xs text-[#9AA3B2] mt-0.5 font-sans">
                List of violated legal articles, why each law was broken, and linked digital evidence. Click any article to view exhibits.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsBsaModalOpen(true)}
                variant="brass"
                size="sm"
                className="text-xs flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Section 63B BSA Certificate</span>
              </Button>
              <span className="stamp-tag stamp-sage text-[10px]">
                {lawsBroken.length} SUBSTANTIATED
              </span>
            </div>
          </div>

          {/* LIST-WISE ACCORDION OF STATUTES */}
          <div className="space-y-2.5">
            {lawsBroken.map((law) => {
              const isExpanded = expandedStatuteId === law.id;

              return (
                <div
                  key={law.id}
                  onClick={() => toggleStatute(law.id)}
                  className={`bg-[#181C24] hover:bg-[#1C212B] border rounded-[6px] p-3.5 transition-all duration-150 cursor-pointer ${
                    isExpanded 
                      ? 'border-[#C68A46] shadow-lg ring-1 ring-[#C68A46]/20' 
                      : 'border-[#2B313D] hover:border-[#3E4759]'
                  }`}
                >
                  {/* Collapsed List Row: Article Section + Plain-English Reason Why Violated + Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Article Badge & Act */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="stamp-tag stamp-crimson text-[10.5px] font-bold tracking-wider">
                        {law.section}
                      </span>
                      <span className="text-[11px] font-mono text-[#787167]">
                        {law.actShort}
                      </span>
                    </div>

                    {/* Middle: Why Violated in Simple Words */}
                    <div className="flex-1 text-xs text-[#E8EAEE] font-sans font-medium leading-relaxed sm:px-2">
                      {law.simpleWhy}
                    </div>

                    {/* Right: View Evidence Toggle Button */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border transition flex items-center gap-1.5 ${
                        isExpanded
                          ? 'bg-[#C68A46] text-[#12151B] border-[#C68A46] font-bold'
                          : 'bg-[#12151B] text-[#C68A46] border-[#2B313D] hover:border-[#C68A46]'
                      }`}>
                        <span>{isExpanded ? 'Hide Details' : 'View Evidence'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded View: Full Legal Penalty, How Violated & Evidence Document */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="pt-3.5 mt-3 border-t border-[#2B313D] space-y-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Legal Act & Penalty Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#12151B] p-2.5 rounded-[5px] border border-[#2B313D]">
                          <div>
                            <span className="text-[9.5px] font-mono uppercase text-[#787167] block">LEGAL OFFENCE TITLE</span>
                            <span className="text-xs font-serif font-bold text-[#E8EAEE]">{law.title}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9.5px] font-mono uppercase text-[#787167] block">STATUTORY PENALTY</span>
                            <span className="text-[11px] font-mono font-semibold text-[#5FA876]">{law.penalty}</span>
                          </div>
                        </div>

                        {/* Full Forensic Description */}
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-mono uppercase text-[#787167] block">HOW IT WAS VIOLATED IN THIS CASE</span>
                          <p className="text-xs text-[#9AA3B2] leading-relaxed font-sans bg-[#1F2430] p-2.5 rounded-[4px] border border-[#2B313D]">
                            {law.description}
                          </p>
                        </div>

                        {/* Direct Evidence Box */}
                        <div className="bg-[#12151B] p-3 rounded-[5px] border border-[#2B313D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-[#C68A46] font-semibold">
                              <FileCheck className="w-3.5 h-3.5 text-[#C68A46]" />
                              <span>EVIDENCE EXHIBIT: {law.evidenceRef}</span>
                            </div>
                            <div className="text-xs text-[#E8EAEE] font-sans font-medium">{law.evidenceDoc}</div>
                            <div className="text-[10px] font-mono text-[#787167]">{law.evidenceHash}</div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              onClick={() => setIsBsaModalOpen(true)}
                              variant="brass"
                              size="sm"
                              className="text-xs"
                            >
                              <Scale className="w-3 h-3" />
                              <span>View Section 63B Certificate</span>
                            </Button>
                          </div>
                        </div>

                        {/* Accused Suspects */}
                        {law.suspects && (
                          <div className="flex items-center gap-2 text-xs pt-0.5">
                            <span className="text-[10px] font-mono text-[#787167] uppercase">ACCUSED:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {law.suspects.map((s, i) => (
                                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181C24] text-[#E8EAEE] border border-[#2B313D]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ========================================================= */}
      {/* SECTION 63B BSA CERTIFICATE MODAL                         */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isBsaModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="bg-[#181C24] border border-[#2B313D] w-full max-w-2xl rounded-[5px] shadow-none p-5 space-y-4 max-h-[90vh] overflow-y-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#2B313D] pb-2.5">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#5FA876]" />
                  <h3 className="text-base font-serif font-bold text-[#E8EAEE]">Section 63B BSA Certificate of Electronic Evidence</h3>
                </div>
                <button 
                  onClick={() => setIsBsaModalOpen(false)}
                  className="p-1 rounded-[4px] bg-[#1F2430] hover:bg-[#282F3F] text-[#9AA3B2] hover:text-[#E8EAEE]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-[#9AA3B2] leading-relaxed font-serif text-[13px] bg-[#1F2430] p-4 rounded-[5px] border border-[#2B313D]">
                <p className="text-center font-bold text-[#E8EAEE] uppercase tracking-wider text-sm">
                  IN THE COURT OF THE PRINCIPAL DISTRICT &amp; SESSIONS JUDGE<br />
                  CYBER JURISDICTION &amp; COMMERCIAL OFFENCES
                </p>
                <p className="text-center text-xs text-[#6B7382] font-mono">
                  CERTIFICATE UNDER SECTION 63B OF THE BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
                </p>
                <hr className="border-[#2B313D] my-2.5" />
                <p>
                  I, <strong className="text-[#E8EAEE]">{caseData.investigator_name}</strong>, holding Badge ID <strong className="text-[#E8EAEE]">{caseData.investigator_badge}</strong>, Lead Investigating Officer at <strong className="text-[#E8EAEE]">{caseData.region_name}</strong>, hereby certify under Section 63B of the Bharatiya Sakshya Adhiniyam, 2023 that:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 font-sans text-xs">
                  <li>
                    The digital evidence records associated with <strong className="text-[#E8EAEE]">{caseData.case_id} ({caseData.title})</strong> were lawfully extracted, cryptographically hashed at the time of seizure, and preserved on the Hyperledger immutable evidence registry.
                  </li>
                  <li>
                    The computer systems and cloud capture gateways were operating normally during the extraction window and no unauthorized alterations occurred.
                  </li>
                  <li>
                    Hash verification check against SHA-256 baseline confirmed zero tampering:
                    <div className="bg-[#12151B] p-2 rounded-[4px] font-mono text-[10px] mt-1 text-[#5FA876] border border-[#2B313D]">
                      EVD-001 (FIR 0018/2026): d4c56ad10356cf2cc8ddfdc26fd4c04f... [MATCH]<br />
                      EVD-002 (STR-88912): afeb4ed06feb8f55c8a7028172dec410... [MATCH]<br />
                      EVD-003 (CDR Tower T-4401): ccfb08874fc7038d541678894b70eee7... [MATCH]
                    </div>
                  </li>
                </ol>
                <p className="pt-1">
                  Executed under my hand and digital signature on this 5th day of September, 2026.
                </p>
                <div className="flex justify-between pt-3 border-t border-[#2B313D] font-sans text-xs">
                  <div>
                    <span className="text-[#6B7382] block text-[10px] font-mono">REGISTRY DIGEST</span>
                    <span className="font-mono text-[#C68A46]">FABRIC-BLOCK-992144</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#E8EAEE] font-bold block">{caseData.investigator_name}</span>
                    <span className="text-[#6B7382] text-[10px]">Lead Cyber Investigator, NCR Cyber PS</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  onClick={() => window.print()}
                  variant="secondary"
                  size="default"
                >
                  Print Certificate
                </Button>
                <Button
                  onClick={() => setIsBsaModalOpen(false)}
                  variant="brass"
                  size="default"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
