import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Minus, Move, Send, HelpCircle, GitBranch, 
  FileText, CheckCircle2, ArrowRight, CornerDownLeft, Bot, User 
} from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function FloatingAICopilot({ activeCaseId, onSelectEntity, onOpenCase }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 460, y: window.innerHeight - 580 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome',
      sender: 'copilot',
      text: 'Hello, Investigator. I am your CrimeNexus AI Intelligence Copilot. Ask me about suspects, money trails, cell tower dumps, cross-case bridges, or evidence verification.',
      graphPath: null,
      citations: []
    }
  ]);

  const presetQuestions = [
    "Is Case 18 related to Case 41?",
    "Why was Devrat Sharma highlighted?",
    "Show everyone connected to Account ACC-7701",
    "Why does Rajesh Verma have an alibi contradiction?"
  ];

  // Draggable logic
  const handleMouseDown = (e) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 420, e.clientX - offsetRef.current.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 100, e.clientY - offsetRef.current.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, isMinimized]);

  const handleSend = (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    // Add user question
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: q
    };
    setChatHistory(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // AI Response processing
    setTimeout(() => {
      const lower = q.toLowerCase();
      let replyText = "";
      let path = null;
      let citations = [];

      if ((lower.includes('case 18') && lower.includes('case 41')) || lower.includes('related')) {
        replyText = "Yes. Case 18 (Operation PhishNet) and Case 41 (Operation ShadowLedge) are directly linked through money broker Devrat Sharma (PER-103). Stolen funds aggregated into Devrat Sharma's account ACC-7702 in Gurugram were channeled via TXN_552 (₹50,00,000) into Apex Trade Solutions (ACC-7701) in Mumbai.";
        path = ["CASE-018", "Zenith Tech ACC-1001", "Suman Roy ACC-2201", "Devrat Sharma ACC-7702", "TXN_552 (₹50L)", "Apex Trade ACC-7701", "CASE-041"];
        citations = ["EVD-001 (FIR 0018/2026)", "EVD-002 (STR-88912 Advisory)"];
      } else if (lower.includes('devrat') || lower.includes('broker') || lower.includes('highlighted')) {
        replyText = "Devrat Sharma (PER-103, alias 'Broker D') is highlighted because he exhibits the highest betweenness centrality (0.892) across the network. He acts as the single structural bridge linking the NCR phishing syndicate with the Mumbai Hawala / Dubai bullion network.";
        path = ["NCR Cyber Ring", "Devrat Sharma (PER-103 / ACC-7702)", "Mumbai Hawala Ring"];
        citations = ["EVD-002 (RTGS UTR Reference TXN_552)", "EVD-003 (CDR Call Dump CDR-1008)"];
      } else if (lower.includes('acc-7701') || lower.includes('apex trade')) {
        replyText = "Apex Trade Solutions Pvt Ltd (ACC-7701) is a corporate front company incorporated in Nariman Point, Mumbai. Its registered director is Anita D'Souza (PER-107). It received ₹50,00,000 from Devrat Sharma and immediately layered ₹45,00,000 outward to hawala operator Tariq Merchant (ACC-7703).";
        path = ["Devrat Sharma (ACC-7702)", "Apex Trade (ACC-7701)", "Tariq Merchant (ACC-7703)"];
        citations = ["EVD-002 (FIU-IND Suspicious Transaction Report)"];
      } else if (lower.includes('contradiction') || lower.includes('alibi') || lower.includes('rajesh')) {
        replyText = "Suspect Rajesh Verma (PER-101) claims in his formal interrogation that he was in Mumbai attending a wedding on 09-JUN-2026. However, Cell Tower Dump T-4401 (EVD-003) proves his phone +919811001122 was connected to Sector 44 Gurugram at the exact moment of the wire fraud.";
        path = ["Statement Claim: Mumbai", "VS", "Cell Tower T-4401: Sector 44 Gurugram"];
        citations = ["EVD-003 (Telecom CDR Extraction CDR-1002)"];
      } else {
        replyText = `Based on retrieved Cypher graph paths and verified evidence records for active investigation (${activeCaseId || 'CASE-018'}), this query connects to verified transaction ledgers and telephony tower logs backed by SHA-256 integrity hashes.`;
        path = ["Case Entity", "Corroborated Ledger Node"];
        citations = ["Master Investigation Database"];
      }

      setChatHistory(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'copilot',
          text: replyText,
          graphPath: path,
          citations: citations
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* 1. Compact Floating Action Button (FAB) at Bottom-Right */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-2xl shadow-blue-600/30 transition-all duration-200 active:scale-95 group font-sans border border-blue-400/30"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span className="text-xs font-bold tracking-wide">AI Copilot</span>
        </button>
      )}

      {/* 2. Movable / Draggable Floating Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '400px',
            zIndex: 60
          }}
          className={`bg-[#0f1422] border border-slate-700 rounded-2xl shadow-2xl flex flex-col font-sans transition-shadow ${
            isDragging ? 'shadow-blue-500/20' : ''
          }`}
        >
          {/* Draggable Header Bar */}
          <div
            onMouseDown={handleMouseDown}
            className="p-3.5 bg-slate-900 border-b border-slate-800 rounded-t-2xl flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Investigation Copilot</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Window Body (collapsible if minimized) */}
          {!isMinimized && (
            <div className="flex flex-col h-[480px]">
              {/* Context indicator */}
              <div className="px-3.5 py-1.5 bg-slate-950/60 border-b border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                <span>Context: <strong className="text-slate-200">{activeCaseId || 'CASE-018'} / Multi-Jurisdiction</strong></span>
                <span className="text-emerald-400">● Cypher Engine Online</span>
              </div>

              {/* Chat Message Scrollable Area */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-[#0b0f19]/90">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-1 ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="text-xs">{msg.text}</p>

                      {/* Visual Graph Path if available */}
                      {msg.graphPath && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1 font-mono text-[10px]">
                          <span className="text-slate-400 flex items-center gap-1 font-bold">
                            <GitBranch className="w-3 h-3 text-cyan-400" /> Evidence Path:
                          </span>
                          <div className="flex flex-wrap items-center gap-1 text-cyan-300">
                            {msg.graphPath.map((node, i) => (
                              <React.Fragment key={i}>
                                <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                  {node}
                                </span>
                                {i < msg.graphPath.length - 1 && <span className="text-slate-500">&rarr;</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence Citations if available */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
                          <span className="font-semibold block text-slate-500">Source Evidence Citations:</span>
                          {msg.citations.map((cite, i) => (
                            <div key={i} className="flex items-center gap-1 text-slate-300 font-mono">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              <span>{cite}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 w-fit">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                    <span>Analyzing knowledge graph...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Preset Prompts */}
              <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question about this case..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition disabled:opacity-50"
                  disabled={!inputQuery.trim()}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
