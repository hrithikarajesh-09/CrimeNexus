import React, { useState } from 'react';
import { Shield, FolderGit2, GitBranch, Home, LogOut } from 'lucide-react';
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
    <div className="min-h-screen bg-[#12151B] text-[#E8EAEE] flex flex-col font-sans selection:bg-[#C68A46] selection:text-[#12151B]">
      {/* Dossier Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#181C24] border-b border-[#2B313D]">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo & Dossier Identifier */}
          <div 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-[5px] bg-[#1F2430] border border-[#2B313D] flex items-center justify-center text-[#C68A46]">
              <Shield className="w-4 h-4 text-[#C68A46]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-serif font-semibold tracking-tight text-[#E8EAEE] group-hover:text-[#C68A46] transition">
                  CrimeNexus
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-[#1F2430] text-[#6B7382] border border-[#2B313D]">
                  SIH26189
                </span>
              </div>
              <p className="text-[11px] text-[#6B7382] font-sans">
                Criminal Network Analysis Platform
              </p>
            </div>
          </div>

          {/* Unopinionated Shadcn-style Tabs */}
          <nav className="flex items-center gap-1 bg-[#1F2430] border border-[#2B313D] p-1 rounded-[5px]">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeView === 'home'
                  ? 'bg-[#C68A46] text-[#12151B] font-semibold'
                  : 'text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#282F3F]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('cases')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeView === 'cases' || activeView === 'case_workspace'
                  ? 'bg-[#C68A46] text-[#12151B] font-semibold'
                  : 'text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#282F3F]'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => setActiveView('intelligence')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${
                activeView === 'intelligence'
                  ? 'bg-[#C68A46] text-[#12151B] font-semibold'
                  : 'text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#282F3F]'
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
                <span className="font-medium text-[#E8EAEE]">{session.officerName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-[#1F2430] text-[#9AA3B2] border border-[#2B313D]">
                  {session.badgeNumber}
                </span>
              </div>
              <span className="text-[11px] text-[#6B7382] block truncate max-w-[200px]">
                {session.isSuperAdmin ? 'Super-Admin' : session.regionName}
              </span>
            </div>

            <button
              onClick={() => setSession(null)}
              className="p-1.5 rounded-[5px] bg-[#1F2430] hover:bg-[#282F3F] border border-[#2B313D] text-[#9AA3B2] hover:text-[#E8EAEE] transition flex items-center gap-1.5 text-xs font-medium"
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

      {/* Dossier Footer */}
      <footer className="border-t border-[#2B313D] bg-[#181C24] py-3 text-center text-xs text-[#6B7382] font-mono">
        CRIMENEXUS // SIH26189 &bull; ROW-LEVEL SECURITY ENFORCED &bull; SHA-256 FABRIC REGISTRY VERIFIED
      </footer>
    </div>
  );
}
