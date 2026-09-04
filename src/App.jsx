import React, { useState } from 'react';
import { Shield, FolderGit2, GitBranch, Home, LogOut, User, Lock, Sparkles, Building2 } from 'lucide-react';
import LoginView from './components/LoginView';
import HomePortal from './components/HomePortal';
import CasesView from './components/CasesView';
import CaseWorkspace from './components/CaseWorkspace';
import NetworkIntelligenceView from './components/NetworkIntelligenceView';
import FloatingAICopilot from './components/FloatingAICopilot';
import EntityCardModal from './components/EntityCardModal';

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
    <div className="min-h-screen bg-[#121816] text-[#D1E8E2] flex flex-col font-sans selection:bg-[#116466] selection:text-white tech-grid-bg">
      {/* Sleek Futuristic Top Header */}
      <header className="sticky top-0 z-40 bg-[#17201c]/90 backdrop-blur-md border-b border-[#116466]/35">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Tagline */}
          <div 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#116466]/20 border border-[#116466]/50 flex items-center justify-center text-[#D1E8E2] group-hover:bg-[#116466] group-hover:text-white transition shadow-sm">
              <Shield className="w-5 h-5 text-[#D1E8E2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider uppercase text-white group-hover:text-[#FFCB9A] transition font-display">
                  CrimeNexus
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest px-1.5 py-0.2 rounded bg-[#116466]/20 text-[#D1E8E2] border border-[#116466]/50">
                  SIH26189
                </span>
              </div>
              <p className="text-[11px] text-[#7e968e] font-medium tracking-wide">
                Criminal Network Analysis Platform &bull; <span className="text-[#D9B08C]">Where Every Clue Connects</span>
              </p>
            </div>
          </div>

          {/* Primary View Navigation Buttons */}
          <nav className="flex items-center gap-1.5 bg-[#121816]/90 border border-[#116466]/35 p-1 rounded-xl">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeView === 'home'
                  ? 'bg-[#116466] text-white shadow-sm border border-[#116466]'
                  : 'text-[#7e968e] hover:text-[#D1E8E2] hover:bg-[#1c2420]'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#D1E8E2]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('cases')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeView === 'cases' || activeView === 'case_workspace'
                  ? 'bg-[#116466] text-white shadow-sm border border-[#116466]'
                  : 'text-[#7e968e] hover:text-[#D1E8E2] hover:bg-[#1c2420]'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-[#D1E8E2]" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => setActiveView('intelligence')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeView === 'intelligence'
                  ? 'bg-[#116466] text-white shadow-sm border border-[#116466]'
                  : 'text-[#7e968e] hover:text-[#D1E8E2] hover:bg-[#1c2420]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-[#D1E8E2]" />
              <span>Network Intelligence</span>
            </button>
          </nav>

          {/* User Session Profile & Exit Button */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block text-xs">
              <div className="flex items-center justify-end gap-1.5">
                <span className="font-semibold text-white">{session.officerName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1c2420] text-[#FFCB9A] border border-[#116466]/40">
                  {session.badgeNumber}
                </span>
              </div>
              <span className="text-[11px] text-[#7e968e] block truncate max-w-[200px]">
                {session.isSuperAdmin ? 'Super-Admin (Cross-Regional)' : session.regionName}
              </span>
            </div>

            <button
              onClick={() => setSession(null)}
              className="p-2 rounded-xl bg-[#1c2420] hover:bg-[#242e2a] border border-[#116466]/40 text-[#7e968e] hover:text-[#D1E8E2] transition flex items-center gap-1.5 text-xs font-semibold"
              title="Switch Jurisdiction or Log Out"
            >
              <LogOut className="w-3.5 h-3.5 text-[#D9B08C]" />
              <span className="hidden md:inline">Switch Region</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
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
            onAskCopilot={(query) => {
              // Floating copilot can handle this
            }}
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
      </main>

      {/* Movable / Draggable Floating AI Copilot Widget */}
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

      {/* Futuristic Technical Footer */}
      <footer className="border-t border-[#116466]/30 bg-[#0f1412] py-4 text-center text-xs text-[#7e968e]">
        CrimeNexus (SIH26189) &bull; Sleek Futuristic Criminal Network Analysis System &bull; <span className="text-[#D9B08C]">Row-Level Security</span> &amp; <span className="text-[#D1E8E2]">SHA-256 Fabric Ledger</span>
      </footer>
    </div>
  );
}
