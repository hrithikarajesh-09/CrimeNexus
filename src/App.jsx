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
    <div className="min-h-screen bg-dark-bg text-slate-300 flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      {/* Sleek Minimalist Top Header */}
      <header className="sticky top-0 z-40 bg-dark-surface/95 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Tagline */}
          <div 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-brand-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white group-hover:text-brand-accent transition">
                  CrimeNexus
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300 border border-white/10">
                  SIH26189
                </span>
              </div>
              <p className="text-[11px] text-dark-slate">
                Criminal Network Intelligence
              </p>
            </div>
          </div>

          {/* Clean Minimalist Navigation */}
          <nav className="flex items-center gap-1 bg-dark-bg border border-dark-border p-1 rounded-lg">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
                activeView === 'home'
                  ? 'bg-white/10 text-white'
                  : 'text-brand-slate hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('cases')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
                activeView === 'cases' || activeView === 'case_workspace'
                  ? 'bg-white/10 text-white'
                  : 'text-brand-slate hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => setActiveView('intelligence')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
                activeView === 'intelligence'
                  ? 'bg-white/10 text-white'
                  : 'text-brand-slate hover:text-white hover:bg-white/5'
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
                <span className="font-medium text-white">{session.officerName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-subtle text-brand-slate border border-dark-border">
                  {session.badgeNumber}
                </span>
              </div>
              <span className="text-[11px] text-dark-slate block truncate max-w-[200px]">
                {session.isSuperAdmin ? 'Super-Admin' : session.regionName}
              </span>
            </div>

            <button
              onClick={() => setSession(null)}
              className="p-2 rounded-lg bg-dark-subtle hover:bg-dark-panel border border-dark-border text-brand-slate hover:text-white transition flex items-center gap-1.5 text-xs font-medium"
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

      {/* Technical Footer */}
      <footer className="border-t border-dark-border bg-dark-surface py-3 text-center text-xs text-dark-slate">
        CrimeNexus (SIH26189) &bull; Criminal Network Analysis Platform &bull; Row-Level Security Enforced &bull; SHA-256 Ledger Verified
      </footer>
    </div>
  );
}
