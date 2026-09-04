import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Calendar, ShieldCheck, FileText, User, CreditCard, Phone, 
  Car, Laptop, MapPin, Play, Pause, RotateCcw, Volume2, VolumeX, 
  ExternalLink, CheckCircle2, AlertTriangle, Scale, Sparkles, ChevronRight, X, Info
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

  // Review Investigation (Reconstruction) Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceAudio, setVoiceAudio] = useState(true);

  // BSA Certificate Modal state
  const [isBsaModalOpen, setIsBsaModalOpen] = useState(false);

  // Network map active filter
  const [mapFilter, setMapFilter] = useState('ALL');

  // Timer for Reconstruction Playback
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < caseEvents.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, caseEvents.length]);

  // Speech synthesis voice narration simulation
  useEffect(() => {
    if (isPlaying && voiceAudio && caseEvents[currentStep]) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(caseEvents[currentStep].narration);
        utterance.rate = 1.0;
        utterance.pitch = 0.95;
        // window.speechSynthesis.speak(utterance); // Available if browser allows audio
      }
    }
  }, [currentStep, isPlaying, voiceAudio, caseEvents]);

  // Wikipedia hover helper dictionary
  const evidenceEntities = {
    'EVD-001': {
      title: 'Police FIR 0018/2026 (NCR Cyber Crime PS)',
      type: 'Police FIR & Incident Report',
      docId: 'EVD-001',
      hash: 'd4c56ad10356cf2cc8ddfdc26fd4c04ff6ca07f586a8acf970c43731c169c142',
      date: '09-JUN-2026 18:30:00 IST',
      snippet: 'Formal complaint filed by CFO Vikramaditya Rathore detailing unauthorized spear-phishing attack and ₹1.0 Cr RTGS debit.',
      status: 'VERIFIED ON LEDGER'
    },
    'EVD-002': {
      title: 'FIU-IND Suspicious Transaction Report STR-88912',
      type: 'FIU-IND Banking Advisory',
      docId: 'EVD-002',
      hash: 'afeb4ed06feb8f55c8a7028172dec41070be605e4508ba3ea0f7dc6b4e9cbcae',
      date: '08-AUG-2026 11:00:00 IST',
      snippet: 'Banking advisory detailing ₹50 Lakhs transfer (TXN_552) from Devrat Sharma into shell firm Apex Trade Solutions and immediate cash layering.',
      status: 'VERIFIED ON LEDGER'
    },
    'EVD-003': {
      title: 'Sector 44 Gurugram Cell Tower Dump T-4401',
      type: 'Telephony Regulatory Extraction',
      docId: 'EVD-003',
      hash: 'ccfb08874fc7038d541678894b70eee79265d68d8a5c65adf5187c5d4e45f91e',
      date: '10-JUN-2026 09:15:00 IST',
      snippet: 'Nodal tower dump confirming suspect telephony interactions and contradicting suspect Rajesh Verma alibi at the time of the heist.',
      status: 'VERIFIED ON LEDGER'
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
      status: 'HIGH-PRIORITY ARREST TARGET'
    },
    'TXN_552': {
      title: 'Transaction TXN_552 (Core UTR: ITBL2026080700552)',
      type: 'Cross-Case Financial Bridge',
      docId: 'RTGS UTR Reference 552',
      hash: 'EVD-002: Record #552',
      date: '07-AUG-2026 15:30:00 IST',
      snippet: 'Crucial ₹50,00,000 RTGS transaction from Devrat Sharma (ACC-7702) into Apex Trade Solutions (ACC-7701), linking Case 018 with Case 041.',
      status: 'CONFIRMED EVIDENCE BRIDGE'
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
      description: 'Fraudulent or dishonest use of electronic signature, password, or unique authentication credentials of CFO Vikramaditya Rathore.',
      evidenceRef: 'EVD-001 (Phishing domain secure-zenithcorp-auth.com logs)'
    },
    {
      act: 'Information Technology Act, 2000',
      section: 'Section 66D',
      title: 'Cheating by Personation using Computer Resource',
      penalty: 'Imprisonment up to 3 years and fine up to ₹1,00,000',
      description: 'Cheating by personating the Managing Director via spoofed email header (ceo-office@zenithcorp-internal.com) to induce corporate fund clearance.',
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

  // Entity Nodes for the Network Map
  const mapNodes = [
    { id: 'PER-108', label: 'Vikramaditya Rathore', sub: 'Victim CFO', type: 'person', icon: User, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { id: 'ACC-1001', label: 'Zenith Tech A/C', sub: 'Corporate ACC-1001', type: 'account', icon: CreditCard, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'ACC-2201', label: 'Suman Roy A/C', sub: 'Primary Mule ACC-2201', type: 'account', icon: CreditCard, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'PER-104', label: 'Suman Roy', sub: 'Mule Alpha (PER-104)', type: 'person', icon: User, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'PER-102', label: 'Kunal Shah', sub: 'Coder K (DEV-101)', type: 'person', icon: Laptop, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'PER-101', label: 'Rajesh Verma', sub: 'Viper / Lead Operator', type: 'person', icon: User, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
    { id: 'PH-1001', label: '+919811001122', sub: 'Airtel Tower T-4401', type: 'phone', icon: Phone, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'PER-103', label: 'Devrat Sharma', sub: 'Broker D (Bridge Node)', type: 'person', icon: User, color: 'text-red-500 bg-red-500/20 border-red-500/50' },
    { id: 'ACC-7701', label: 'Apex Trade Solutions', sub: 'Mumbai Shell ACC-7701', type: 'account', icon: CreditCard, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'LOC-101', label: 'Sector 44 Gurugram', sub: 'Safehouse & Tower', type: 'location', icon: MapPin, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' }
  ];

  const mapEdges = [
    { from: 'PER-108', to: 'ACC-1001', label: 'AUTHORIZED_SIGNATORY' },
    { from: 'ACC-1001', to: 'ACC-2201', label: '₹1.0 CR RTGS HEIST', highlight: true },
    { from: 'ACC-2201', to: 'PER-104', label: 'ACCOUNT_HOLDER' },
    { from: 'PER-102', to: 'LOC-101', label: 'SERVER_DEPLOYED' },
    { from: 'PER-101', to: 'PH-1001', label: 'DEVICE_MSISDN' },
    { from: 'PH-1001', to: 'LOC-101', label: 'TOWER_DUMP_T4401' },
    { from: 'ACC-2201', to: 'PER-103', label: 'LAYERED_AGGREGATION' },
    { from: 'PER-103', to: 'ACC-7701', label: 'TXN_552 (₹50L BRIDGE)', bridge: true }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 font-sans">
      
      {/* Top Breadcrumbs & Case Header */}
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cases</span>
            </button>
            <div className="h-5 w-px bg-slate-800" />
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20">
              {caseData.case_id}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {caseData.case_number}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBsaModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Generate Section 63B BSA Certificate</span>
            </button>

            <button
              onClick={() => onAskCopilot(`Provide a complete executive summary of ${caseData.case_id}`)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Ask Copilot About This Case</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">{caseData.title}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Category: <strong className="text-slate-300">{caseData.category}</strong> &bull; Jurisdiction: <strong className="text-slate-300">{caseData.region_name}</strong> &bull; Registered: <span className="font-mono text-slate-300">{caseData.registration_date}</span>
          </p>
        </div>

        {/* Quick Officer Metadata Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Lead Officer</span>
            <span className="font-bold text-slate-200">{caseData.investigator_name}</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Investigation Status</span>
            <span className="font-bold text-emerald-400">{caseData.status}</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registered Evidence</span>
            <span className="font-bold text-blue-400">{caseData.stats.evidence} Verified Files</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Cross-Case Connection</span>
            <span className="font-bold text-amber-400">Bridge to CASE-041</span>
          </div>
        </div>
      </div>

      {/* SECTION A: Case Summary with Wikipedia-Style Interactive Hover */}
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Investigation Narrative & Evidentiary Traceability</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            Hover over highlighted evidence tokens to preview verified records
          </span>
        </div>

        {/* Narrative Text with Wikipedia-Style Interactive Evidentiary Tokens */}
        <div className="text-xs text-slate-300 leading-relaxed space-y-3 bg-slate-900/50 p-5 rounded-xl border border-slate-800/80">
          <p>
            On 09 June 2026 at approximately 11:15 IST, the finance treasury desk of Zenith Technologies Ltd received a spear-phishing email ostensibly from their Managing Director requesting urgent authorization for offshore vendor clearance. The communication directed the victim CFO to a malicious credential-harvesting portal hosted on{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'DOMAIN-AUTH')}
              onMouseLeave={handleWikiLeave}
              className="text-blue-400 underline decoration-blue-500/50 font-mono font-semibold cursor-pointer hover:text-blue-300 transition px-1 py-0.5 rounded bg-blue-950/40 border border-blue-800/40"
            >
              secure-zenithcorp-auth.com
            </span>
            . Upon entry of executive credentials, unauthorized two-factor tokens were intercepted by command IP 198.51.100.45.
          </p>

          <p>
            At 14:10 IST, an unauthorized RTGS wire transfer of{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'ACC-1001')}
              onMouseLeave={handleWikiLeave}
              className="text-emerald-400 underline decoration-emerald-500/50 font-bold cursor-pointer hover:text-emerald-300 transition px-1 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40"
            >
              ₹1,00,00,000 (One Crore INR)
            </span>{' '}
            was executed directly from{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'ACC-1001')}
              onMouseLeave={handleWikiLeave}
              className="text-emerald-400 underline decoration-emerald-500/50 font-mono font-semibold cursor-pointer hover:text-emerald-300 transition px-1 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40"
            >
              Zenith Corporate Account ACC-1001
            </span>{' '}
            into beneficiary mule account{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'ACC-2201')}
              onMouseLeave={handleWikiLeave}
              className="text-emerald-400 underline decoration-emerald-500/50 font-mono font-semibold cursor-pointer hover:text-emerald-300 transition px-1 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40"
            >
              ACC-2201 (Suman Roy)
            </span>
            , as documented in formal police report{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'EVD-001')}
              onMouseLeave={handleWikiLeave}
              className="text-cyan-400 underline decoration-cyan-500/50 font-mono font-bold cursor-pointer hover:text-cyan-300 transition px-1 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40"
            >
              FIR 0018/2026 (EVD-001)
            </span>
            .
          </p>

          <p>
            Within 25 minutes of receipt, funds were rapidly layered across multiple student and shell accounts before aggregating into the account of strategic financial broker{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'PER-103')}
              onMouseLeave={handleWikiLeave}
              className="text-red-400 underline decoration-red-500/50 font-semibold cursor-pointer hover:text-red-300 transition px-1 py-0.5 rounded bg-red-950/40 border border-red-800/40"
            >
              Devrat Sharma (PER-103)
            </span>
            . Subsequent financial intelligence surveillance by FIU-IND captured transfer{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'TXN_552')}
              onMouseLeave={handleWikiLeave}
              className="text-amber-400 underline decoration-amber-500/50 font-mono font-bold cursor-pointer hover:text-amber-300 transition px-1 py-0.5 rounded bg-amber-950/40 border border-amber-800/40"
            >
              TXN_552 (₹50,00,000)
            </span>{' '}
            funneling heist proceeds directly into Mumbai corporate front company{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'ACC-7701')}
              onMouseLeave={handleWikiLeave}
              className="text-emerald-400 underline decoration-emerald-500/50 font-mono font-semibold cursor-pointer hover:text-emerald-300 transition px-1 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40"
            >
              Apex Trade Solutions (ACC-7701)
            </span>
            , definitively bridging Case #018 with Operation ShadowLedge (Case #041) under{' '}
            <span
              onMouseEnter={(e) => handleWikiHover(e, 'EVD-002')}
              onMouseLeave={handleWikiLeave}
              className="text-cyan-400 underline decoration-cyan-500/50 font-mono font-bold cursor-pointer hover:text-cyan-300 transition px-1 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40"
            >
              FIU Advisory STR-88912 (EVD-002)
            </span>
            .
          </p>
        </div>

        {/* Wikipedia Floating Popover Tooltip */}
        {activeTooltip && (
          <div 
            style={{ top: `${tooltipPos.y}px`, left: `${Math.min(tooltipPos.x, window.innerWidth - 380)}px` }}
            className="fixed z-50 w-80 bg-[#131b2e] border border-blue-500/50 rounded-xl p-4 shadow-2xl space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeTooltip.type}
              </span>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {activeTooltip.status}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm">{activeTooltip.title}</h4>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{activeTooltip.docId}</p>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              "{activeTooltip.snippet}"
            </p>

            <div className="pt-1 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>SHA-256 Hash:</span>
              <span className="text-blue-300 truncate max-w-[170px]">{activeTooltip.hash}</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION B: Real Entity Network Map */}
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                REAL ENTITIES VISUALIZATION
              </span>
              <h2 className="text-lg font-bold text-white">Case Criminal Network Map</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Force-directed graph of suspect persons, bank accounts, cell phones, locations, and cyber endpoints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'person', 'account', 'phone', 'location'].map((filter) => (
              <button
                key={filter}
                onClick={() => setMapFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition capitalize ${
                  mapFilter === filter
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {filter === 'ALL' ? 'All Entities' : `${filter}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Network Diagram Grid / Canvas */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-6 min-h-[380px] relative overflow-hidden flex flex-col justify-between">
          {/* Nodes Showcase Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {mapNodes
              .filter(n => mapFilter === 'ALL' || n.type === mapFilter)
              .map((node) => {
                const IconComponent = node.icon;
                return (
                  <div
                    key={node.id}
                    onClick={() => onSelectEntity({ person_id: node.id, name: node.label, role: node.sub })}
                    className={`p-3 rounded-xl border transition cursor-pointer hover:scale-[1.02] shadow-md flex flex-col items-center text-center space-y-2 ${node.color}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block truncate max-w-[140px]">{node.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[140px]">{node.sub}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Key Connections / Edges Legend */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Corroborated Transactional & Telephony Links:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {mapEdges.map((edge, idx) => (
                <div 
                  key={idx} 
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                    edge.bridge 
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold' 
                      : edge.highlight 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <span>{edge.from}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-slate-200">{edge.label}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span>{edge.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C: Prime Suspects List */}
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Prime Suspects & Persons of Interest</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {primeSuspects.length} Identified Individuals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {primeSuspects.map((suspect) => (
            <div
              key={suspect.person_id}
              className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 rounded-xl p-4.5 space-y-3 shadow-md transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    suspect.is_bridge ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
                  }`}>
                    {suspect.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                      {suspect.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 block font-medium">"{suspect.alias}"</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {suspect.person_id}
                </span>
              </div>

              {/* Suspect Role & Location */}
              <div className="text-xs space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Role:</span>
                  <span className="font-semibold text-slate-200">{suspect.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono text-slate-300">{suspect.phone}</span>
                </div>
                {suspect.pan && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">PAN ID:</span>
                    <span className="font-mono text-slate-300">{suspect.pan}</span>
                  </div>
                )}
              </div>

              {/* Risk Score Meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Investigative Risk Score:</span>
                  <span className={`font-mono font-bold ${
                    suspect.risk_score >= 90 ? 'text-red-400' : suspect.risk_score >= 75 ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    {suspect.risk_score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      suspect.risk_score >= 90 ? 'bg-red-500' : suspect.risk_score >= 75 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${suspect.risk_score}%` }}
                  />
                </div>
              </div>

              {/* Inspect Button */}
              <button
                onClick={() => onSelectEntity(suspect)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Inspect Suspect Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION D: Review Investigation (Live Reconstruction Engine) */}
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                SIGNATURE FEATURE
              </span>
              <h2 className="text-lg font-bold text-white">Review Investigation — Live Chronological Reconstruction</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates progressive investigation replay. As evidence-backed events are narrated, entity cards pop up and animated connecting links are drawn dynamically.
            </p>
          </div>

          {/* Master Playback Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Replay' : currentStep === 0 ? 'START INVESTIGATION' : 'Resume Replay'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Reset to Event 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setVoiceAudio(!voiceAudio)}
              className={`p-2 rounded-xl border transition ${
                voiceAudio ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
              title="Toggle Audio Narration"
            >
              {voiceAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Audio Narration Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono font-bold text-blue-400">
                EVENT {caseEvents[currentStep]?.event_number || 1} OF {caseEvents.length}:
              </span>
              <span className="font-mono text-slate-400">{caseEvents[currentStep]?.timestamp}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Ref: <strong className="text-slate-300">{caseEvents[currentStep]?.evidence_reference}</strong>
            </span>
          </div>

          <p className="text-sm font-semibold text-white leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
            "{caseEvents[currentStep]?.narration}"
          </p>
        </div>

        {/* Dynamic Construction Stage: Cards with Animated Links */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-6 min-h-[300px] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Live Network Construction Stage (Click any entity to expand details):
            </span>
            <span className="text-xs font-mono text-blue-400">
              {currentStep + 1} / {caseEvents.length} Events Reconstructed
            </span>
          </div>

          {/* Dynamically Revealed Entity Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 relative z-10">
            {/* Step 0: Initial Debited Victim & Heist Beneficiary */}
            <div 
              onClick={() => onSelectEntity({ name: 'Vikramaditya Rathore', role: 'Victim CFO (Zenith Tech Ltd)' })}
              className="p-3 rounded-xl bg-slate-900 border border-blue-500/40 text-center cursor-pointer hover:border-blue-400 transition"
            >
              <User className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block truncate">V. Rathore (CFO)</span>
              <span className="text-[10px] text-slate-400 font-mono">PER-108</span>
            </div>

            <div 
              onClick={() => onSelectEntity({ name: 'ACC-1001', role: 'Zenith Tech Corporate Account' })}
              className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-center cursor-pointer hover:border-emerald-400 transition"
            >
              <CreditCard className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block truncate">Zenith ACC-1001</span>
              <span className="text-[10px] text-emerald-400 font-mono">₹1.0 Cr Debited</span>
            </div>

            {/* Revealed in Step 1 */}
            {currentStep >= 0 && (
              <div 
                onClick={() => onSelectEntity({ name: 'Suman Roy', role: 'Primary Mule Account Holder' })}
                className="p-3 rounded-xl bg-slate-900 border border-amber-500/40 text-center cursor-pointer hover:border-amber-400 transition animate-in fade-in zoom-in-95 duration-200"
              >
                <CreditCard className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block truncate">Suman Roy ACC-2201</span>
                <span className="text-[10px] text-amber-400 font-mono">Primary Mule</span>
              </div>
            )}

            {/* Revealed in Step 2: Layering accounts */}
            {currentStep >= 1 && (
              <div 
                onClick={() => onSelectEntity({ name: 'ACC-3301 & ACC-3302', role: 'Layering Mule Accounts' })}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center cursor-pointer hover:border-slate-500 transition animate-in fade-in zoom-in-95 duration-200"
              >
                <CreditCard className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block truncate">5 Layering A/Cs</span>
                <span className="text-[10px] text-slate-400 font-mono">ACC-3301..8809</span>
              </div>
            )}

            {/* Revealed in Step 3: Broker Devrat Sharma */}
            {currentStep >= 2 && (
              <div 
                onClick={() => onSelectEntity({ name: 'Devrat Sharma', role: 'Strategic Money Broker (PER-103)', is_bridge: true })}
                className="p-3 rounded-xl bg-red-950/40 border border-red-500 text-center cursor-pointer hover:scale-105 transition animate-in fade-in zoom-in-95 duration-200 shadow-lg shadow-red-500/10"
              >
                <User className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block truncate">Devrat Sharma</span>
                <span className="text-[10px] text-red-400 font-bold font-mono">BROKER D (ACC-7702)</span>
              </div>
            )}

            {/* Revealed in Step 4/5: Cross-Case Bridge into Mumbai Hawala */}
            {currentStep >= 4 && (
              <div 
                onClick={() => onSelectEntity({ name: 'Apex Trade Solutions', role: 'Mumbai Shell Company ACC-7701' })}
                className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-400 text-center cursor-pointer hover:scale-105 transition animate-in fade-in zoom-in-95 duration-200 shadow-lg shadow-cyan-500/20"
              >
                <CreditCard className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block truncate">Apex Trade ACC-7701</span>
                <span className="text-[10px] text-cyan-300 font-bold font-mono">CROSS-CASE BRIDGE</span>
              </div>
            )}
          </div>

          {/* Visual Connecting Animated Link Bar */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>Animated Link Path:</span>
              <strong className="text-white">
                {currentStep === 0 && "ACC-1001 ──[ ₹1.0 Cr RTGS ]──► ACC-2201 (Suman Roy)"}
                {currentStep === 1 && "ACC-2201 ──[ 5 IMPS tranches ]──► Secondary Mules (ACC-3301..8809)"}
                {currentStep === 2 && "Secondary Mules ──[ Aggregation ]──► Devrat Sharma (ACC-7702)"}
                {currentStep === 3 && "Devrat Sharma PH-1003 ──[ Voice Call ]──► Tariq Merchant PH-1005 (Mumbai)"}
                {currentStep >= 4 && "Devrat Sharma ──[ TXN_552 (₹50 Lakhs) ]──► Apex Trade Solutions (CASE-041 Bridge)"}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 disabled:opacity-40"
              >
                Prev Event
              </button>
              <button
                disabled={currentStep >= caseEvents.length - 1}
                onClick={() => setCurrentStep(prev => Math.min(caseEvents.length - 1, prev + 1))}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold disabled:opacity-40"
              >
                Next Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION E: Laws Broken (Statutory Criminal Offences Violated) */}
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Statutory Criminal Offences & Laws Broken</h2>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
            {lawsBroken.length} Statutorily Mapped Violations
          </span>
        </div>

        <p className="text-xs text-slate-400">
          The following provisions of the Information Technology Act, Bharatiya Nyaya Sanhita (BNS), and Prevention of Money Laundering Act (PMLA) have been established through corroborated digital and banking evidence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lawsBroken.map((law, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {law.act}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{law.section}: {law.title}</h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                {law.description}
              </p>

              <div className="text-[11px] space-y-1 pt-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Prescribed Penalty:</span>
                  <strong className="text-amber-300">{law.penalty}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Supporting Evidentiary Link:</span>
                  <span className="font-mono text-cyan-300">{law.evidenceRef}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION F: BSA Evidence Certificate Modal */}
      {isBsaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0f1422] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Section 63B BSA Electronic Evidence Certificate</h3>
                  <p className="text-xs text-slate-400">Bharatiya Sakshya Adhiniyam, 2023 (Admissibility of Electronic Records)</p>
                </div>
              </div>

              <button
                onClick={() => setIsBsaModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs bg-slate-950 font-sans">
              <div className="border-2 border-slate-700 p-8 rounded-xl space-y-5 bg-slate-900/40">
                <div className="text-center border-b border-slate-700 pb-4 space-y-1">
                  <h2 className="text-base font-black tracking-wider text-white uppercase">
                    CERTIFICATE UNDER SECTION 63B BHARATIYA SAKSHYA ADHINIYAM, 2023
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    (In replacement of Section 65B of the Indian Evidence Act, 1872)
                  </p>
                  <p className="text-[10px] font-mono text-cyan-400">
                    Certificate ID: BSA-63B-2026-NCR-018
                  </p>
                </div>

                <p className="text-slate-300 leading-relaxed text-justify">
                  I, <strong>{caseData.investigator_name}</strong>, Lead Case Investigating Officer, Cyber Crime Police Station (Region Code: {caseData.jurisdiction}), do hereby certify that the electronic records, log extractions, transaction datasets, and cell tower dump files associated with <strong>{caseData.title} ({caseData.case_number})</strong> were retrieved from lawful computer systems in the ordinary course of investigative inquiry.
                </p>

                {/* Evidence Hashes Table */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-200 block uppercase">Cryptographically Certified Artifacts:</span>
                  <table className="w-full border-collapse border border-slate-800 text-[11px] font-mono">
                    <thead>
                      <tr className="bg-slate-800 text-slate-300">
                        <th className="p-2 border border-slate-700 text-left">Evidence ID</th>
                        <th className="p-2 border border-slate-700 text-left">Filename & Source</th>
                        <th className="p-2 border border-slate-700 text-left">SHA-256 Digest</th>
                        <th className="p-2 border border-slate-700 text-left">Integrity Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {RAW_DATASET.evidence.map(ev => (
                        <tr key={ev.evidence_id}>
                          <td className="p-2 border border-slate-800 text-blue-400 font-bold">{ev.evidence_id}</td>
                          <td className="p-2 border border-slate-800">{ev.file_name}</td>
                          <td className="p-2 border border-slate-800 text-[10px] break-all">{ev.sha256_hash.slice(0, 24)}...</td>
                          <td className="p-2 border border-slate-800 text-emerald-400 font-bold">MATCH (VERIFIED)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Statutory Sign-off */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">VERIFICATION DATE & PLACE</span>
                    <span className="font-semibold text-white">04-SEP-2026 &bull; Gurugram PS</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Ledger Block: #10402</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">AUTHORIZED SIGNATORY</span>
                    <span className="font-bold text-white">{caseData.investigator_name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Lead Case Officer ({caseData.investigator_id})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <FileText className="w-3.5 h-3.5" />
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
