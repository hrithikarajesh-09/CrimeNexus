import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ShieldCheck, FileText, User, CreditCard, Phone, 
  Laptop, MapPin, Play, Pause, RotateCcw, Volume2, VolumeX, 
  ExternalLink, CheckCircle2, AlertTriangle, Scale, Sparkles, ChevronRight, X, Info,
  FastForward, Film, Building2, Globe, Send, Radio
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

  // Play subtle sonic audio chime
  const playAudioChime = () => {
    if (!voiceAudio) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
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

  // ==========================================
  // ALL GRAPH NODES DEFINITION
  // ==========================================
  const allGraphNodes = [
    { id: 'PER-108', label: 'Vikramaditya', sub: 'CFO (Victim)', type: 'person', x: 80, y: 150, icon: User, color: '#38BDF8', border: '#0284C7' },
    { id: 'ACC-1001', label: 'Zenith Tech A/C', sub: 'Corporate ACC-1001', type: 'account', x: 210, y: 150, icon: CreditCard, color: '#38BDF8', border: '#0284C7' },
    { id: 'ACC-2201', label: 'Suman Roy A/C', sub: 'Primary Mule ACC-2201', type: 'account', x: 350, y: 150, icon: CreditCard, color: '#F43F5E', border: '#BE123C' },
    { id: 'PER-104', label: 'Suman Roy', sub: 'Mule Accountholder', type: 'person', x: 350, y: 250, icon: User, color: '#F43F5E', border: '#BE123C' },
    { id: 'ACC-MULES', label: '5 Secondary Mules', sub: 'Layering Accounts', type: 'account', x: 490, y: 250, icon: CreditCard, color: '#F43F5E', border: '#BE123C' },
    { id: 'PER-101', label: 'Rajesh Verma', sub: 'Syndicate Operator', type: 'person', x: 350, y: 50, icon: User, color: '#F43F5E', border: '#BE123C' },
    { id: 'LOC-101', label: 'Tower T-4401', sub: 'Sec 44 Gurugram', type: 'location', x: 490, y: 50, icon: Radio, color: '#94A3B8', border: '#475569' },
    { id: 'PER-102', label: 'Kunal Shah', sub: 'Technical Operator', type: 'person', x: 630, y: 50, icon: Laptop, color: '#38BDF8', border: '#0284C7' },
    { id: 'PER-103', label: 'Devrat Sharma', sub: 'Bridge Money Broker', type: 'person', x: 520, y: 150, icon: User, color: '#F59E0B', border: '#D97706', isBridge: true },
    { id: 'ACC-7701', label: 'Apex Trade Solutions', sub: 'Case 041 Shell Front', type: 'account', x: 690, y: 150, icon: Building2, color: '#F59E0B', border: '#D97706', isBridge: true },
    { id: 'PER-105', label: 'Tariq Merchant', sub: 'Hawala Operator', type: 'person', x: 840, y: 150, icon: User, color: '#F43F5E', border: '#BE123C' },
    { id: 'ACC-7705', label: 'Dubai Bullion A/C', sub: 'Offshore Account', type: 'account', x: 840, y: 250, icon: CreditCard, color: '#38BDF8', border: '#0284C7' }
  ];

  // ==========================================
  // ALL GRAPH EDGES DEFINITION
  // ==========================================
  const allGraphEdges = [
    { from: 'PER-108', to: 'ACC-1001', label: 'Signatory', color: '#38BDF8' },
    { from: 'ACC-1001', to: 'ACC-2201', label: '₹1.00 Cr RTGS', color: '#F43F5E', strokeWidth: 2.2, animated: true },
    { from: 'ACC-2201', to: 'PER-104', label: 'Registered To', color: '#94A3B8' },
    { from: 'ACC-2201', to: 'ACC-MULES', label: '5x ₹20L Tranches', color: '#F43F5E', animated: true },
    { from: 'PER-101', to: 'LOC-101', label: 'Tower Presence', color: '#94A3B8' },
    { from: 'PER-102', to: 'LOC-101', label: 'IP / Dev Logs', color: '#94A3B8' },
    { from: 'ACC-MULES', to: 'PER-103', label: '₹70L Aggregated', color: '#F59E0B', animated: true },
    { from: 'LOC-101', to: 'PER-103', label: 'Voice Call', color: '#94A3B8' },
    { from: 'PER-103', to: 'ACC-7701', label: 'TXN_552 (₹50L Bridge)', color: '#F59E0B', strokeWidth: 2.8, animated: true, isBridge: true },
    { from: 'ACC-7701', to: 'PER-105', label: '₹45L Cash Out', color: '#F43F5E' },
    { from: 'PER-105', to: 'ACC-7705', label: 'SWIFT Wire', color: '#38BDF8', animated: true }
  ];

  // Graph step configuration for the Live Construction replay:
  // Step 0: Vikramaditya -> Zenith Tech A/C
  // Step 1: Zenith Tech A/C -> Suman Roy A/C -> Suman Roy (Mule)
  // Step 2: Suman Roy A/C -> 5 Secondary Mules
  // Step 3: Rajesh Verma, Kunal Shah, Tower T-4401
  // Step 4: Devrat Sharma (Broker) + TXN_552 Bridge to Apex Trade Solutions (Mumbai)
  // Step 5: Tariq Merchant (Hawala) + Dubai Bullion A/C
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

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 font-sans">
      
      {/* Top Breadcrumb & Clean Header */}
      <div className="panel rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-dark-subtle hover:bg-dark-panel border border-dark-border text-brand-slate hover:text-white transition flex items-center gap-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4 text-brand-accent" />
              <span>Back to Cases</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
              {caseData.case_id}
            </span>
            <span className="text-xs font-mono text-dark-slate">
              {caseData.case_number}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsBsaModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-dark-subtle hover:bg-dark-panel border border-brand-emerald/30 text-emerald-400 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Section 63B BSA Certificate</span>
            </button>

            <button
              onClick={() => onAskCopilot(`Provide a complete executive summary of ${caseData.case_id}`)}
              className="px-3.5 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{caseData.title}</h1>
          <p className="text-xs text-brand-slate mt-1">
            Category: <strong className="text-white">{caseData.category}</strong> &bull; Jurisdiction: <strong className="text-brand-accent">{caseData.region_name}</strong> &bull; Registered: <span className="font-mono text-brand-slate">{caseData.registration_date}</span>
          </p>
        </div>

        {/* Minimal Officer Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-dark-border text-xs">
          <div>
            <span className="text-dark-slate block text-[11px]">Lead Officer</span>
            <span className="font-semibold text-white mt-0.5 block">{caseData.investigator_name}</span>
          </div>
          <div>
            <span className="text-dark-slate block text-[11px]">Investigation Status</span>
            <span className="font-semibold text-brand-accent mt-0.5 block">{caseData.status}</span>
          </div>
          <div>
            <span className="text-dark-slate block text-[11px]">Registered Evidence</span>
            <span className="font-semibold text-brand-emerald mt-0.5 block">{caseData.stats.evidence} Verified Records</span>
          </div>
          <div>
            <span className="text-dark-slate block text-[11px]">Cross-Case Link</span>
            <span className="font-semibold text-brand-amber mt-0.5 block">Bridge to CASE-041 (TXN_552)</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: CLEAN INVESTIGATION SUMMARY (UNBOXED POINTS)    */}
      {/* ========================================================= */}
      <div className="panel rounded-xl p-6 shadow-sm space-y-4 relative">
        <div className="flex items-center justify-between border-b border-dark-border pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-accent" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Investigation Summary</h2>
          </div>
          <span className="text-[11px] text-brand-slate font-mono flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-brand-accent" />
            Hover over highlighted tokens for evidence preview
          </span>
        </div>

        {/* Clean, Aesthetic Point-by-Point Narrative (NO NESTED BOXES) */}
        <div className="space-y-3.5 text-xs text-brand-slate leading-relaxed pt-1">
          <div className="flex items-start gap-3">
            <span className="text-brand-accent font-mono text-sm leading-none mt-0.5">•</span>
            <p>
              Corporate finance treasury received an executive spoofing email prompting urgent vendor clearance via duplicate portal{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'DOMAIN-AUTH')}
                onMouseLeave={handleWikiLeave}
                className="text-brand-accent hover:underline font-mono font-medium cursor-pointer border-b border-brand-accent/40"
              >
                secure-zenithcorp-auth.com
              </span>
              . Rogue 2FA token intercepted by IP 198.51.100.45.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-brand-accent font-mono text-sm leading-none mt-0.5">•</span>
            <p>
              Unauthorized RTGS debit of{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'ACC-1001')}
                onMouseLeave={handleWikiLeave}
                className="text-white font-semibold hover:underline cursor-pointer border-b border-white/40"
              >
                ₹1,00,00,000 (One Crore INR)
              </span>{' '}
              executed from{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'ACC-1001')}
                onMouseLeave={handleWikiLeave}
                className="text-white font-mono hover:underline cursor-pointer border-b border-white/40"
              >
                Zenith Corporate Account ACC-1001
              </span>{' '}
              into primary mule account{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'ACC-2201')}
                onMouseLeave={handleWikiLeave}
                className="text-brand-rose font-mono hover:underline cursor-pointer border-b border-brand-rose/40"
              >
                ACC-2201 (Suman Roy)
              </span>
              , registered under{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'EVD-001')}
                onMouseLeave={handleWikiLeave}
                className="text-brand-emerald font-mono font-medium hover:underline cursor-pointer border-b border-brand-emerald/40"
              >
                FIR 0018/2026 (EVD-001)
              </span>
              .
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-brand-accent font-mono text-sm leading-none mt-0.5">•</span>
            <p>
              Within 25 minutes, Account ACC-2201 split the ₹1.0 Cr across 5 secondary student and shell accounts (ACC-3301 through ACC-8809) in ₹20L tranches to prevent automated banking AML freezes.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-brand-accent font-mono text-sm leading-none mt-0.5">•</span>
            <p>
              Mule accounts funneled ₹70,00,000 into broker account ACC-7702 controlled by{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'PER-103')}
                onMouseLeave={handleWikiLeave}
                className="text-brand-amber font-semibold hover:underline cursor-pointer border-b border-brand-amber/40"
              >
                Devrat Sharma (PER-103, alias Broker D)
              </span>
              . Cell Tower Dump{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'EVD-003')}
                onMouseLeave={handleWikiLeave}
                className="text-brand-emerald font-mono hover:underline cursor-pointer border-b border-brand-emerald/40"
              >
                T-4401 (EVD-003)
              </span>{' '}
              confirmed simultaneous telephony coordination with syndicate chief Rajesh Verma and technician Kunal Shah.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-brand-accent font-mono text-sm leading-none mt-0.5">•</span>
            <p>
              Broker Devrat Sharma executed crucial transfer{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'TXN_552')}
                onMouseLeave={handleWikiLeave}
                className="text-brand-amber font-mono font-semibold hover:underline cursor-pointer border-b border-brand-amber/40"
              >
                TXN_552 (₹50,00,000)
              </span>{' '}
              into Mumbai shell front company{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'ACC-7701')}
                onMouseLeave={handleWikiLeave}
                className="text-brand-amber font-mono hover:underline cursor-pointer border-b border-brand-amber/40"
              >
                Apex Trade Solutions (ACC-7701)
              </span>
              , directly bridging Case #018 with Mumbai Operation ShadowLedge under{' '}
              <span
                onMouseEnter={(e) => handleWikiHover(e, 'EVD-002')}
                onMouseLeave={handleWikiLeave}
                className="text-brand-emerald font-mono font-medium hover:underline cursor-pointer border-b border-brand-emerald/40"
              >
                FIU Advisory STR-88912 (EVD-002)
              </span>
              .
            </p>
          </div>
        </div>

        {/* Minimal Wikipedia Popover Tooltip */}
        {activeTooltip && (
          <div 
            style={{ top: `${tooltipPos.y}px`, left: `${Math.min(tooltipPos.x, window.innerWidth - 380)}px` }}
            className="fixed z-50 w-80 bg-dark-panel border border-white/20 rounded-lg p-4 shadow-xl space-y-2 text-xs animate-in fade-in duration-100 pointer-events-none"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-[10px] font-mono font-semibold text-brand-accent">
                {activeTooltip.type}
              </span>
              <span className="text-[10px] font-mono text-brand-emerald flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {activeTooltip.status}
              </span>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm">{activeTooltip.title}</h4>
              <p className="text-[11px] text-brand-slate font-mono mt-0.5">{activeTooltip.docId}</p>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug bg-dark-bg p-2 rounded border border-white/5">
              "{activeTooltip.snippet}"
            </p>

            <div className="pt-1 text-[10px] font-mono text-dark-slate flex items-center justify-between">
              <span>SHA-256:</span>
              <span className="text-brand-accent truncate max-w-[190px]">{activeTooltip.hash}</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: AESTHETIC KNOWLEDGE GRAPH (CLEAN NODES & LINES) */}
      {/* ========================================================= */}
      <div className="panel rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-accent" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Case Network Map</h2>
            </div>
            <p className="text-xs text-brand-slate mt-0.5">
              Topological knowledge graph with clean entities, transaction conduits, and cross-case bridge pathways.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-brand-slate">
              <span className="w-2 h-2 rounded-full bg-brand-accent" /> Core Incident
            </span>
            <span className="flex items-center gap-1.5 text-brand-slate">
              <span className="w-2 h-2 rounded-full bg-brand-rose" /> Mule / Fraud
            </span>
            <span className="flex items-center gap-1.5 text-brand-amber font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-amber" /> Cross-Case Bridge (TXN_552)
            </span>
          </div>
        </div>

        {/* Clean, Aesthetic SVG Canvas */}
        <div className="bg-[#08090D] border border-dark-border rounded-lg p-3 min-h-[380px] relative overflow-x-auto select-none">
          <svg className="w-full min-w-[940px] h-[330px]" viewBox="0 0 940 330">
            {/* Render Connecting Lines (Clean, no clunky badge boxes) */}
            {allGraphEdges.map((edge, i) => {
              const srcNode = allGraphNodes.find(n => n.id === edge.from);
              const tgtNode = allGraphNodes.find(n => n.id === edge.to);
              if (!srcNode || !tgtNode) return null;

              const isHighlighted = selectedMapNode ? (selectedMapNode === srcNode.id || selectedMapNode === tgtNode.id) : true;
              const opacity = isHighlighted ? 1 : 0.2;
              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g key={i} style={{ opacity, transition: 'opacity 0.2s' }}>
                  {/* The Line */}
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={edge.color}
                    strokeWidth={edge.strokeWidth || 1.6}
                    strokeOpacity={0.7}
                    className={edge.animated ? 'animated-stream' : ''}
                  />
                  {/* Subtle Clean Label on the line */}
                  <text
                    x={midX}
                    y={midY - 6}
                    textAnchor="middle"
                    fill={edge.color}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="500"
                    opacity={0.85}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Render Clean Nodes */}
            {allGraphNodes.map((node) => {
              const isSelected = selectedMapNode === node.id;
              const NodeIcon = node.icon;
              return (
                <g 
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => {
                    setSelectedMapNode(selectedMapNode === node.id ? null : node.id);
                    onSelectEntity({ person_id: node.id, name: node.label, role: node.sub, is_bridge: node.isBridge });
                  }}
                  className="cursor-pointer group"
                >
                  {/* Clean Node Circle */}
                  <circle
                    r={node.isBridge ? "22" : "18"}
                    fill="#11141D"
                    stroke={isSelected ? "#FFFFFF" : node.color}
                    strokeWidth={node.isBridge ? "2.5" : "1.8"}
                  />

                  {/* Icon */}
                  <foreignObject 
                    x={node.isBridge ? -10 : -8} 
                    y={node.isBridge ? -10 : -8} 
                    width={node.isBridge ? 20 : 16} 
                    height={node.isBridge ? 20 : 16}
                  >
                    <NodeIcon className="w-full h-full" style={{ color: node.color }} />
                  </foreignObject>

                  {/* Clean Text Label (NO BLACK BOX) */}
                  <text
                    textAnchor="middle"
                    y={node.isBridge ? "34" : "30"}
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                  <text
                    textAnchor="middle"
                    y={node.isBridge ? "46" : "42"}
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: LIVE RECONSTRUCTION (ACTUAL DYNAMIC GRAPH GEN) */}
      {/* ========================================================= */}
      <div className="panel rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-brand-primary" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Review Investigation (Live Graph Replay)</h2>
            </div>
            <p className="text-xs text-brand-slate mt-0.5">
              Live automated documentary reconstruction. Voice narrates each chronological event while nodes and connecting lines materialize on the canvas step-by-step.
            </p>
          </div>

          {/* Player Controls Bar */}
          <div className="flex items-center gap-2 bg-dark-bg border border-dark-border p-1.5 rounded-lg">
            <button
              onClick={isPlaying ? () => setIsPlaying(false) : handleStartVideo}
              className={`px-3.5 py-1.5 rounded-md font-semibold text-xs transition flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-brand-accent text-dark-bg'
                  : 'bg-brand-primary text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : currentStep === 0 ? 'Play Investigation' : 'Resume'}</span>
            </button>

            <button
              onClick={handleResetVideo}
              className="p-1.5 rounded-md bg-dark-subtle hover:bg-dark-panel text-brand-slate hover:text-white transition"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setVoiceAudio(!voiceAudio)}
              className={`p-1.5 rounded-md border text-xs font-mono transition flex items-center gap-1 ${
                voiceAudio ? 'bg-brand-primary/15 text-brand-primary border-brand-primary/30' : 'bg-dark-subtle text-dark-slate border-dark-border'
              }`}
              title="Toggle Voice"
            >
              {voiceAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">{voiceAudio ? 'Voice ON' : 'Muted'}</span>
            </button>

            <div className="flex items-center gap-1 px-1 text-xs font-mono">
              {[1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    playbackSpeed === s ? 'bg-white/10 text-white' : 'text-dark-slate hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Progress Scrubber */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-6 gap-1.5">
            {caseEvents.map((evt, idx) => (
              <button
                key={idx}
                onClick={() => handleScrub(idx)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx <= currentStep ? 'bg-brand-primary' : 'bg-dark-subtle hover:bg-white/20'
                }`}
                title={`Event ${idx + 1}: ${evt.timestamp}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-dark-slate">
            <span>Event {currentStep + 1} of {caseEvents.length}: {caseEvents[currentStep]?.timestamp}</span>
            <span>Source: <strong className="text-brand-slate">{caseEvents[currentStep]?.evidence_reference}</strong></span>
          </div>
        </div>

        {/* Narration Subtitle Box */}
        <div className="bg-dark-bg border border-dark-border p-4 rounded-lg flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {isPlaying && voiceAudio ? (
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-0.5 bg-brand-primary rounded-full wave-bar" />
                <span className="w-0.5 bg-brand-accent rounded-full wave-bar" />
                <span className="w-0.5 bg-brand-emerald rounded-full wave-bar" />
                <span className="w-0.5 bg-brand-amber rounded-full wave-bar" />
              </div>
            ) : (
              <span className="w-2 h-2 rounded-full bg-brand-primary block" />
            )}
          </div>
          <p className="text-sm font-medium text-white leading-relaxed">
            "{caseEvents[currentStep]?.narration}"
          </p>
        </div>

        {/* LIVE GRAPH RECONSTRUCTION CANVAS: Nodes and Lines Appear One by One */}
        <div className="bg-[#08090D] border border-dark-border rounded-lg p-3 min-h-[360px] relative overflow-x-auto select-none">
          <div className="absolute top-3 right-3 text-[10px] font-mono text-brand-slate bg-dark-bg/80 px-2 py-1 rounded border border-white/5 z-10">
            Live Knowledge Graph: {activeReplayNodes.length} Entities &bull; {activeReplayEdges.length} Links Active
          </div>

          <svg className="w-full min-w-[940px] h-[330px]" viewBox="0 0 940 330">
            {/* Render Active Edges that have been created so far */}
            {allGraphEdges.map((edge, i) => {
              const isActive = activeReplayEdges.some(e => e.from === edge.from && e.to === edge.to);
              if (!isActive) return null;

              const srcNode = allGraphNodes.find(n => n.id === edge.from);
              const tgtNode = allGraphNodes.find(n => n.id === edge.to);
              if (!srcNode || !tgtNode) return null;

              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

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
                  <text
                    x={midX}
                    y={midY - 6}
                    textAnchor="middle"
                    fill={edge.color}
                    fontSize="9"
                    fontFamily="monospace"
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
              return (
                <g 
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="node-pop cursor-pointer"
                  onClick={() => onSelectEntity({ person_id: node.id, name: node.label, role: node.sub, is_bridge: node.isBridge })}
                >
                  <circle
                    r={node.isBridge ? "22" : "18"}
                    fill="#11141D"
                    stroke={node.color}
                    strokeWidth={node.isBridge ? "2.5" : "1.8"}
                  />

                  <foreignObject 
                    x={node.isBridge ? -10 : -8} 
                    y={node.isBridge ? -10 : -8} 
                    width={node.isBridge ? 20 : 16} 
                    height={node.isBridge ? 20 : 16}
                  >
                    <NodeIcon className="w-full h-full" style={{ color: node.color }} />
                  </foreignObject>

                  <text
                    textAnchor="middle"
                    y={node.isBridge ? "34" : "30"}
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                  <text
                    textAnchor="middle"
                    y={node.isBridge ? "46" : "42"}
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 4: SUSPECTS ROSTER (CLEAN MINIMAL LIST TABLE)      */}
      {/* ========================================================= */}
      <div className="panel rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-dark-border pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-accent" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Prime Suspects Roster</h2>
          </div>
          <span className="text-xs font-mono text-dark-slate">
            {primeSuspects.length} Identified Persons of Interest
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dark-border text-dark-slate font-mono text-[11px]">
                <th className="py-2.5 px-3">Suspect Name</th>
                <th className="py-2.5 px-3">Alias</th>
                <th className="py-2.5 px-3">Operational Role</th>
                <th className="py-2.5 px-3">Phone &amp; Location</th>
                <th className="py-2.5 px-3">PAN</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-brand-slate">
              {primeSuspects.map((suspect) => (
                <tr key={suspect.person_id} className="hover:bg-dark-subtle/50 transition">
                  <td className="py-3 px-3 font-semibold text-white">
                    {suspect.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-brand-accent">
                    "{suspect.alias}"
                  </td>
                  <td className="py-3 px-3">
                    {suspect.is_bridge ? (
                      <span className="text-brand-amber font-semibold font-mono">
                        {suspect.role} (Bridge Broker)
                      </span>
                    ) : (
                      suspect.role
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className="text-slate-300 block">{suspect.phone}</span>
                    <span className="text-dark-slate">{suspect.location}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    {suspect.pan || 'N/A'}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-semibold ${suspect.risk_score >= 90 ? 'text-brand-rose' : 'text-brand-accent'}`}>
                        {suspect.risk_score}%
                      </span>
                      <div className="w-16 bg-dark-bg h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full rounded-full ${suspect.risk_score >= 90 ? 'bg-brand-rose' : 'bg-brand-accent'}`}
                          style={{ width: `${suspect.risk_score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectEntity(suspect)}
                      className="px-2.5 py-1 rounded bg-dark-subtle hover:bg-dark-panel border border-dark-border text-white text-[11px] font-medium transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 5: STATUTORY VIOLATIONS & LAWS BROKEN             */}
      {/* ========================================================= */}
      <div className="panel rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-dark-border pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-emerald" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Statutory Criminal Law Violations</h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {lawsBroken.length} Substantiated Sections
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {lawsBroken.map((law, idx) => (
            <div
              key={idx}
              className="bg-dark-bg border border-dark-border rounded-lg p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                  {law.act}
                </span>
                <span className="text-[10px] font-mono text-brand-emerald">
                  {law.penalty}
                </span>
              </div>
              <h4 className="font-semibold text-white">{law.section}: {law.title}</h4>
              <p className="text-brand-slate leading-relaxed">{law.description}</p>
              <p className="text-[11px] font-mono text-dark-slate pt-1 border-t border-dark-border">
                Proof: <strong className="text-slate-300">{law.evidenceRef}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 63B BSA CERTIFICATE MODAL                         */}
      {/* ========================================================= */}
      {isBsaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#11141D] border border-white/20 w-full max-w-2xl rounded-xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Section 63B Bharatiya Sakshya Adhiniyam Certificate</h3>
              </div>
              <button 
                onClick={() => setIsBsaModalOpen(false)}
                className="p-1 rounded bg-dark-bg hover:bg-dark-subtle text-brand-slate hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-slate-300 leading-relaxed font-serif text-[13px] bg-dark-bg p-5 rounded border border-white/10">
              <p className="text-center font-bold text-white uppercase tracking-wider text-sm">
                IN THE COURT OF THE PRINCIPAL DISTRICT & SESSIONS JUDGE<br />
                CYBER JURISDICTION & COMMERCIAL OFFENCES
              </p>
              <p className="text-center text-xs text-brand-slate font-mono">
                CERTIFICATE UNDER SECTION 63B OF THE BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
              </p>
              <hr className="border-white/10 my-3" />
              <p>
                I, <strong className="text-white">{caseData.investigator_name}</strong>, holding Badge ID <strong className="text-white">{caseData.investigator_badge}</strong>, Lead Investigating Officer at <strong className="text-white">{caseData.region_name}</strong>, hereby certify under Section 63B of the Bharatiya Sakshya Adhiniyam, 2023 that:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  The digital evidence records associated with <strong className="text-white">{caseData.case_id} ({caseData.title})</strong> were lawfully extracted, cryptographically hashed at the time of seizure, and preserved on the Hyperledger immutable evidence registry.
                </li>
                <li>
                  The computer systems and cloud capture gateways were operating normally during the extraction window and no unauthorized alterations occurred.
                </li>
                <li>
                  Hash verification check against SHA-256 baseline confirmed zero tampering:
                  <div className="bg-dark-panel p-2.5 rounded font-mono text-[10px] mt-1 text-emerald-400">
                    EVD-001 (FIR 0018/2026): d4c56ad10356cf2cc8ddfdc26fd4c04f... [MATCH]<br />
                    EVD-002 (STR-88912): afeb4ed06feb8f55c8a7028172dec410... [MATCH]<br />
                    EVD-003 (CDR Tower T-4401): ccfb08874fc7038d541678894b70eee7... [MATCH]
                  </div>
                </li>
              </ol>
              <p className="pt-2">
                Executed under my hand and digital signature on this 5th day of September, 2026.
              </p>
              <div className="flex justify-between pt-4 border-t border-white/10 font-sans text-xs">
                <div>
                  <span className="text-dark-slate block text-[10px]">VERIFIED REGISTRY DIGEST</span>
                  <span className="font-mono text-brand-accent">FABRIC-BLOCK-992144</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold block">{caseData.investigator_name}</span>
                  <span className="text-dark-slate text-[10px]">Lead Cyber Investigator, NCR Cyber PS</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-dark-subtle hover:bg-dark-panel text-white rounded text-xs font-medium border border-dark-border"
              >
                Print Official Certificate
              </button>
              <button
                onClick={() => setIsBsaModalOpen(false)}
                className="px-3.5 py-1.5 bg-brand-primary text-white rounded text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
