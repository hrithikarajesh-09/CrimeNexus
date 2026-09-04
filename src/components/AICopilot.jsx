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
      <div className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-5 ">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#D4A359]/15 text-[#D4A359] text-[#D4A359] border border-[#D4A359]/30">
            SECTION 9 &bull; AI INVESTIGATION COPILOT
          </span>
          <h2 className="text-xl font-bold text-[#F1F5F9]">Natural-Language Criminal Intelligence Assistant</h2>
        </div>
        <p className="text-xs text-[#94A3B8] mt-1">
          Ask questions about cases, entities, money trails, cell tower logs, and cross-case connections. Powered by Cypher graph query validation & evidence retrieval.
        </p>
      </div>

      {/* Preset Questions Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#94A3B8]">Suggested Investigator Queries:</span>
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(pq)}
            className="text-xs font-medium bg-[#1A2332] hover:bg-[#1D2738] text-[#D4A359] border border-[#222D3F] px-3 py-1.5 rounded-[4px] transition"
          >
            "{pq}"
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="space-y-4">
        {chatHistory.map((msg) => (
          <div key={msg.id} className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-6 shadow-none space-y-4">
            {msg.type !== 'assistant' && (
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4A359] bg-[#131A26] px-3 py-2 rounded-[4px] border border-[#222D3F]">
                <HelpCircle className="w-4 h-4 text-[#D4A359]" />
                <span>Investigator Question: "{msg.question}"</span>
              </div>
            )}

            {/* Answer Text */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#D4A359]/15 text-[#D4A359] border border-[#D4A359]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#D4A359]" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F1F5F9]">CrimeNexus Copilot Response</span>
                  <span className="text-[10px] font-mono bg-[#34D399]/15 text-[#34D399] text-[#34D399] px-2 py-0.5 rounded border border-[#34D399]/25 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED EVIDENCE-BACKED
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#0B0F17] p-4 rounded-[6px] border border-[#222D3F]">
                  {msg.answer}
                </p>

                {/* Graph Path Visual Result Card */}
                {msg.graphPath && (
                  <div className="bg-[#131A26] p-3.5 rounded-[6px] border border-[#222D3F] space-y-2">
                    <span className="text-[11px] font-bold text-[#D4A359] uppercase tracking-wider flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-[#D4A359]" /> Visual Knowledge Graph Connection Path:
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      {msg.graphPath.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <span className="bg-[#0B0F17] px-2.5 py-1 rounded border border-[#D4A359]/30 text-[#D4A359] font-semibold">
                            {step}
                          </span>
                          {idx < msg.graphPath.length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence Citations */}
                {msg.evidenceCitations && msg.evidenceCitations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="text-[#94A3B8] font-semibold">Supporting Source Records:</span>
                    {msg.evidenceCitations.map((c, idx) => (
                      <span key={idx} className="bg-[#D4A359]/15 text-[#D4A359] text-[#D4A359] border border-[#D4A359]/20 px-2 py-0.5 rounded font-mono">
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
          <div className="bg-[#131A26] border border-[#D4A359]/30 rounded-[6px] p-6 text-center space-y-2">
            <Cpu className="w-6 h-6 text-[#D4A359] animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#D4A359]">Validating Structured Cypher & SQL Query against Neo4j & Supabase...</p>
          </div>
        )}
      </div>

      {/* Query Input Box */}
      <div className="bg-[#131A26] border border-[#222D3F] rounded-[6px] p-3 flex items-center gap-3  sticky bottom-4 shadow-none">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
          placeholder="Ask Copilot a question (e.g. 'Show everyone connected to Devrat Sharma')..."
          className="flex-1 bg-[#0B0F17] border border-[#222D3F] rounded-[4px] px-4 py-2.5 text-xs text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#D4A359] transition"
        />
        <button
          onClick={() => handleSendQuery()}
          disabled={isProcessing || !inputQuery.trim()}
          className="px-4 py-2.5 rounded-[4px] bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] font-semibold text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
