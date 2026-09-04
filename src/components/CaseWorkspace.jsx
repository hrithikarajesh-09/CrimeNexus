import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Calendar, ShieldCheck, FileText, User, CreditCard, Phone, 
  Car, Laptop, MapPin, Play, Pause, RotateCcw, Volume2, VolumeX, 
  ExternalLink, CheckCircle2, AlertTriangle, Scale, Sparkles, ChevronRight, X, Info,
  Sliders, FastForward, Film
} from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function CaseWorkspace({ caseId, onBack, onSelectEntity, onAskCopilot }) {
  const caseData = RAW_DATASET.cases.find(c => c.case_id === caseId) || RAW_DATASET.cases[0];
  const allEvents = RAW_DATASET.groundTruth.chronological_reconstruction_events;

  // Filter events relevant to this case
  const caseEvents = allEvents.filter(e => 
    e.case_id.includes(caseId) || e.case_id.includes('CASE-018 -> CASE-041')
  );

  // Wikipedia-style tooltip hover state
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Video Replay Reconstruction state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceAudio, setVoiceAudio] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 1.5x, 2x
  const [progressPercent, setProgressPercent] = useState(0);

  // BSA Certificate Modal state
  const [isBsaModalOpen, setIsBsaModalOpen] = useState(false);

  // Network Map state
  const [selectedMapNode, setSelectedMapNode] = useState(null);

  // Play audio chime using Web Audio API
  const playAudioChime = () => {
    if (!voiceAudio) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  // Speak speech narration
  const speakNarration = (text) => {
    if (!voiceAudio || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05 * playbackSpeed;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  // Continuous Video Player Loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      const durationPerStep = 5500 / playbackSpeed;
      const intervalMs = 100;
      let elapsed = 0;

      // Initial trigger for current step
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

  // Wikipedia hover helper dictionary
  const evidenceEntities = {
    'EVD-001': {
      title: 'Police FIR 0018/2026 (NCR Cyber Crime PS)',
      type: 'Police FIR & Incident Report',
      docId: 'EVD-001',
      hash: 'd4c56ad10356cf2cc8ddfdc26fd4c04ff6ca07f586a8acf970c43731c169c142',
      date: '09-JUN-2026 18:30:00 IST',
      snippet: 'Formal complaint filed by CFO Vikramaditya Rathore detailing unauthorized spear-phishing attack and ₹1.0 Cr RTGS debit.',
      status: 'VERIFIED ON FABRIC LEDGER'
    },
    'EVD-002': {
      title: 'FIU-IND Suspicious Transaction Report STR-88912',
      type: 'FIU-IND Banking Advisory',
      docId: 'EVD-002',
      hash: 'afeb4ed06feb8f55c8a7028172dec41070be605e4508ba3ea0f7dc6b4e9cbcae',
      date: '08-AUG-2026 11:00:00 IST',
      snippet: 'Banking advisory detailing ₹50 Lakhs transfer (TXN_552) from Devrat Sharma into shell firm Apex Trade Solutions and immediate cash layering.',
      status: 'VERIFIED ON FABRIC LEDGER'
    },
    'EVD-003': {
      title: 'Sector 44 Gurugram Cell Tower Dump T-4401',
      type: 'Telephony Regulatory Extraction',
      docId: 'EVD-003',
      hash: 'ccfb08874fc7038d541678894b70eee79265d68d8a5c65adf5187c5d4e45f91e',
      date: '10-JUN-2026 09:15:00 IST',
      snippet: 'Nodal tower dump confirming suspect telephony interactions and contradicting suspect Rajesh Verma alibi at the time of the heist.',
      status: 'VERIFIED ON FABRIC LEDGER'
    },
    'ACC-1001': {
      title: 'Zenith Corporate Current Account (ACC-1001)',
      type: 'Victim Bank Account',
      docId: 'Apex Global Bank #001199884401',
      hash: 'ACC-VERIFIED-4401',
      date: '09-JUN-2026 14:10:00 IST',
      snippet: 'Target corporate account held by Zenith Technologies Ltd debited for ₹1,00,00,000 via fraudulent RTGS authorization.',
      status: 'DEBIT CONFIRMED'
    },
    'ACC-2201': {
      title: 'Suman Roy Primary Mule Account (ACC-2201)',
      type: 'Primary Mule Account',
      docId: 'Royal Crest Bank #9988220144',
      hash: 'ACC-VERIFIED-2201',
      date: '09-JUN-2026 14:10:00 IST',
      snippet: 'Beneficiary account belonging to Suman Roy (PER-104) receiving initial ₹1.0 Cr heist tranche, subdivided within 25 minutes.',
      status: 'FROZEN BY CYBER CELL'
    },
    'ACC-7701': {
      title: 'Apex Trade Solutions Shell Account (ACC-7701)',
      type: 'Corporate Front Company Account',
      docId: 'Imperial Trust Bank #4455770199',
      hash: 'ACC-VERIFIED-7701',
      date: '07-AUG-2026 15:30:00 IST',
      snippet: 'Shell company account in Nariman Point, Mumbai. Received ₹50,00,000 from Devrat Sharma (TXN_552) with rapid outward transfer.',
      status: 'UNDER PMLA FREEZE'
    },
    'PER-103': {
      title: 'Devrat Sharma (Broker D / The Accountant)',
      type: 'Cross-Jurisdiction Money Broker',
      docId: 'PAN: DSRPS3311L',
      hash: 'BROKER-BRIDGE-NODE',
      date: 'Active NCR & Mumbai',
      snippet: 'Strategic money broker connecting NCR cyber syndicate with Mumbai hawala ring. Ranked #1 in network betweenness centrality.',
      status: 'HIGH-PRIORITY TARGET'
    },
    'TXN_552': {
      title: 'Transaction TXN_552 (Core UTR: ITBL2026080700552)',
      type: 'Cross-Case Financial Bridge',
      docId: 'RTGS UTR Reference 552',
      hash: 'EVD-002: Record #552',
      date: '07-AUG-2026 15:30:00 IST',
      snippet: 'Crucial ₹50,00,000 RTGS transaction from Devrat Sharma (ACC-7702) into Apex Trade Solutions (ACC-7701), linking Case 018 with Case 041.',
      status: 'EVIDENCE BRIDGE CONFIRMED'
    },
    'DOMAIN-AUTH': {
      title: 'Phishing Domain: secure-zenithcorp-auth.com',
      type: 'Malicious Cyber Infrastructure',
      docId: 'Associated IP: 198.51.100.45',
      hash: 'IND-102 (Threat Score: 98/100)',
      date: 'Registered 20-MAY-2026',
      snippet: 'Lookalike corporate credential harvesting site used to intercept 2FA tokens from CFO Vikramaditya Rathore.',
      status: 'SEIZED BY POLICE'
    }
  };

  const handleWikiHover = (e, key) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left, y: rect.bottom + window.scrollY + 6 });
    setActiveTooltip(evidenceEntities[key]);
  };

  const handleWikiLeave = () => {
    setActiveTooltip(null);
  };

  // Structured Point-Wise Investigation Narrative Points
  const narrativePoints = [
    {
      step: '01',
      time: '09-JUN-2026 11:15 IST',
      title: 'Targeted Spear-Phishing Infiltration',
      tag: 'CYBER VECTOR',
      content: (
        <span>
          Corporate finance treasury received an executive spoofing email prompting urgent vendor clearance via duplicate portal{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'DOMAIN-AUTH')}
            onMouseLeave={handleWikiLeave}
            className="text-[#84CEEB] underline decoration-[#5680E9] font-mono font-semibold cursor-pointer px-1 py-0.5 rounded bg-[#5680E9]/15 border border-[#5680E9]/30"
          >
            secure-zenithcorp-auth.com
          </span>
          . Rogue 2FA token intercepted by IP 198.51.100.45.
        </span>
      )
    },
    {
      step: '02',
      time: '09-JUN-2026 14:10 IST',
      title: 'Unauthorized Core Banking RTGS Debit',
      tag: 'WIRE FRAUD',
      content: (
        <span>
          Unauthorized RTGS debit of{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'ACC-1001')}
            onMouseLeave={handleWikiLeave}
            className="text-[#84CEEB] font-bold underline decoration-[#5AB9EA] cursor-pointer px-1 py-0.5 rounded bg-[#5AB9EA]/15 border border-[#5AB9EA]/30"
          >
            ₹1,00,00,000 (One Crore INR)
          </span>{' '}
          executed from{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'ACC-1001')}
            onMouseLeave={handleWikiLeave}
            className="text-[#C1C8E4] font-mono underline decoration-[#5680E9] cursor-pointer px-1 py-0.5 rounded bg-[#5680E9]/15 border border-[#5680E9]/30"
          >
            Zenith Corporate Account ACC-1001
          </span>{' '}
          into primary mule account{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'ACC-2201')}
            onMouseLeave={handleWikiLeave}
            className="text-[#84CEEB] font-mono underline decoration-[#84CEEB] cursor-pointer px-1 py-0.5 rounded bg-[#84CEEB]/15 border border-[#84CEEB]/30"
          >
            ACC-2201 (Suman Roy)
          </span>
          , registered under{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'EVD-001')}
            onMouseLeave={handleWikiLeave}
            className="text-[#8860D0] font-mono font-bold underline decoration-[#8860D0] cursor-pointer px-1 py-0.5 rounded bg-[#8860D0]/15 border border-[#8860D0]/30"
          >
            FIR 0018/2026 (EVD-001)
          </span>
          .
        </span>
      )
    },
    {
      step: '03',
      time: '09-JUN-2026 14:35 IST',
      title: 'Multi-Tier Secondary Mule Dispersal',
      tag: 'LAYERING',
      content: (
        <span>
          Within 25 minutes, Account ACC-2201 split the ₹1.0 Cr across 5 secondary student and shell accounts (ACC-3301 through ACC-8809) in ₹20L tranches to prevent automated banking AML freezes.
        </span>
      )
    },
    {
      step: '04',
      time: '11-JUN-2026 10:15 IST',
      title: 'Consolidation to Strategic Broker Node',
      tag: 'AGGREGATION',
      content: (
        <span>
          Mule accounts funneled ₹70,00,000 into broker account ACC-7702 controlled by{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'PER-103')}
            onMouseLeave={handleWikiLeave}
            className="text-[#8860D0] font-bold underline decoration-[#8860D0] cursor-pointer px-1 py-0.5 rounded bg-[#8860D0]/20 border border-[#8860D0]/40"
          >
            Devrat Sharma (PER-103, alias Broker D)
          </span>
          . Cell Tower Dump{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'EVD-003')}
            onMouseLeave={handleWikiLeave}
            className="text-[#84CEEB] font-mono underline decoration-[#84CEEB] cursor-pointer px-1 py-0.5 rounded bg-[#84CEEB]/15 border border-[#84CEEB]/30"
          >
            T-4401 (EVD-003)
          </span>{' '}
          confirmed telephony coordination.
        </span>
      )
    },
    {
      step: '05',
      time: '07-AUG-2026 15:30 IST',
      title: 'Cross-Case Inter-Jurisdiction Financial Bridge',
      tag: 'SIGNATURE LINK',
      content: (
        <span>
          Broker Devrat Sharma executed crucial transfer{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'TXN_552')}
            onMouseLeave={handleWikiLeave}
            className="text-[#84CEEB] font-mono font-bold underline decoration-[#84CEEB] cursor-pointer px-1 py-0.5 rounded bg-[#84CEEB]/20 border border-[#84CEEB]/40"
          >
            TXN_552 (₹50,00,000)
          </span>{' '}
          into Mumbai shell front company{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'ACC-7701')}
            onMouseLeave={handleWikiLeave}
            className="text-[#5AB9EA] font-mono font-semibold underline decoration-[#5AB9EA] cursor-pointer px-1 py-0.5 rounded bg-[#5AB9EA]/15 border border-[#5AB9EA]/30"
          >
            Apex Trade Solutions (ACC-7701)
          </span>
          , directly bridging Case #018 with Mumbai Operation ShadowLedge under{' '}
          <span
            onMouseEnter={(e) => handleWikiHover(e, 'EVD-002')}
            onMouseLeave={handleWikiLeave}
            className="text-[#8860D0] font-mono font-bold underline decoration-[#8860D0] cursor-pointer px-1 py-0.5 rounded bg-[#8860D0]/20 border border-[#8860D0]/40"
          >
            FIU Advisory STR-88912 (EVD-002)
          </span>
          .
        </span>
      )
    }
  ];

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
      description: 'Cheating by personating executive management via spoofed email header (ceo-office@zenithcorp-internal.com) to induce corporate fund clearance.',
      evidenceRef: 'EVD-001 (Spoofed email artifacts & IP 198.51.100.45)'
    },
    {
      act: 'Bharatiya Nyaya Sanhita (BNS), 2023',
      section: 'Section 318(4)',
      title: 'Cheating and Dishonestly Inducing Delivery of Property',
      penalty: 'Rigorous imprisonment up to 7 years and fine',
      description: 'Dishonestly inducing Zenith Technologies to part with ₹1,00,00,000 RTGS fund transfer into mule accounts (formerly IPC Section 420).',
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

  // Interconnected 2D Graph Nodes with exact layout coordinates
  const graphNodes = [
    { id: 'PER-108', label: 'Vikramaditya (CFO)', type: 'person', x: 80, y: 190, icon: User, color: '#84CEEB', ring: '#5680E9' },
    { id: 'ACC-1001', label: 'Zenith Tech A/C', type: 'account', x: 230, y: 190, icon: CreditCard, color: '#84CEEB', ring: '#5680E9' },
    { id: 'ACC-2201', label: 'Suman Roy A/C', type: 'account', x: 390, y: 190, icon: CreditCard, color: '#5AB9EA', ring: '#5AB9EA' },
    { id: 'PER-104', label: 'Suman Roy (Mule)', type: 'person', x: 390, y: 310, icon: User, color: '#5AB9EA', ring: '#5AB9EA' },
    { id: 'LOC-101', label: 'Tower T-4401 Gurugram', type: 'location', x: 550, y: 70, icon: MapPin, color: '#C1C8E4', ring: '#5680E9' },
    { id: 'PER-101', label: 'Rajesh Verma (Boss)', type: 'person', x: 410, y: 70, icon: User, color: '#8860D0', ring: '#8860D0' },
    { id: 'PER-102', label: 'Kunal Shah (Coder)', type: 'person', x: 690, y: 70, icon: Laptop, color: '#84CEEB', ring: '#5AB9EA' },
    { id: 'PER-103', label: 'Devrat Sharma (Broker)', type: 'person', x: 570, y: 190, icon: User, color: '#8860D0', ring: '#8860D0', isBridge: true },
    { id: 'ACC-7701', label: 'Apex Trade Shell', type: 'account', x: 740, y: 190, icon: CreditCard, color: '#5AB9EA', ring: '#5AB9EA' },
    { id: 'PER-105', label: 'Tariq Merchant (Hawala)', type: 'person', x: 890, y: 190, icon: User, color: '#8860D0', ring: '#8860D0' },
    { id: 'ACC-7705', label: 'Dubai Bullion A/C', type: 'account', x: 890, y: 310, icon: CreditCard, color: '#84CEEB', ring: '#5680E9' }
  ];

  // Interconnected Graph Connecting Lines (Edges)
  const graphEdges = [
    { from: 'PER-108', to: 'ACC-1001', label: 'SIGNATORY', color: '#5680E9' },
    { from: 'ACC-1001', to: 'ACC-2201', label: '₹1.0 CR RTGS', color: '#84CEEB', strokeWidth: 3, animated: true },
    { from: 'ACC-2201', to: 'PER-104', label: 'HOLDER', color: '#5AB9EA' },
    { from: 'PER-101', to: 'LOC-101', label: 'CDR TOWER', color: '#C1C8E4' },
    { from: 'PER-102', to: 'LOC-101', label: 'DEV LOGS', color: '#C1C8E4' },
    { from: 'ACC-2201', to: 'PER-103', label: 'LAYERING ROUTE', color: '#5AB9EA', animated: true },
    { from: 'PER-103', to: 'LOC-101', label: 'CALL CDR-1008', color: '#C1C8E4' },
    { from: 'PER-103', to: 'ACC-7701', label: 'TXN_552 (₹50L BRIDGE)', color: '#8860D0', strokeWidth: 3, animated: true, isBridge: true },
    { from: 'ACC-7701', to: 'PER-105', label: '₹45L DISSIPATION', color: '#5AB9EA' },
    { from: 'PER-105', to: 'ACC-7705', label: 'SWIFT WIRE DUBAI', color: '#8860D0', animated: true }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 font-sans">
      
      {/* Top Breadcrumbs & Case Header */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/30 rounded-3xl p-6 shadow-2xl space-y-4 ethereal-glass">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-[#151f38] hover:bg-[#1c294a] border border-[#5680E9]/30 text-[#C1C8E4] hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#84CEEB]" />
              <span>Back to Cases</span>
            </button>
            <div className="h-5 w-px bg-[#5680E9]/30" />
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
              {caseData.case_id}
            </span>
            <span className="text-xs font-mono text-[#C1C8E4]">
              {caseData.case_number}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBsaModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#5680E9] to-[#8860D0] hover:opacity-95 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#5680E9]/25"
            >
              <Scale className="w-3.5 h-3.5 text-white" />
              <span>Generate Section 63B BSA Certificate</span>
            </button>

            <button
              onClick={() => onAskCopilot(`Provide a complete executive summary of ${caseData.case_id}`)}
              className="px-4 py-2.5 rounded-2xl bg-[#151f38] hover:bg-[#1c294a] border border-[#5680E9]/35 text-[#C1C8E4] text-xs font-semibold transition flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#84CEEB]" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white font-display tracking-wide">{caseData.title}</h1>
          <p className="text-xs text-[#8e9cc2] mt-1">
            Category: <strong className="text-white">{caseData.category}</strong> &bull; Jurisdiction: <strong className="text-[#84CEEB]">{caseData.region_name}</strong> &bull; Registered: <span className="font-mono text-[#C1C8E4]">{caseData.registration_date}</span>
          </p>
        </div>

        {/* Quick Officer Metadata Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#5680E9]/20 text-xs">
          <div className="bg-[#080c18]/60 p-3 rounded-2xl border border-[#5680E9]/20">
            <span className="text-[#8e9cc2] block text-[10px] uppercase font-mono font-semibold">Lead Officer</span>
            <span className="font-bold text-white mt-0.5 block">{caseData.investigator_name}</span>
          </div>
          <div className="bg-[#080c18]/60 p-3 rounded-2xl border border-[#5680E9]/20">
            <span className="text-[#8e9cc2] block text-[10px] uppercase font-mono font-semibold">Investigation Status</span>
            <span className="font-bold text-[#84CEEB] mt-0.5 block">{caseData.status}</span>
          </div>
          <div className="bg-[#080c18]/60 p-3 rounded-2xl border border-[#5680E9]/20">
            <span className="text-[#8e9cc2] block text-[10px] uppercase font-mono font-semibold">Registered Evidence</span>
            <span className="font-bold text-[#5AB9EA] mt-0.5 block">{caseData.stats.evidence} Verified Files</span>
          </div>
          <div className="bg-[#080c18]/60 p-3 rounded-2xl border border-[#5680E9]/20">
            <span className="text-[#8e9cc2] block text-[10px] uppercase font-mono font-semibold">Cross-Case Connection</span>
            <span className="font-bold text-[#8860D0] mt-0.5 block">Bridge to CASE-041 (TXN_552)</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Point-Wise Investigation Narrative (Easy to Understand) */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/30 rounded-3xl p-7 shadow-2xl space-y-5 ethereal-glass relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5680E9]/20 border border-[#5680E9]/40 flex items-center justify-center text-[#84CEEB]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display tracking-wide">Investigation Narrative (Point-Wise Briefing)</h2>
              <p className="text-xs text-[#8e9cc2]">Chronological breakdown of criminal incident events with interactive evidentiary references.</p>
            </div>
          </div>
          <span className="text-[11px] text-[#84CEEB] font-mono flex items-center gap-1.5 bg-[#151f38] px-3 py-1.5 rounded-full border border-[#5680E9]/30">
            <Info className="w-3.5 h-3.5 text-[#84CEEB]" />
            Hover over highlighted tokens for instant evidence preview
          </span>
        </div>

        {/* Sequential Point-Wise Cards */}
        <div className="space-y-3 pt-2">
          {narrativePoints.map((point) => (
            <div 
              key={point.step}
              className="bg-[#151f38]/70 border border-[#5680E9]/25 hover:border-[#5680E9]/60 rounded-2xl p-4.5 transition duration-200 flex flex-col md:flex-row md:items-start gap-4 group shadow-sm"
            >
              {/* Step indicator */}
              <div className="shrink-0 flex md:flex-col items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#5680E9]/15 border border-[#5680E9]/40 flex items-center justify-center text-xs font-mono font-bold text-[#84CEEB]">
                  {point.step}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/30 whitespace-nowrap">
                  {point.tag}
                </span>
              </div>

              {/* Point content */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#84CEEB] transition font-display">
                    {point.title}
                  </h4>
                  <span className="text-xs font-mono text-[#8e9cc2] bg-[#080c18] px-2.5 py-0.5 rounded-lg border border-[#5680E9]/20">
                    {point.time}
                  </span>
                </div>
                <p className="text-xs text-[#C1C8E4] leading-relaxed">
                  {point.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Wikipedia Floating Popover Tooltip */}
        {activeTooltip && (
          <div 
            style={{ top: `${tooltipPos.y}px`, left: `${Math.min(tooltipPos.x, window.innerWidth - 380)}px` }}
            className="fixed z-50 w-80 bg-[#0f1629] border border-[#5680E9] rounded-2xl p-4.5 shadow-2xl space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-150 pointer-events-none ethereal-glow"
          >
            <div className="flex items-center justify-between border-b border-[#5680E9]/25 pb-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/30">
                {activeTooltip.type}
              </span>
              <span className="text-[9px] font-mono text-[#84CEEB] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-[#84CEEB]" />
                {activeTooltip.status}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm font-display">{activeTooltip.title}</h4>
              <p className="text-[11px] text-[#84CEEB] font-mono mt-0.5">{activeTooltip.docId}</p>
            </div>

            <p className="text-[11px] text-[#C1C8E4] leading-snug bg-[#080c18] p-2.5 rounded-xl border border-[#5680E9]/25">
              "{activeTooltip.snippet}"
            </p>

            <div className="pt-1 text-[10px] font-mono text-[#8e9cc2] flex items-center justify-between">
              <span>SHA-256 Digest:</span>
              <span className="text-[#84CEEB] truncate max-w-[170px]">{activeTooltip.hash}</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: ACTUAL Interconnected Network Graph (Lines, Nodes, Vectors) */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/30 rounded-3xl p-7 shadow-2xl space-y-4 ethereal-glass">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
                TOPOLOGICAL GRAPH MAP
              </span>
              <h2 className="text-lg font-bold text-white font-display tracking-wide">Interconnected Case Knowledge Graph</h2>
            </div>
            <p className="text-xs text-[#8e9cc2] mt-0.5">
              Interactive structural topography with directional transaction vectors, telephony links, and cross-case bridge pathways.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
              <span className="w-2 h-2 rounded-full bg-[#84CEEB]" /> Core Heist
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/40">
              <span className="w-2 h-2 rounded-full bg-[#8860D0]" /> Cross-Case Bridge (TXN_552)
            </span>
          </div>
        </div>

        {/* Actual Interconnected SVG Canvas Graph */}
        <div className="bg-[#080c18] border border-[#5680E9]/30 rounded-2xl p-4 min-h-[420px] relative overflow-x-auto select-none">
          <svg className="w-full min-w-[960px] h-[380px]" viewBox="0 0 980 380">
            {/* SVG Arrow Marker Definitions */}
            <defs>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#5680E9" />
              </marker>
              <marker id="arrow-sky" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#84CEEB" />
              </marker>
              <marker id="arrow-purple" viewBox="0 0 10 10" refX="26" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#8860D0" />
              </marker>
            </defs>

            {/* Render Connecting Vectors / Lines */}
            {graphEdges.map((edge, i) => {
              const srcNode = graphNodes.find(n => n.id === edge.from);
              const tgtNode = graphNodes.find(n => n.id === edge.to);
              if (!srcNode || !tgtNode) return null;

              const isHighlighted = selectedMapNode ? (selectedMapNode === srcNode.id || selectedMapNode === tgtNode.id) : true;
              const opacity = isHighlighted ? 0.9 : 0.2;
              const markerType = edge.isBridge ? 'url(#arrow-purple)' : edge.color === '#84CEEB' ? 'url(#arrow-sky)' : 'url(#arrow-blue)';

              // Calculate midpoint for link label
              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g key={i} style={{ opacity, transition: 'opacity 0.3s' }}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={edge.color}
                    strokeWidth={edge.strokeWidth || 1.8}
                    strokeOpacity={0.8}
                    className={edge.animated ? 'animated-link' : ''}
                    markerEnd={markerType}
                  />
                  {/* Link Label */}
                  <rect
                    x={midX - 38}
                    y={midY - 9}
                    width="76"
                    height="18"
                    rx="6"
                    fill="#0f1629"
                    stroke={edge.color}
                    strokeWidth="0.8"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill={edge.color}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes with Icons & Glowing Badges */}
            {graphNodes.map((node) => {
              const isSelected = selectedMapNode === node.id;
              return (
                <g 
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => {
                    setSelectedMapNode(selectedMapNode === node.id ? null : node.id);
                    onSelectEntity({ person_id: node.id, name: node.label, role: node.type });
                  }}
                  className="cursor-pointer group"
                >
                  {/* Glowing Outer Ring */}
                  <circle
                    r={node.isBridge ? "28" : "24"}
                    fill="#0f1629"
                    stroke={node.isBridge ? "#8860D0" : isSelected ? "#84CEEB" : node.ring}
                    strokeWidth={node.isBridge || isSelected ? "3" : "1.8"}
                    className={node.isBridge ? "animate-pulse" : ""}
                  />

                  {/* Inner Accent Ring */}
                  <circle
                    r={node.isBridge ? "22" : "18"}
                    fill={node.isBridge ? "#8860D020" : "#5680E915"}
                  />

                  {/* Node ID / Type Text Icon */}
                  <text
                    textAnchor="middle"
                    y="4"
                    fill={node.color}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.type === 'person' ? '👤' : node.type === 'account' ? '🏛️' : node.type === 'location' ? '📍' : '💻'}
                  </text>

                  {/* Node Label Below */}
                  <rect
                    x="-65"
                    y={node.isBridge ? "34" : "30"}
                    width="130"
                    height="20"
                    rx="8"
                    fill="#151f38"
                    stroke={node.isBridge ? "#8860D0" : "#5680E930"}
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    y={node.isBridge ? "47" : "43"}
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* SECTION 3: Live Investigation Reconstruction (Video Player with Real Audio & Continuous Graph Evolution) */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/30 rounded-3xl p-7 shadow-2xl space-y-6 ethereal-glass">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/40 flex items-center gap-1">
                <Film className="w-3.5 h-3.5" />
                AUTOMATED REPLAY
              </span>
              <h2 className="text-lg font-bold text-white font-display tracking-wide">Review Investigation (Live Documentary Video Experience)</h2>
            </div>
            <p className="text-xs text-[#8e9cc2] mt-0.5">
              Continuous progressive documentary playback. Real audible voice narration triggers incremental graph node appearances and animated connection drawing.
            </p>
          </div>

          {/* Video Player Controls Bar */}
          <div className="flex items-center gap-3 bg-[#080c18] border border-[#5680E9]/30 p-2 rounded-2xl shadow-inner">
            <button
              onClick={isPlaying ? () => setIsPlaying(false) : handleStartVideo}
              className={`px-5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition flex items-center gap-2 ${
                isPlaying
                  ? 'bg-[#84CEEB] text-[#080c18] shadow-lg shadow-[#84CEEB]/30'
                  : 'bg-gradient-to-r from-[#5680E9] to-[#8860D0] text-white shadow-lg shadow-[#5680E9]/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : currentStep === 0 ? 'PLAY VIDEO RECONSTRUCTION' : 'RESUME'}</span>
            </button>

            <button
              onClick={handleResetVideo}
              className="p-2 rounded-xl bg-[#151f38] hover:bg-[#1c294a] text-[#C1C8E4] border border-[#5680E9]/30 transition"
              title="Reset to Start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setVoiceAudio(!voiceAudio)}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-mono ${
                voiceAudio ? 'bg-[#5680E9]/20 text-[#84CEEB] border-[#5680E9]/40' : 'bg-[#151f38] text-[#8e9cc2] border-[#5680E9]/20'
              }`}
              title="Toggle Audible Speech"
            >
              {voiceAudio ? <Volume2 className="w-4 h-4 text-[#84CEEB]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{voiceAudio ? 'VOICE ON' : 'MUTED'}</span>
            </button>

            {/* Playback Speed Chip */}
            <div className="flex items-center gap-1 bg-[#151f38] px-2.5 py-1 rounded-xl border border-[#5680E9]/30 text-xs font-mono">
              {[1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    playbackSpeed === s ? 'bg-[#5680E9] text-white' : 'text-[#8e9cc2] hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Scrubber & Equalizer Bar */}
        <div className="space-y-2">
          <div className="w-full bg-[#080c18] h-2.5 rounded-full overflow-hidden border border-[#5680E9]/30 relative cursor-pointer">
            <div 
              className="h-full bg-gradient-to-r from-[#5680E9] via-[#84CEEB] to-[#8860D0] transition-all duration-150 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8e9cc2]">
            <span>Event {currentStep + 1} of {caseEvents.length}</span>
            <span>{Math.round(progressPercent)}% Video Completed</span>
          </div>
        </div>

        {/* Live Audio Narration Subtitle Box with Waveform Equalizer */}
        <div className="bg-[#080c18] border border-[#5680E9]/35 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Equalizer animation when playing */}
              {isPlaying && voiceAudio ? (
                <div className="flex items-center gap-1 h-5">
                  <span className="w-1 bg-[#84CEEB] rounded-full wave-bar" />
                  <span className="w-1 bg-[#5680E9] rounded-full wave-bar" />
                  <span className="w-1 bg-[#8860D0] rounded-full wave-bar" />
                  <span className="w-1 bg-[#84CEEB] rounded-full wave-bar" />
                  <span className="w-1 bg-[#5680E9] rounded-full wave-bar" />
                </div>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-[#84CEEB]" />
              )}
              <span className="font-mono text-xs font-bold text-[#84CEEB]">
                EVENT // {caseEvents[currentStep]?.timestamp}
              </span>
            </div>
            <span className="text-xs font-mono text-[#8e9cc2]">
              Source: <strong className="text-[#C1C8E4]">{caseEvents[currentStep]?.evidence_reference}</strong>
            </span>
          </div>

          <p className="text-base font-medium text-white leading-relaxed font-display">
            "{caseEvents[currentStep]?.narration}"
          </p>
        </div>

        {/* Continuous Dynamic Graph Stage */}
        <div className="bg-[#080c18] border border-[#5680E9]/30 rounded-2xl p-6 min-h-[260px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-[#84CEEB] uppercase tracking-wider">
              Real-Time Dynamic Graph Stage:
            </span>
            <span className="text-xs font-mono text-[#8860D0]">
              Nodes and vectors appear continuously as investigation progresses
            </span>
          </div>

          {/* Cards generated by the reconstruction */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {/* Step 0 */}
            <div 
              onClick={() => onSelectEntity({ name: 'Vikramaditya Rathore', role: 'Victim CFO' })}
              className="p-3.5 rounded-2xl bg-[#151f38] border border-[#5680E9]/40 text-center cursor-pointer hover:border-[#84CEEB] transition"
            >
              <User className="w-5 h-5 text-[#84CEEB] mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block truncate">V. Rathore (CFO)</span>
              <span className="text-[10px] text-[#8e9cc2] font-mono">PER-108</span>
            </div>

            <div 
              onClick={() => onSelectEntity({ name: 'ACC-1001', role: 'Zenith Corporate Bank' })}
              className="p-3.5 rounded-2xl bg-[#151f38] border border-[#5680E9]/40 text-center cursor-pointer hover:border-[#84CEEB] transition"
            >
              <CreditCard className="w-5 h-5 text-[#5AB9EA] mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block truncate">Zenith ACC-1001</span>
              <span className="text-[10px] text-[#84CEEB] font-mono">₹1.0 Cr Debited</span>
            </div>

            {/* Revealed at Step 1 */}
            {currentStep >= 0 && (
              <div 
                onClick={() => onSelectEntity({ name: 'Suman Roy', role: 'Primary Mule Account' })}
                className="p-3.5 rounded-2xl bg-[#151f38] border border-[#84CEEB]/50 text-center cursor-pointer hover:scale-105 transition animate-in fade-in zoom-in-95 duration-200"
              >
                <CreditCard className="w-5 h-5 text-[#84CEEB] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block truncate">Suman Roy A/C</span>
                <span className="text-[10px] text-[#84CEEB] font-mono">ACC-2201 (Mule)</span>
              </div>
            )}

            {/* Revealed at Step 2 */}
            {currentStep >= 1 && (
              <div 
                onClick={() => onSelectEntity({ name: 'Secondary Mules', role: 'Layering Accounts' })}
                className="p-3.5 rounded-2xl bg-[#151f38] border border-[#5680E9]/40 text-center cursor-pointer hover:border-[#84CEEB] transition animate-in fade-in zoom-in-95 duration-200"
              >
                <CreditCard className="w-5 h-5 text-[#C1C8E4] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block truncate">5 Secondary A/Cs</span>
                <span className="text-[10px] text-[#8e9cc2] font-mono">ACC-3301..8809</span>
              </div>
            )}

            {/* Revealed at Step 3 */}
            {currentStep >= 2 && (
              <div 
                onClick={() => onSelectEntity({ name: 'Devrat Sharma', role: 'Strategic Money Broker', is_bridge: true })}
                className="p-3.5 rounded-2xl bg-[#151f38] border-2 border-[#8860D0] text-center cursor-pointer hover:scale-105 transition animate-in fade-in zoom-in-95 duration-200 shadow-lg shadow-[#8860D0]/20"
              >
                <User className="w-5 h-5 text-[#8860D0] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block truncate">Devrat Sharma</span>
                <span className="text-[10px] text-[#8860D0] font-bold font-mono">BROKER D (ACC-7702)</span>
              </div>
            )}

            {/* Revealed at Step 4/5 */}
            {currentStep >= 4 && (
              <div 
                onClick={() => onSelectEntity({ name: 'Apex Trade Solutions', role: 'Mumbai Shell Front Company' })}
                className="p-3.5 rounded-2xl bg-[#151f38] border-2 border-[#84CEEB] text-center cursor-pointer hover:scale-105 transition animate-in fade-in zoom-in-95 duration-200 shadow-lg shadow-[#84CEEB]/25"
              >
                <CreditCard className="w-5 h-5 text-[#84CEEB] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block truncate">Apex Trade ACC-7701</span>
                <span className="text-[10px] text-[#84CEEB] font-bold font-mono">CROSS-CASE BRIDGE</span>
              </div>
            )}
          </div>

          {/* Animated Connecting Vector Path Display */}
          <div className="mt-6 pt-4 border-t border-[#5680E9]/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#84CEEB] animate-ping" />
              <span className="text-[#8e9cc2]">Live Animated Vector:</span>
              <strong className="text-white">
                {currentStep === 0 && "ACC-1001 ──[ ₹1.0 Cr RTGS ]──► ACC-2201 (Suman Roy)"}
                {currentStep === 1 && "ACC-2201 ──[ 5 IMPS tranches ]──► Secondary Mules (ACC-3301..8809)"}
                {currentStep === 2 && "Secondary Mules ──[ Aggregation ]──► Devrat Sharma (ACC-7702)"}
                {currentStep === 3 && "Devrat Sharma PH-1003 ──[ Voice Call ]──► Tariq Merchant PH-1005 (Mumbai)"}
                {currentStep >= 4 && "Devrat Sharma ──[ TXN_552 (₹50 Lakhs) ]──► Apex Trade Solutions (CASE-041 Bridge)"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Structured Suspect Roster (Clean List / Table Format) */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/30 rounded-3xl p-7 shadow-2xl space-y-4 ethereal-glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5680E9]/20 border border-[#5680E9]/40 flex items-center justify-center text-[#84CEEB]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display tracking-wide">Prime Suspects Roster (List View)</h2>
              <p className="text-xs text-[#8e9cc2]">Persons of interest arranged systematically with identity metrics, telephony tags, and risk index.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
            {primeSuspects.length} Suspects Roster
          </span>
        </div>

        {/* High-Density Clean Suspect Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#5680E9]/25 bg-[#080c18]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#151f38] text-[#8e9cc2] font-mono border-b border-[#5680E9]/25">
                <th className="p-3.5 pl-4">Suspect Name &amp; Alias</th>
                <th className="p-3.5">Operational Role</th>
                <th className="p-3.5">Network Position</th>
                <th className="p-3.5">Phone &amp; Location</th>
                <th className="p-3.5">PAN / Aadhaar</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5680E9]/15 text-[#C1C8E4]">
              {primeSuspects.map((suspect) => (
                <tr key={suspect.person_id} className="hover:bg-[#151f38]/60 transition">
                  {/* Name & Avatar */}
                  <td className="p-3.5 pl-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      suspect.is_bridge ? 'bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/50' : 'bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40'
                    }`}>
                      {suspect.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{suspect.name}</span>
                      <span className="text-[11px] text-[#84CEEB] font-mono">"{suspect.alias}"</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-3.5 font-medium text-white">{suspect.role}</td>

                  {/* Network Position */}
                  <td className="p-3.5 font-mono text-[11px]">
                    {suspect.is_bridge ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/40 font-bold">
                        BRIDGE BROKER
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/30">
                        {suspect.primary_case_id}
                      </span>
                    )}
                  </td>

                  {/* Phone & Location */}
                  <td className="p-3.5 font-mono text-[11px]">
                    <span className="block text-[#84CEEB]">{suspect.phone}</span>
                    <span className="text-[#8e9cc2] text-[10px]">{suspect.location}</span>
                  </td>

                  {/* PAN ID */}
                  <td className="p-3.5 font-mono text-[11px] text-[#C1C8E4]">{suspect.pan || 'N/A'}</td>

                  {/* Risk Score */}
                  <td className="p-3.5">
                    <div className="space-y-1 w-24">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                        <span className={suspect.risk_score >= 90 ? 'text-[#8860D0]' : 'text-[#84CEEB]'}>
                          {suspect.risk_score}%
                        </span>
                      </div>
                      <div className="w-full bg-[#151f38] h-1.5 rounded-full overflow-hidden border border-[#5680E9]/20">
                        <div 
                          className={`h-full rounded-full ${
                            suspect.risk_score >= 90 ? 'bg-gradient-to-r from-[#5680E9] to-[#8860D0]' : 'bg-[#84CEEB]'
                          }`}
                          style={{ width: `${suspect.risk_score}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => onSelectEntity(suspect)}
                      className="px-3 py-1.5 rounded-xl bg-[#151f38] hover:bg-[#5680E9] text-white text-[11px] font-semibold transition border border-[#5680E9]/30"
                    >
                      Inspect Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Laws Broken (Statutory Criminal Offences Violated) */}
      <div className="bg-[#0f1629]/90 border border-[#5680E9]/30 rounded-3xl p-7 shadow-2xl space-y-4 ethereal-glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5680E9]/20 border border-[#5680E9]/40 flex items-center justify-center text-[#84CEEB]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display tracking-wide">Statutory Criminal Offences &amp; Laws Broken</h2>
              <p className="text-xs text-[#8e9cc2]">Provisions under IT Act 2000, Bharatiya Nyaya Sanhita 2023, and PMLA 2002 substantiated by evidence.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/40">
            {lawsBroken.length} Statutorily Mapped Violations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {lawsBroken.map((law, idx) => (
            <div
              key={idx}
              className="bg-[#151f38]/80 border border-[#5680E9]/25 hover:border-[#5680E9]/60 rounded-2xl p-5 space-y-2.5 shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/30">
                    {law.act}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5 font-display">{law.section}: {law.title}</h4>
                </div>
              </div>

              <p className="text-xs text-[#C1C8E4] leading-relaxed bg-[#080c18] p-3 rounded-xl border border-[#5680E9]/20">
                {law.description}
              </p>

              <div className="text-[11px] space-y-1 pt-1 font-mono">
                <div className="flex items-center justify-between text-[#8e9cc2]">
                  <span>Prescribed Penalty:</span>
                  <strong className="text-[#84CEEB]">{law.penalty}</strong>
                </div>
                <div className="flex items-center justify-between text-[#8e9cc2]">
                  <span>Supporting Evidentiary Link:</span>
                  <span className="text-[#8860D0]">{law.evidenceRef}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: BSA Evidence Certificate Modal */}
      {isBsaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0f1629] border border-[#5680E9]/60 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ethereal-glow">
            <div className="bg-[#151f38] border-b border-[#5680E9]/30 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Section 63B BSA Electronic Evidence Certificate</h3>
                  <p className="text-xs text-[#8e9cc2]">Bharatiya Sakshya Adhiniyam, 2023 (Admissibility of Electronic Records)</p>
                </div>
              </div>

              <button
                onClick={() => setIsBsaModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#080c18] hover:bg-[#1c294a] text-[#8e9cc2] hover:text-white transition border border-[#5680E9]/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs bg-[#080c18] font-sans">
              <div className="border border-[#5680E9]/40 p-8 rounded-2xl space-y-5 bg-[#0f1629]">
                <div className="text-center border-b border-[#5680E9]/30 pb-4 space-y-1">
                  <h2 className="text-base font-black tracking-widest text-white uppercase font-display">
                    CERTIFICATE UNDER SECTION 63B BHARATIYA SAKSHYA ADHINIYAM, 2023
                  </h2>
                  <p className="text-[11px] text-[#8e9cc2]">
                    (In replacement of Section 65B of the Indian Evidence Act, 1872)
                  </p>
                  <p className="text-[10px] font-mono text-[#84CEEB]">
                    Certificate ID: BSA-63B-2026-NCR-018
                  </p>
                </div>

                <p className="text-[#C1C8E4] leading-relaxed text-justify">
                  I, <strong>{caseData.investigator_name}</strong>, Lead Case Investigating Officer, Cyber Crime Police Station (Region Code: {caseData.jurisdiction}), do hereby certify that the electronic records, log extractions, transaction datasets, and cell tower dump files associated with <strong>{caseData.title} ({caseData.case_number})</strong> were retrieved from lawful computer systems in the ordinary course of investigative inquiry.
                </p>

                {/* Evidence Hashes Table */}
                <div className="space-y-2">
                  <span className="font-bold text-white block uppercase font-mono">Cryptographically Certified Artifacts:</span>
                  <table className="w-full border-collapse border border-[#5680E9]/30 text-[11px] font-mono">
                    <thead>
                      <tr className="bg-[#151f38] text-[#84CEEB]">
                        <th className="p-2.5 border border-[#5680E9]/20 text-left">Evidence ID</th>
                        <th className="p-2.5 border border-[#5680E9]/20 text-left">Filename &amp; Source</th>
                        <th className="p-2.5 border border-[#5680E9]/20 text-left">SHA-256 Digest</th>
                        <th className="p-2.5 border border-[#5680E9]/20 text-left">Integrity Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5680E9]/15 text-[#C1C8E4]">
                      {RAW_DATASET.evidence.map(ev => (
                        <tr key={ev.evidence_id}>
                          <td className="p-2.5 border border-[#5680E9]/15 text-[#84CEEB] font-bold">{ev.evidence_id}</td>
                          <td className="p-2.5 border border-[#5680E9]/15">{ev.file_name}</td>
                          <td className="p-2.5 border border-[#5680E9]/15 text-[10px] break-all">{ev.sha256_hash.slice(0, 24)}...</td>
                          <td className="p-2.5 border border-[#5680E9]/15 text-[#84CEEB] font-bold">MATCH (VERIFIED)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Statutory Sign-off */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#5680E9]/30">
                  <div>
                    <span className="text-[#8e9cc2] block text-[10px] font-mono">VERIFICATION DATE &amp; PLACE</span>
                    <span className="font-semibold text-white">04-SEP-2026 &bull; Gurugram PS</span>
                    <span className="text-[10px] text-[#84CEEB] block font-mono">Fabric Ledger Block: #10402</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#8e9cc2] block text-[10px] font-mono">AUTHORIZED SIGNATORY</span>
                    <span className="font-bold text-white">{caseData.investigator_name}</span>
                    <span className="text-[10px] text-[#84CEEB] block font-mono">Lead Case Officer ({caseData.investigator_id})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#5680E9] to-[#8860D0] hover:opacity-95 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#5680E9]/25"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Print / Save Legal Certificate (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
