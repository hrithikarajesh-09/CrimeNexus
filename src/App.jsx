import React, { useState } from 'react';
import { Shield, GitBranch, Home, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginView from './components/LoginView';
import HomePortal from './components/HomePortal';
import CasesView from './components/CasesView';
import CaseWorkspace from './components/CaseWorkspace';
import NetworkIntelligenceView from './components/NetworkIntelligenceView';
import FloatingAICopilot from './components/FloatingAICopilot';
import EntityCardModal from './components/EntityCardModal';

// Authentic physical case file / dossier folder icon
function CaseFolderIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M2 10h20" />
      <path d="M10 14h4" />
    </svg>
  );
}

export default function App() {
  // Session State: null means user is on the Login / Jurisdiction Selection Gateway
  const [session, setSession] = useState(null);

  // Active View State: 'home', 'cases', 'case_workspace', 'intelligence'
  const [activeView, setActiveView] = useState('home');

  // Currently inspected Case in CaseWorkspace
  const [activeCaseId, setActiveCaseId] = useState('CASE-018');

  // Entity Modal Inspection State
  const [selectedEntity, setSelectedEntity] = useState(null);

  // If not logged in, render the professional police / super-admin login gateway
  if (!session) {
    return (
      <LoginView
        onLogin={(authSession) => {
          setSession(authSession);
          setActiveView('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#D4A359] selection:text-[#0B0F17]">
      {/* Dossier Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#131A26] border-b border-[#222D3F]">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo & Dossier Identifier */}
          <div 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-[6px] bg-[#1A2332] border border-[#222D3F] flex items-center justify-center text-[#D4A359]">
              <Shield className="w-4 h-4 text-[#D4A359]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-serif font-semibold tracking-tight text-[#F1F5F9] group-hover:text-[#D4A359] transition">
                  CrimeNexus
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-[#1A2332] text-[#64748B] border border-[#222D3F]">
                  SIH26189
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">
                Criminal Network Analysis Platform
              </p>
            </div>
          </div>

          {/* Unopinionated Shadcn-style Tabs */}
          <nav className="flex items-center gap-1 bg-[#1A2332] border border-[#222D3F] p-1 rounded-[6px]">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition cursor-pointer ${
                activeView === 'home'
                  ? 'bg-[#D4A359] text-[#0B0F17] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1D2738]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('cases')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition cursor-pointer ${
                activeView === 'cases' || activeView === 'case_workspace'
                  ? 'bg-[#D4A359] text-[#0B0F17] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1D2738]'
              }`}
            >
              <CaseFolderIcon className="w-3.5 h-3.5" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => setActiveView('intelligence')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition cursor-pointer ${
                activeView === 'intelligence'
                  ? 'bg-[#D4A359] text-[#0B0F17] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1D2738]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Network Intelligence</span>
            </button>
          </nav>

          {/* User Session Profile & Exit Button */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block text-xs">
              <div className="flex items-center justify-end gap-1.5">
                <span className="font-medium text-[#F1F5F9]">{session.officerName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-[#1A2332] text-[#94A3B8] border border-[#222D3F]">
                  {session.badgeNumber}
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] block truncate max-w-[200px]">
                {session.isSuperAdmin ? 'Super-Admin' : session.regionName}
              </span>
            </div>

            <button
              onClick={() => setSession(null)}
              className="p-1.5 rounded-[6px] bg-[#1A2332] hover:bg-[#1D2738] border border-[#222D3F] text-[#94A3B8] hover:text-[#F1F5F9] transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Switch Jurisdiction or Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Switch Region</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area with Silky View Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView === 'case_workspace' ? `case_${activeCaseId}` : activeView}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {activeView === 'home' && (
              <HomePortal
                session={session}
                onNavigateToCases={() => setActiveView('cases')}
                onNavigateToIntelligence={() => setActiveView('intelligence')}
                onOpenRecentCase={(caseId) => {
                  setActiveCaseId(caseId);
                  setActiveView('case_workspace');
                }}
              />
            )}

            {activeView === 'cases' && (
              <CasesView
                session={session}
                onOpenCase={(caseId) => {
                  setActiveCaseId(caseId);
                  setActiveView('case_workspace');
                }}
              />
            )}

            {activeView === 'case_workspace' && (
              <CaseWorkspace
                caseId={activeCaseId}
                onBack={() => setActiveView('cases')}
                onSelectEntity={setSelectedEntity}
                onAskCopilot={(query) => {}}
              />
            )}

            {activeView === 'intelligence' && (
              <div className="max-w-6xl mx-auto py-6 px-4">
                <NetworkIntelligenceView
                  onSelectEntity={setSelectedEntity}
                  onAskCopilot={() => {}}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Movable Floating AI Copilot Widget */}
      <FloatingAICopilot
        activeCaseId={activeCaseId}
        onSelectEntity={setSelectedEntity}
        onOpenCase={(id) => {
          setActiveCaseId(id);
          setActiveView('case_workspace');
        }}
      />

      {/* Global Entity Inspector Modal */}
      {selectedEntity && (
        <EntityCardModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onOpenCase={(id) => {
            setActiveCaseId(id);
            setActiveView('case_workspace');
            setSelectedEntity(null);
          }}
          onAskCopilot={() => {}}
        />
      )}

    </div>
  );
}
