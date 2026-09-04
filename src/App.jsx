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
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sleek Professional Top Header */}
      <header className="sticky top-0 z-40 bg-[#0d121f]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Tagline */}
          <div 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white group-hover:text-blue-300 transition">
                  CrimeNexus
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  SIH26189
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Criminal Network Analysis Platform &bull; <span className="text-slate-300">Where Every Clue Connects</span>
              </p>
            </div>
          </div>

          {/* Primary View Navigation Buttons */}
          <nav className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'home'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('cases')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'cases' || activeView === 'case_workspace'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => setActiveView('intelligence')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'intelligence'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                <span className="font-semibold text-white">{session.officerName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {session.badgeNumber}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                {session.isSuperAdmin ? 'Super-Admin (Cross-Regional)' : session.regionName}
              </span>
            </div>

            <button
              onClick={() => setSession(null)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="Switch Jurisdiction or Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
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

      {/* Professional Legal & Technical Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a12] py-4 text-center text-xs text-slate-500">
        CrimeNexus (SIH26189) &bull; AI-Powered Criminal Network Analysis System &bull; Strict Row-Level Security &amp; SHA-256 Ledger Integrity
      </footer>
    </div>
  );
}
