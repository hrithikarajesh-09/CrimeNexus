import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Minus, Move, Send, GitBranch, CheckCircle2, Bot 
} from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function FloatingAICopilot({ activeCaseId, onSelectEntity, onOpenCase }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 440, y: window.innerHeight - 560 });
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome',
      sender: 'copilot',
      text: 'Investigator assistant initialized. Query suspect profiles, transaction chains, cell tower intersections, or cross-case bridge pathways.',
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
      const newX = Math.max(10, Math.min(window.innerWidth - 400, e.clientX - offsetRef.current.x));
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

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: q
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I analyzed the multi-jurisdiction graph for that entity.";
      let graphPath = null;
      let citations = [];

      const lowerQ = q.toLowerCase();

      if (lowerQ.includes('case 18') && lowerQ.includes('41')) {
        reply = "Affirmative. Case 018 (Operation PhishNet, NCR) is cryptographically linked to Case 041 (Operation ShadowLedge, Mumbai). Devrat Sharma routed ₹50,00,000 via transaction TXN_552 directly into Mumbai front company Apex Trade Solutions (ACC-7701).";
        graphPath = ['Zenith ACC-1001', 'Mule ACC-2201', 'Broker ACC-7702 (Devrat)', 'TXN_552 [₹50L]', 'Apex Trade ACC-7701'];
        citations = ['EVD-001 (FIR 0018/2026)', 'EVD-002 (STR-88912)'];
      } else if (lowerQ.includes('devrat')) {
        reply = "Devrat Sharma (PER-103, alias Broker D) exhibits Betweenness Centrality of 0.892 (Rank #1 across all 15 nodes). He bridges the Northern phishing cell with the Western hawala syndicate.";
        graphPath = ['NCR Syndicate', 'Devrat Sharma (Betweenness: 0.892)', 'Mumbai Hawala Network'];
        citations = ['EVD-002 (STR-88912)', 'EVD-003 (T-4401 Tower Dump)'];
      } else if (lowerQ.includes('7701')) {
        reply = "Account ACC-7701 is held by Apex Trade Solutions at Nariman Point, Mumbai. It received ₹50 Lakhs from Devrat Sharma and disbursed ₹45 Lakhs to Hawala operator Tariq Merchant for bullion conversion.";
        graphPath = ['Devrat Sharma', 'ACC-7701 (Apex Trade)', 'Tariq Merchant (PER-105)', 'Dubai Bullion A/C'];
        citations = ['EVD-002 (STR-88912)'];
      } else if (lowerQ.includes('contradiction') || lowerQ.includes('alibi') || lowerQ.includes('rajesh')) {
        reply = "Contradiction Flagged: Rajesh Verma claimed to be in Jaipur on 09-JUN-2026. However, Cell Tower T-4401 in Sector 44 Gurugram logged his IMEI transmitting 14 calls concurrently with technician Kunal Shah.";
        graphPath = ['Rajesh Claim: Jaipur', 'CONTRADICTION', 'Tower T-4401: Sector 44 Gurugram'];
        citations = ['EVD-001 (Statement)', 'EVD-003 (Cell Tower Dump)'];
      } else {
        reply = `Cross-referencing query across 15 persons, 12 accounts, and 14 banking transactions in ${activeCaseId}. Ledger records confirm all entries pass SHA-256 integrity verification.`;
        citations = ['EVD-001 (Fabric Block 992144)'];
      }

      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'copilot',
          text: reply,
          graphPath,
          citations
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* 1. Floating Action Trigger Button at Bottom-Right */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] rounded-[6px] transition active:scale-95 text-xs font-semibold shadow-none border border-[#222D3F]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Copilot</span>
        </button>
      )}

      {/* 2. Movable Floating Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '380px',
            zIndex: 60
          }}
          className="bg-[#131A26] border border-[#222D3F] rounded-[6px] flex flex-col font-sans overflow-hidden shadow-none"
        >
          {/* Draggable Header Bar */}
          <div
            onMouseDown={handleMouseDown}
            className="p-2.5 bg-[#1A2332] border-b border-[#222D3F] flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-[#64748B]" />
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A359]" />
                <span className="text-xs font-serif font-bold text-[#F1F5F9]">Intelligence Copilot</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-[3px] text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1D2738] transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-[3px] text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1D2738] transition"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Window Body (collapsible if minimized) */}
          {!isMinimized && (
            <div className="flex flex-col h-[450px]">
              {/* Context indicator */}
              <div className="px-3 py-1 bg-[#0B0F17] border-b border-[#222D3F] text-[10px] text-[#64748B] flex items-center justify-between font-mono">
                <span>Dossier: <strong className="text-[#F1F5F9]">{activeCaseId || 'CASE-018'}</strong></span>
                <span className="text-[#34D399] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" /> Engine Ready
                </span>
              </div>

              {/* Chat Message Scrollable Area */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs bg-[#0B0F17]">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-1 ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-2.5 rounded-[4px] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#D4A359] text-[#0B0F17] font-medium'
                          : 'bg-[#131A26] border border-[#222D3F] text-[#F1F5F9]'
                      }`}
                    >
                      <p className="text-xs font-sans">{msg.text}</p>

                      {/* Visual Graph Path if available */}
                      {msg.graphPath && (
                        <div className="mt-1.5 pt-1.5 border-t border-[#222D3F] space-y-1 font-mono text-[10px]">
                          <span className="text-[#D4A359] flex items-center gap-1 font-semibold">
                            <GitBranch className="w-3 h-3" /> Conduits:
                          </span>
                          <div className="flex flex-wrap items-center gap-1 text-[#94A3B8]">
                            {msg.graphPath.map((node, i) => (
                              <React.Fragment key={i}>
                                <span className="bg-[#1A2332] px-1.5 py-0.2 rounded-[3px] border border-[#222D3F]">
                                  {node}
                                </span>
                                {i < msg.graphPath.length - 1 && <span className="text-[#64748B]">&rarr;</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence Citations if available */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-1 text-[10px] text-[#64748B] space-y-0.5">
                          <span className="font-semibold block text-[#34D399]">Verified Citations:</span>
                          {msg.citations.map((cite, i) => (
                            <div key={i} className="flex items-center gap-1 text-[#94A3B8] font-mono">
                              <CheckCircle2 className="w-2.5 h-2.5 text-[#34D399]" />
                              <span>{cite}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] bg-[#131A26] p-1.5 rounded-[4px] border border-[#222D3F] w-fit">
                    <Bot className="w-3.5 h-3.5 text-[#D4A359]" />
                    <span>Analyzing knowledge graph...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Preset Prompts */}
              <div className="p-1.5 bg-[#131A26] border-t border-[#222D3F] flex gap-1 overflow-x-auto">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="whitespace-nowrap px-2 py-0.5 rounded-[3px] bg-[#1A2332] hover:bg-[#1D2738] border border-[#222D3F] text-[10px] text-[#94A3B8] hover:text-[#F1F5F9] transition font-mono"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-2 bg-[#131A26] border-t border-[#222D3F] flex items-center gap-1.5">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Query case intelligence..."
                  className="flex-1 px-2.5 py-1.5 bg-[#0B0F17] border border-[#222D3F] rounded-[4px] text-xs text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#D4A359]"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-1.5 bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] rounded-[4px] transition disabled:opacity-40"
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
