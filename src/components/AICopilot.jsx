import React, { useState } from 'react';
import { HelpCircle, Send, Sparkles, GitBranch, FileText, CheckCircle2, ArrowRight, ShieldCheck, ExternalLink, RefreshCw, Cpu } from 'lucide-react';
import { RAW_DATASET } from '../data/dataset';

export default function AICopilot({ onSelectEntity, onOpenCase, initialQuery }) {
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [isProcessing, setIsProcessing] = useState(false);

  // History of Q&A responses
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome',
      type: 'assistant',
      question: 'Welcome to CrimeNexus Investigation Copilot',
      answer: 'I am your specialized criminal intelligence assistant. Ask me questions regarding cases, suspects, money trails, cell tower records, cross-case connections, or evidence integrity.',
      graphPath: null,
      evidenceCitations: []
    }
  ]);

  const presetQuestions = [
    "Is Case 18 related to Case 41?",
    "Why was Person Devrat Sharma highlighted?",
    "Show everyone connected to Account Apex Trade Solutions (ACC-7701)",
    "What happened during the 09 June heist timeline?",
    "Why does Rajesh Verma have a location contradiction?"
  ];

  const handleSendQuery = (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    setIsProcessing(true);
    setInputQuery('');

    // Simulate multi-stage LLM & Cypher query validation execution
    setTimeout(() => {
      let answerText = "";
      let graphPath = null;
      let citations = [];

      const lowerQ = q.toLowerCase();

      if (lowerQ.includes('case 18') && lowerQ.includes('case 41') || lowerQ.includes('related')) {
        answerText = "Yes, Case 18 (Operation PhishNet) and Case 41 (Operation ShadowLedge) are directly linked through money broker Devrat Sharma (PER-103). Funds stolen from Zenith Tech (ACC-1001) in Case 018 were aggregated into Devrat Sharma's account (ACC-7702). On 07 August 2026, Devrat Sharma executed transaction TXN_552 sending ₹50,00,000 into Apex Trade Solutions (ACC-7701), a shell company under investigation in Case 041.";
        graphPath = [
          "CASE-018: Zenith Heist",
          "ACC-1001 (Zenith Tech)",
          "ACC-2201 (Suman Roy)",
          "PER-103 (Devrat Sharma)",
          "TXN_552 (₹50,00,000 Bridge)",
          "ACC-7701 (Apex Trade)",
          "CASE-041: Hawala Ring"
        ];
        citations = [
          { code: "EVD-001", record: "FIR 0018/2026 (Gurugram Cyber PS)" },
          { code: "EVD-002", record: "FIU-IND STR-88912 (Apex Trade Advisory)" }
        ];
      } else if (lowerQ.includes('devrat') || lowerQ.includes('person b') || lowerQ.includes('highlighted')) {
        answerText = "Devrat Sharma (PER-103, alias 'Broker D') is highlighted because he exhibits extremely high betweenness centrality across the criminal network. He acts as the strategic money broker bridging the NCR cyber phishing ring (Case 018) with the Mumbai hawala and Dubai bullion clearing ring (Case 041). He also maintains telephone communication with Tariq Merchant (PH-1005) and Anita D'Souza (PH-1007).";
        graphPath = [
          "NCR Phishing Syndicate",
          "PER-103 Devrat Sharma",
          "Mumbai Hawala Ring"
        ];
        citations = [
          { code: "EVD-003", record: "CDR Tower Dump Record CDR-1008" },
          { code: "EVD-002", record: "Core Banking RTGS UTR ITBL2026080700552" }
        ];
      } else if (lowerQ.includes('apex trade') || lowerQ.includes('acc-7701')) {
        answerText = "Apex Trade Solutions Pvt Ltd (ACC-7701) is a corporate front company incorporated in Nariman Point, Mumbai. Its registered director is Anita D'Souza (PER-107). It received ₹50,00,000 from Devrat Sharma via TXN_552 and rapidly dispersed ₹45,00,000 to hawala operator Tariq Merchant (ACC-7703) on 07 August 2026.";
        graphPath = [
          "Devrat Sharma (ACC-7702)",
          "Apex Trade (ACC-7701)",
          "Tariq Merchant (ACC-7703)",
          "Farooq Sheikh (Dubai ACC-7705)"
        ];
        citations = [
          { code: "EVD-002", record: "Bank STR Advisory STR-2026-MUM-88912" }
        ];
      } else {
        answerText = `Based on retrieved Cypher graph queries and Supabase PostgreSQL evidence records, the entity or event queried in "${q}" is connected to active cyber heist and money laundering investigation nodes. Cross-case verification confirms evidence integrity backed by SHA-256 hashes.`;
        graphPath = ["Investigated Query Entity", "Corroborated Evidence Node"];
        citations = [{ code: "EVD-001", record: "Master Criminal Knowledge Graph Query" }];
      }

      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'user_assistant',
          question: q,
          answer: answerText,
          graphPath: graphPath,
          evidenceCitations: citations
        }
      ]);

      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
            SECTION 9 &bull; AI INVESTIGATION COPILOT
          </span>
          <h2 className="text-xl font-bold text-white">Natural-Language Criminal Intelligence Assistant</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Ask questions about cases, entities, money trails, cell tower logs, and cross-case connections. Powered by Cypher graph query validation & evidence retrieval.
        </p>
      </div>

      {/* Preset Questions Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">Suggested Investigator Queries:</span>
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(pq)}
            className="text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            "{pq}"
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="space-y-4">
        {chatHistory.map((msg) => (
          <div key={msg.id} className="bg-[#131b2e] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            {msg.type !== 'assistant' && (
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Investigator Question: "{msg.question}"</span>
              </div>
            )}

            {/* Answer Text */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">CrimeNexus Copilot Response</span>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED EVIDENCE-BACKED
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  {msg.answer}
                </p>

                {/* Graph Path Visual Result Card */}
                {msg.graphPath && (
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-cyan-400" /> Visual Knowledge Graph Connection Path:
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      {msg.graphPath.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <span className="bg-slate-950 px-2.5 py-1 rounded border border-cyan-500/30 text-cyan-300 font-semibold">
                            {step}
                          </span>
                          {idx < msg.graphPath.length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence Citations */}
                {msg.evidenceCitations && msg.evidenceCitations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="text-slate-400 font-semibold">Supporting Source Records:</span>
                    {msg.evidenceCitations.map((c, idx) => (
                      <span key={idx} className="bg-blue-500/10 text-cyan-300 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                        {c.code}: {c.record}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="bg-[#131b2e] border border-cyan-500/30 rounded-xl p-6 text-center space-y-2">
            <Cpu className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-cyan-300">Validating Structured Cypher & SQL Query against Neo4j & Supabase...</p>
          </div>
        )}
      </div>

      {/* Query Input Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md sticky bottom-4 shadow-2xl">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
          placeholder="Ask Copilot a question (e.g. 'Show everyone connected to Devrat Sharma')..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
        />
        <button
          onClick={() => handleSendQuery()}
          disabled={isProcessing || !inputQuery.trim()}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
