import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, FileText, User, CreditCard, Radio, Laptop, Building2,
  Play, Pause, RotateCcw, Volume2, VolumeX, Scale, Sparkles, X, Info,
  CheckCircle2, AlertTriangle, Film, ZoomIn, ZoomOut, ArrowRight, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { RAW_DATASET } from '../data/dataset';

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

  // Wikipedia-style tooltip hover state
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Live Graph Video Reconstruction Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceAudio, setVoiceAudio] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);

  // BSA Certificate Modal state
  const [isBsaModalOpen, setIsBsaModalOpen] = useState(false);

  // Network Map state
  const [selectedMapNode, setSelectedMapNode] = useState(null);

  // Deselect node when clicking outside the graph window or outside inspector drawer
  useEffect(() => {
    if (!selectedMapNode) return;

    const handleGlobalClick = (e) => {
      // If clicking inside the inspector drawer itself, keep selection
      if (inspectorDrawerRef.current && inspectorDrawerRef.current.contains(e.target)) {
        return;
      }
      // If clicking inside the graph container
      if (graphContainerRef.current && graphContainerRef.current.contains(e.target)) {
        // If clicking on an entity node, the node's onClick handles it
        if (e.target.closest && e.target.closest('.group')) {
          return;
        }
        // Clicking on canvas background
        setSelectedMapNode(null);
        return;
      }
      // Clicking anywhere outside the graph window (e.g. page, summary briefing, navbar)
      setSelectedMapNode(null);
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [selectedMapNode]);

  // Play subtle sonic audio chime
  const playAudioChime = () => {
    if (!voiceAudio) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.22);
    } catch (e) {
      // AudioContext policy fallback
    }
  };

  // Speak narration
  const speakNarration = (text) => {
    if (!voiceAudio || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05 * playbackSpeed;
      utterance.pitch = 0.98;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  // Continuous Video Player Loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      const durationPerStep = 6000 / playbackSpeed;
      const intervalMs = 100;
      let elapsed = 0;

      // Trigger narration and chime for current step
      playAudioChime();
      if (caseEvents[currentStep]) {
        speakNarration(caseEvents[currentStep].narration);
      }

      timer = setInterval(() => {
        elapsed += intervalMs;
        const totalDuration = caseEvents.length * durationPerStep;
        const currentTotalElapsed = currentStep * durationPerStep + elapsed;
        setProgressPercent(Math.min(100, (currentTotalElapsed / totalDuration) * 100));

        if (elapsed >= durationPerStep) {
          elapsed = 0;
          setCurrentStep((prev) => {
            if (prev < caseEvents.length - 1) {
              const next = prev + 1;
              playAudioChime();
              speakNarration(caseEvents[next].narration);
              return next;
            } else {
              setIsPlaying(false);
              setProgressPercent(100);
              return prev;
            }
          });
        }
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStep, playbackSpeed, voiceAudio, caseEvents]);

  const handleStartVideo = () => {
    if (currentStep >= caseEvents.length - 1) {
      setCurrentStep(0);
      setProgressPercent(0);
    }
    setIsPlaying(true);
  };

  const handleResetVideo = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentStep(0);
    setProgressPercent(0);
  };

  const handleScrub = (index) => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentStep(index);
    setProgressPercent(((index) / (caseEvents.length - 1)) * 100);
    playAudioChime();
    speakNarration(caseEvents[index].narration);
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

  // Laws broken mapping for this case
  const lawsBroken = [
    {
      act: 'Information Technology Act, 2000',
      section: 'Section 66C',
      title: 'Punishment for Identity Theft',
      penalty: 'Imprisonment up to 3 years and fine up to ₹1,00,000',
      description: 'Fraudulent use of electronic signature, password, and corporate authentication credentials of CFO Vikramaditya Rathore.',
      evidenceRef: 'EVD-001 (Phishing domain secure-zenithcorp-auth.com logs)'
    },
    {
      act: 'Information Technology Act, 2000',
      section: 'Section 66D',
      title: 'Cheating by Personation using Computer Resource',
      penalty: 'Imprisonment up to 3 years and fine up to ₹1,00,000',
      description: 'Cheating by personating executive management via spoofed email header to induce corporate fund clearance.',
      evidenceRef: 'EVD-001 (Spoofed email artifacts & IP 198.51.100.45)'
    },
    {
      act: 'Bharatiya Nyaya Sanhita (BNS), 2023',
      section: 'Section 318(4)',
      title: 'Cheating and Dishonestly Inducing Delivery of Property',
      penalty: 'Rigorous imprisonment up to 7 years and fine',
      description: 'Dishonestly inducing Zenith Technologies to part with ₹1,00,00,000 RTGS fund transfer into mule accounts.',
      evidenceRef: 'EVD-001 & Core Banking Transaction TXN-1001'
    },
    {
      act: 'Bharatiya Nyaya Sanhita (BNS), 2023',
      section: 'Section 61(2)',
      title: 'Criminal Conspiracy',
      penalty: 'Same punishment as for the abetment of the principal offence',
      description: 'Agreement and coordination between technical operators (Kunal Shah), syndicate lead (Rajesh Verma), and money broker (Devrat Sharma) to execute wire fraud.',
      evidenceRef: 'EVD-003 (Nodal Tower T-4401 CDR Call Dump Logs)'
    },
    {
      act: 'Prevention of Money Laundering Act (PMLA), 2002',
      section: 'Section 3 & Section 4',
      title: 'Offence of Money-Laundering & Layering',
      penalty: 'Rigorous imprisonment up to 7 to 10 years and fine',
      description: 'Direct involvement in layering proceeds of crime from primary mule account ACC-2201 through secondary accounts into broker ACC-7702 and shell entities.',
      evidenceRef: 'EVD-002 (STR-88912 & Cross-Case Bridge TXN_552)'
    }
  ];

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

  // Replay steps
  const stepNodes = [
    ['PER-108', 'ACC-1001'],
    ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104'],
    ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104', 'ACC-MULES'],
    ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104', 'ACC-MULES', 'LOC-101', 'PER-101', 'PER-102'],
    ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104', 'ACC-MULES', 'LOC-101', 'PER-101', 'PER-102', 'PER-103', 'ACC-7701'],
    ['PER-108', 'ACC-1001', 'ACC-2201', 'PER-104', 'ACC-MULES', 'LOC-101', 'PER-101', 'PER-102', 'PER-103', 'ACC-7701', 'PER-105', 'ACC-7705']
  ];

  const stepEdges = [
    [{ from: 'PER-108', to: 'ACC-1001' }],
    [{ from: 'PER-108', to: 'ACC-1001' }, { from: 'ACC-1001', to: 'ACC-2201' }, { from: 'ACC-2201', to: 'PER-104' }],
    [{ from: 'PER-108', to: 'ACC-1001' }, { from: 'ACC-1001', to: 'ACC-2201' }, { from: 'ACC-2201', to: 'PER-104' }, { from: 'ACC-2201', to: 'ACC-MULES' }],
    [{ from: 'PER-108', to: 'ACC-1001' }, { from: 'ACC-1001', to: 'ACC-2201' }, { from: 'ACC-2201', to: 'PER-104' }, { from: 'ACC-2201', to: 'ACC-MULES' }, { from: 'PER-101', to: 'LOC-101' }, { from: 'PER-102', to: 'LOC-101' }],
    [{ from: 'PER-108', to: 'ACC-1001' }, { from: 'ACC-1001', to: 'ACC-2201' }, { from: 'ACC-2201', to: 'PER-104' }, { from: 'ACC-2201', to: 'ACC-MULES' }, { from: 'PER-101', to: 'LOC-101' }, { from: 'PER-102', to: 'LOC-101' }, { from: 'ACC-MULES', to: 'PER-103' }, { from: 'LOC-101', to: 'PER-103' }, { from: 'PER-103', to: 'ACC-7701' }],
    allGraphEdges
  ];

  const activeReplayNodes = stepNodes[Math.min(currentStep, stepNodes.length - 1)] || [];
  const activeReplayEdges = stepEdges[Math.min(currentStep, stepEdges.length - 1)] || [];

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
                      const r = isSelected ? (node.isBridge ? 22 : 18) : (node.isBridge ? 19 : 15);
                      const boxWidth = node.isBridge ? 112 : 98;

                      return (
                        <g 
                          key={node.id}
                          transform={`translate(${node.x}, ${node.y})`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMapNode(selectedMapNode === node.id ? null : node.id);
                          }}
                          onMouseEnter={(e) => handleNodeHover(e, node)}
                          onMouseLeave={handleNodeLeave}
                          className="cursor-pointer group"
                        >
                          {/* Halo ring for clicked / expanded entity */}
                          {isSelected && (
                            <circle
                              r={r + 5}
                              fill="none"
                              stroke="#C68A46"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                              opacity="0.85"
                            />
                          )}

                          <circle
                            r={r}
                            fill="#181C24"
                            stroke={isSelected ? "#E8EAEE" : node.color}
                            strokeWidth={node.isBridge || isSelected ? "2" : "1.5"}
                          />

                          <foreignObject 
                            x={node.isBridge ? -9 : -8} 
                            y={node.isBridge ? -9 : -8} 
                            width={node.isBridge ? 18 : 16} 
                            height={node.isBridge ? 18 : 16}
                            className="pointer-events-none"
                          >
                            <NodeIcon className="w-full h-full" style={{ color: isSelected ? '#E8EAEE' : node.color }} />
                          </foreignObject>

                          {/* Opaque backdrop pill behind text to ensure zero overwritten or obscured text */}
                          <rect
                            x={-boxWidth / 2}
                            y={r + 3}
                            width={boxWidth}
                            height={24}
                            rx={3}
                            fill="#12151B"
                            stroke={isSelected ? "#C68A46" : "#2B313D"}
                            strokeWidth={isSelected ? "1" : "0.5"}
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
                            fill={isSelected ? "#C68A46" : "#6B7382"}
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
              </div>

              {/* Spatial Floating Node Popover on Hover (with Boundary Flipping) */}
              <AnimatePresence>
                {hoveredNode && (() => {
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

            {/* Click-to-Expand Entity Inspector Drawer (Stays Expanded!) */}
            {selectedNodeData ? (() => {
              const dossier = entityDossierDetails[selectedNodeData.id] || {
                name: selectedNodeData.label,
                alias: selectedNodeData.id,
                category: selectedNodeData.type.toUpperCase(),
                categoryVariant: selectedNodeData.isBridge ? 'violet' : 'brass',
                status: 'Identified Network Entity',
                role: selectedNodeData.sub,
                location: 'NCR Cyber PS Jurisdiction',
                phone: 'N/A',
                idNumber: selectedNodeData.id,
                deviceIp: 'Network IP Logs',
                riskLevel: 'Active Network Node',
                riskScore: selectedSuspectInfo?.risk_score || 50,
                whatHappened: `Entity participating in topological flow of ${caseData.case_id}. Linked via ${connectedEdgesCount} active conduits.`,
                legalEvidence: 'FIR 0018/2026',
                actionTaken: 'Under active case analysis'
              };

              const directConduits = allGraphEdges.filter(e => e.from === selectedNodeData.id || e.to === selectedNodeData.id);

              return (
                <div ref={inspectorDrawerRef}>
                  <Card className="p-4 bg-[#181C24] border border-[#C68A46]/70 rounded-[5px] space-y-3 shadow-lg">
                    {/* Top Banner with Name, Badges, and Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B313D] pb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={dossier.categoryVariant || "brass"}>
                          {dossier.category}
                        </Badge>
                        <div>
                          <h3 className="font-serif font-bold text-[#E8EAEE] text-sm tracking-tight flex items-center gap-2">
                            {dossier.name}
                            <span className="text-xs font-mono text-[#C68A46] font-normal">
                              "{dossier.alias}"
                            </span>
                          </h3>
                          <p className="text-[11px] text-[#9AA3B2] font-mono mt-0.5">
                            ID: <strong className="text-[#E8EAEE]">{selectedNodeData.id}</strong> &bull; Status: <span className="text-[#5FA876] font-medium">{dossier.status}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => onSelectEntity({ 
                            person_id: selectedNodeData.id, 
                            name: dossier.name, 
                            role: dossier.role, 
                            is_bridge: selectedNodeData.isBridge 
                          })}
                          variant="brass"
                          size="sm"
                          className="text-xs"
                        >
                          <span>Inspect Full Dossier</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                        <button 
                          onClick={() => setSelectedMapNode(null)}
                          className="p-1 rounded-[3px] text-[#6B7382] hover:text-[#E8EAEE] hover:bg-[#1F2430] border border-[#2B313D]"
                          title="Collapse entity drawer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Simple, Readable 4-Column Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs bg-[#12151B] p-3 rounded-[4px] border border-[#2B313D]">
                      <div>
                        <span className="text-[#6B7382] block text-[10px] font-mono uppercase">ROLE</span>
                        <span className="text-[#E8EAEE] font-medium mt-0.5 block leading-snug">{dossier.role}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7382] block text-[10px] font-mono uppercase">LOCATION</span>
                        <span className="text-[#E8EAEE] font-medium mt-0.5 block leading-snug">{dossier.location}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7382] block text-[10px] font-mono uppercase">DETAILS</span>
                        <span className="text-[#6C93B8] font-mono block mt-0.5">{dossier.phone}</span>
                        <span className="text-[#6B7382] font-mono text-[10px] block">{dossier.idNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7382] block text-[10px] font-mono uppercase">RISK LEVEL</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`font-mono font-bold ${dossier.riskScore >= 80 ? 'text-[#C1655A]' : dossier.riskScore >= 40 ? 'text-[#C68A46]' : 'text-[#5FA876]'}`}>
                            {dossier.riskScore}%
                          </span>
                          <div className="w-16 bg-[#1F2430] h-1.5 rounded-[2px] overflow-hidden border border-[#2B313D]">
                            <div 
                              className={`h-full ${dossier.riskScore >= 80 ? 'bg-[#C1655A]' : dossier.riskScore >= 40 ? 'bg-[#C68A46]' : 'bg-[#5FA876]'}`}
                              style={{ width: `${dossier.riskScore}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-[#9AA3B2] block mt-0.5 truncate">{dossier.riskLevel}</span>
                      </div>
                    </div>

                    {/* "WHAT HAPPENED" SECTION */}
                    <div className="space-y-1 bg-[#1F2430] p-3 rounded-[4px] border border-[#2B313D]">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#C68A46] font-semibold">
                        <Info className="w-3.5 h-3.5" />
                        <span>WHAT HAPPENED</span>
                      </div>
                      <p className="text-xs text-[#E8EAEE] leading-relaxed font-sans font-normal">
                        {dossier.whatHappened}
                      </p>
                    </div>

                    {/* Evidence & Connected Conduits Strip */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-0.5">
                      <div className="space-y-1">
                        <span className="text-[#6B7382] block text-[10px] font-mono uppercase">EVIDENCE &amp; STATUS</span>
                        <p className="text-[#9AA3B2] leading-snug">
                          <strong className="text-[#E8EAEE] font-mono">{dossier.legalEvidence}</strong>
                        </p>
                        <p className="text-[#6B7382] text-[11px] leading-snug">
                          {dossier.actionTaken}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[#6B7382] block text-[10px] font-mono uppercase">CONNECTED TO ({directConduits.length})</span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {directConduits.map((edge, idx) => {
                            const isOutgoing = edge.from === selectedNodeData.id;
                            const otherNodeId = isOutgoing ? edge.to : edge.from;
                            const otherNode = allGraphNodes.find(n => n.id === otherNodeId);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedMapNode(otherNodeId)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#12151B] border border-[#2B313D] text-[11px] font-sans text-[#9AA3B2] hover:text-[#E8EAEE] hover:border-[#C68A46] cursor-pointer transition"
                              >
                                <strong className="text-[#E8EAEE]">{otherNode?.label || otherNodeId}</strong>
                                <span className="text-[#6B7382] text-[10px]">({edge.label})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })() : null}
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
                onClick={isPlaying ? () => setIsPlaying(false) : handleStartVideo}
                className={`px-3 py-1 rounded-[4px] font-semibold text-xs transition flex items-center gap-1.5 ${
                  isPlaying
                    ? 'bg-[#C68A46] text-[#12151B]'
                    : 'bg-[#C68A46] text-[#12151B] hover:bg-[#D49855]'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : currentStep === 0 ? 'Play Reconstruction' : 'Resume'}</span>
              </button>

              <button
                onClick={handleResetVideo}
                className="p-1 rounded-[4px] bg-[#181C24] hover:bg-[#282F3F] text-[#9AA3B2] hover:text-[#E8EAEE] transition"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setVoiceAudio(!voiceAudio)}
                className={`p-1 rounded-[4px] border text-xs font-mono transition flex items-center gap-1 ${
                  voiceAudio ? 'bg-[#181C24] text-[#C68A46] border-[#2B313D]' : 'bg-[#181C24] text-[#6B7382] border-[#2B313D]'
                }`}
                title="Toggle Voice"
              >
                {voiceAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline text-[11px]">{voiceAudio ? 'Voice ON' : 'Muted'}</span>
              </button>

              <div className="flex items-center gap-0.5 px-1 text-xs font-mono">
                {[1, 1.5, 2].map((s) => (
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
          <div className="space-y-1">
            <div className="grid grid-cols-6 gap-1.5">
              {caseEvents.map((evt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScrub(idx)}
                  className={`h-1.5 rounded-[2px] transition-all duration-150 ${
                    idx <= currentStep ? 'bg-[#C68A46]' : 'bg-[#1F2430] hover:bg-[#2B313D]'
                  }`}
                  title={`Event ${idx + 1}: ${evt.timestamp}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6B7382]">
              <span>Event {currentStep + 1} of {caseEvents.length}: {caseEvents[currentStep]?.timestamp}</span>
              <span>Source: <strong className="text-[#9AA3B2]">{caseEvents[currentStep]?.evidence_reference}</strong></span>
            </div>
          </div>

          {/* Narration Subtitle Box */}
          <div className="bg-[#1F2430] border border-[#2B313D] p-3.5 rounded-[5px] flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {isPlaying && voiceAudio ? (
                <div className="flex items-center gap-0.5 h-4">
                  <span className="w-0.5 bg-[#C68A46] rounded-full wave-bar" />
                  <span className="w-0.5 bg-[#6C93B8] rounded-full wave-bar" />
                  <span className="w-0.5 bg-[#5FA876] rounded-full wave-bar" />
                  <span className="w-0.5 bg-[#C68A46] rounded-full wave-bar" />
                </div>
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#C68A46] block" />
              )}
            </div>
            <p className="text-sm font-medium text-[#E8EAEE] leading-relaxed font-sans">
              "{caseEvents[currentStep]?.narration}"
            </p>
          </div>

          {/* LIVE GRAPH RECONSTRUCTION CANVAS: Entities and Lines Materialize One by One */}
          <div className="bg-[#12151B] border border-[#2B313D] rounded-[5px] p-2 min-h-[350px] relative overflow-x-auto select-none">
            <div className="absolute top-2.5 right-2.5 text-[10px] font-mono text-[#6B7382] bg-[#181C24] px-2 py-0.5 rounded-[3px] border border-[#2B313D] z-10">
              Materialized Graph: {activeReplayNodes.length} Nodes &bull; {activeReplayEdges.length} Conduits Active
            </div>

            <svg className="w-full min-w-[940px] h-[390px]" viewBox="0 0 1180 440">
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
                      strokeOpacity={0.8}
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
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight="500"
                      className="animate-in fade-in duration-300"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Render Active Nodes that have appeared so far */}
              {allGraphNodes.map((node) => {
                const isVisible = activeReplayNodes.includes(node.id);
                if (!isVisible) return null;

                const NodeIcon = node.icon;
                const r = node.isBridge ? 20 : 16;
                const boxWidth = node.isBridge ? 112 : 98;
                return (
                  <g 
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="node-pop cursor-pointer"
                    onClick={() => onSelectEntity({ person_id: node.id, name: node.label, role: node.sub, is_bridge: node.isBridge })}
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
            </svg>
          </div>
        </Card>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: STATUTORY VIOLATIONS & LAWS BROKEN             */}
      {/* ========================================================= */}
      {activeTab === 'statutes' && (
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#2B313D] pb-2.5">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#5FA876]" />
              <h2 className="text-sm font-serif font-bold text-[#E8EAEE] tracking-wide">Statutory Criminal Law Violations</h2>
            </div>
            <Badge variant="green">
              {lawsBroken.length} Substantiated Sections
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {lawsBroken.map((law, idx) => (
              <div
                key={idx}
                className="bg-[#1F2430] border border-[#2B313D] rounded-[5px] p-3.5 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="brass">
                    {law.act}
                  </Badge>
                  <span className="text-[10px] font-mono text-[#5FA876]">
                    {law.penalty}
                  </span>
                </div>
                <h4 className="font-serif font-semibold text-[#E8EAEE] text-sm">{law.section}: {law.title}</h4>
                <p className="text-[#9AA3B2] leading-relaxed">{law.description}</p>
                <p className="text-[11px] font-mono text-[#6B7382] pt-1 border-t border-[#2B313D]">
                  Proof: <strong className="text-[#E8EAEE]">{law.evidenceRef}</strong>
                </p>
              </div>
            ))}
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
