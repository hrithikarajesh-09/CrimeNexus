import React from 'react';
import { GitBranch, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RAW_DATASET } from '../data/dataset';

export default function HomePortal({ session, onNavigateToCases, onNavigateToIntelligence, onOpenRecentCase }) {
  const accessibleCases = RAW_DATASET.cases.filter(c => 
    session.isSuperAdmin || c.jurisdiction === session.regionId
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-4 font-sans">
      {/* Primary Navigation Cards with Framer Motion hover & elevation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Cases Workspace with authentic case folder icon */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={onNavigateToCases}
          className="cursor-pointer"
        >
          <Card className="h-full p-5 hover:border-[#4A5468] transition-colors flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-[5px] bg-[#1F2430] border border-[#2B313D] flex items-center justify-center text-[#C68A46] mb-3.5">
                {/* Visual Case Folder / Dossier Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  <path d="M2 10h20" />
                  <path d="M10 14h4" />
                </svg>
              </div>

              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-serif font-bold text-[#E8EAEE]">
                  Cases Workspace
                </h3>
                <Badge variant="brass">
                  {accessibleCases.length} Active
                </Badge>
              </div>

              <p className="text-xs text-[#9AA3B2] leading-relaxed mt-1">
                Active incident dockets, evidence files, and case dossiers.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#2B313D] flex items-center justify-between">
              <span className="text-xs text-[#6B7382] font-mono">Registry Index</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#C68A46]">
                <span>Open Cases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Card 2: Network Intelligence */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={onNavigateToIntelligence}
          className="cursor-pointer"
        >
          <Card className="h-full p-5 hover:border-[#4A5468] transition-colors flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-[5px] bg-[#1F2430] border border-[#2B313D] flex items-center justify-center text-[#8B81C4] mb-3.5">
                <GitBranch className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-serif font-bold text-[#E8EAEE]">
                  Network Intelligence
                </h3>
                <Badge variant="violet">
                  Macro Graph
                </Badge>
              </div>

              <p className="text-xs text-[#9AA3B2] leading-relaxed mt-1">
                Cross-jurisdiction entity graph and centrality metrics.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#2B313D] flex items-center justify-between">
              <span className="text-xs text-[#8B81C4] font-medium font-mono">1 Bridge Broker Identified</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#8B81C4]">
                <span>Inspect Centrality</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Access to Primary Case File */}
      <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[5px] bg-[#1F2430] border border-[#2B313D] flex items-center justify-center text-[#E8EAEE] font-mono font-bold text-xs">
            018
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-[#C68A46] uppercase">PRIMARY DOSSIER</span>
              <span className="text-sm font-semibold text-[#E8EAEE]">CASE-018: Operation PhishNet</span>
            </div>
            <p className="text-xs text-[#6B7382] mt-0.5">
              NCR Cyber PS &bull; INR 1.0 Cr RTGS fraud with cross-case bridge to Mumbai Hawala ring.
            </p>
          </div>
        </div>

        <Button
          onClick={() => onOpenRecentCase('CASE-018')}
          variant="brass"
          size="default"
        >
          <span>Open Case #018</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Card>

      {/* System Status Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <Card className="p-2.5">
          <span className="text-[10px] text-[#6B7382] block font-mono">STATIONS</span>
          <span className="text-sm font-mono font-semibold text-[#E8EAEE] mt-0.5 block">3 Regional Units</span>
        </Card>
        <Card className="p-2.5">
          <span className="text-[10px] text-[#6B7382] block font-mono">HASH INTEGRITY</span>
          <span className="text-sm font-mono font-semibold text-[#5FA876] mt-0.5 block">100% Verified</span>
        </Card>
        <Card className="p-2.5">
          <span className="text-[10px] text-[#6B7382] block font-mono">BRIDGE BROKER</span>
          <span className="text-sm font-mono font-semibold text-[#8B81C4] mt-0.5 block">PER-103 (Devrat)</span>
        </Card>
        <Card className="p-2.5">
          <span className="text-[10px] text-[#6B7382] block font-mono">EVIDENCE STATUS</span>
          <span className="text-sm font-mono font-semibold text-[#C68A46] mt-0.5 block">Sec 63B BSA Ready</span>
        </Card>
      </div>
    </div>
  );
}
