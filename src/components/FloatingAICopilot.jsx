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
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-[#C68A46] hover:bg-[#D49855] text-[#12151B] rounded-[5px] transition active:scale-95 text-xs font-semibold shadow-none border border-[#2B313D]"
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
          className="bg-[#181C24] border border-[#2B313D] rounded-[5px] flex flex-col font-sans overflow-hidden shadow-none"
        >
          {/* Draggable Header Bar */}
          <div
            onMouseDown={handleMouseDown}
            className="p-2.5 bg-[#1F2430] border-b border-[#2B313D] flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-[#6B7382]" />
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C68A46]" />
                <span className="text-xs font-serif font-bold text-[#E8EAEE]">Intelligence Copilot</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-[3px] text-[#6B7382] hover:text-[#E8EAEE] hover:bg-[#282F3F] transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-[3px] text-[#6B7382] hover:text-[#E8EAEE] hover:bg-[#282F3F] transition"
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
              <div className="px-3 py-1 bg-[#12151B] border-b border-[#2B313D] text-[10px] text-[#6B7382] flex items-center justify-between font-mono">
                <span>Dossier: <strong className="text-[#E8EAEE]">{activeCaseId || 'CASE-018'}</strong></span>
                <span className="text-[#5FA876] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5FA876]" /> Engine Ready
                </span>
              </div>

              {/* Chat Message Scrollable Area */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs bg-[#12151B]">
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
                          ? 'bg-[#C68A46] text-[#12151B] font-medium'
                          : 'bg-[#181C24] border border-[#2B313D] text-[#E8EAEE]'
                      }`}
                    >
                      <p className="text-xs font-sans">{msg.text}</p>

                      {/* Visual Graph Path if available */}
                      {msg.graphPath && (
                        <div className="mt-1.5 pt-1.5 border-t border-[#2B313D] space-y-1 font-mono text-[10px]">
                          <span className="text-[#C68A46] flex items-center gap-1 font-semibold">
                            <GitBranch className="w-3 h-3" /> Conduits:
                          </span>
                          <div className="flex flex-wrap items-center gap-1 text-[#9AA3B2]">
                            {msg.graphPath.map((node, i) => (
                              <React.Fragment key={i}>
                                <span className="bg-[#1F2430] px-1.5 py-0.2 rounded-[3px] border border-[#2B313D]">
                                  {node}
                                </span>
                                {i < msg.graphPath.length - 1 && <span className="text-[#6B7382]">&rarr;</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence Citations if available */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-1 text-[10px] text-[#6B7382] space-y-0.5">
                          <span className="font-semibold block text-[#5FA876]">Verified Citations:</span>
                          {msg.citations.map((cite, i) => (
                            <div key={i} className="flex items-center gap-1 text-[#9AA3B2] font-mono">
                              <CheckCircle2 className="w-2.5 h-2.5 text-[#5FA876]" />
                              <span>{cite}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7382] bg-[#181C24] p-1.5 rounded-[4px] border border-[#2B313D] w-fit">
                    <Bot className="w-3.5 h-3.5 text-[#C68A46]" />
                    <span>Analyzing knowledge graph...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Preset Prompts */}
              <div className="p-1.5 bg-[#181C24] border-t border-[#2B313D] flex gap-1 overflow-x-auto">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="whitespace-nowrap px-2 py-0.5 rounded-[3px] bg-[#1F2430] hover:bg-[#282F3F] border border-[#2B313D] text-[10px] text-[#9AA3B2] hover:text-[#E8EAEE] transition font-mono"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-2 bg-[#181C24] border-t border-[#2B313D] flex items-center gap-1.5">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Query case intelligence..."
                  className="flex-1 px-2.5 py-1.5 bg-[#12151B] border border-[#2B313D] rounded-[4px] text-xs text-[#E8EAEE] placeholder-[#6B7382] focus:outline-none focus:border-[#C68A46]"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-1.5 bg-[#C68A46] hover:bg-[#D49855] text-[#12151B] rounded-[4px] transition disabled:opacity-40"
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
