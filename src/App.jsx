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
    <div className="min-h-screen bg-[#080c18] text-[#C1C8E4] flex flex-col font-sans selection:bg-[#5680E9] selection:text-white ethereal-aura-bg">
      {/* Sleek Top Header */}
      <header className="sticky top-0 z-40 bg-[#0f1629]/90 backdrop-blur-md border-b border-[#5680E9]/25">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Tagline */}
          <div 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5680E9] to-[#8860D0] p-0.5 shadow-lg shadow-[#5680E9]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#080c18] rounded-[14px] flex items-center justify-center group-hover:bg-transparent transition">
                <Shield className="w-5 h-5 text-[#84CEEB] group-hover:text-white transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider uppercase text-white group-hover:text-[#84CEEB] transition font-display">
                  CrimeNexus
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/35">
                  SIH26189
                </span>
              </div>
              <p className="text-[11px] text-[#8e9cc2] font-medium">
                Criminal Network Analysis Platform &bull; <span className="text-[#84CEEB]">Where Every Clue Connects</span>
              </p>
            </div>
          </div>

          {/* Primary View Navigation Buttons */}
          <nav className="flex items-center gap-1.5 bg-[#080c18]/90 border border-[#5680E9]/30 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeView === 'home'
                  ? 'bg-gradient-to-r from-[#5680E9] to-[#8860D0] text-white shadow-md shadow-[#5680E9]/25'
                  : 'text-[#8e9cc2] hover:text-white hover:bg-[#151f38]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('cases')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeView === 'cases' || activeView === 'case_workspace'
                  ? 'bg-gradient-to-r from-[#5680E9] to-[#8860D0] text-white shadow-md shadow-[#5680E9]/25'
                  : 'text-[#8e9cc2] hover:text-white hover:bg-[#151f38]'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => setActiveView('intelligence')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeView === 'intelligence'
                  ? 'bg-gradient-to-r from-[#5680E9] to-[#8860D0] text-white shadow-md shadow-[#5680E9]/25'
                  : 'text-[#8e9cc2] hover:text-white hover:bg-[#151f38]'
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#151f38] text-[#84CEEB] border border-[#5680E9]/30">
                  {session.badgeNumber}
                </span>
              </div>
              <span className="text-[11px] text-[#8e9cc2] block truncate max-w-[200px]">
                {session.isSuperAdmin ? 'Super-Admin (Cross-Regional)' : session.regionName}
              </span>
            </div>

            <button
              onClick={() => setSession(null)}
              className="p-2.5 rounded-2xl bg-[#151f38] hover:bg-[#1c294a] border border-[#5680E9]/30 text-[#8e9cc2] hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="Switch Jurisdiction or Log Out"
            >
              <LogOut className="w-3.5 h-3.5 text-[#84CEEB]" />
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
      <footer className="border-t border-[#5680E9]/20 bg-[#080c18] py-4 text-center text-xs text-[#8e9cc2]">
        CrimeNexus (SIH26189) &bull; AI-Powered Criminal Network Analysis Platform &bull; <span className="text-[#84CEEB]">Row-Level Security</span> &bull; <span className="text-[#8860D0]">SHA-256 Ledger Verified</span>
      </footer>
    </div>
  );
}
