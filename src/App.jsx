import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CasesView from './components/CasesView';
import KnowledgeGraph from './components/KnowledgeGraph';
import InvestigationReconstruction from './components/InvestigationReconstruction';
import GapsAndContradictions from './components/GapsAndContradictions';
import AICopilot from './components/AICopilot';
import SimilarCasesSearch from './components/SimilarCasesSearch';
import NetworkIntelligenceView from './components/NetworkIntelligenceView';
import EntityCardModal from './components/EntityCardModal';
import UploadModal from './components/UploadModal';
import EvidenceIntegrityModal from './components/EvidenceIntegrityModal';
import DigitalDossierModal from './components/DigitalDossierModal';
import { RAW_DATASET } from './data/dataset';

export default function App() {
  const [currentRegion, setCurrentRegion] = useState('ALL-REGIONS');
  const [activeTab, setActiveTab] = useState('cases'); // 'cases', 'reconstruction', 'graph', 'copilot', 'gaps', 'similar', 'intelligence', 'integrity'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');
  const [activeCaseFilter, setActiveCaseFilter] = useState('ALL');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isIntegrityOpen, setIsIntegrityOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const handleOpenCase = (caseId) => {
    setActiveCaseFilter(caseId);
    setActiveTab('graph');
  };

  const handleStartReconstruction = (caseId) => {
    setActiveCaseFilter(caseId);
    setActiveTab('reconstruction');
  };

  const handleAskCopilot = (queryText) => {
    setCopilotInitialQuery(queryText);
    setActiveTab('copilot');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRegion={currentRegion}
        setCurrentRegion={setCurrentRegion}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenIntegrityModal={() => setIsIntegrityOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6">
        {activeTab === 'cases' && (
          <CasesView
            currentRegion={currentRegion}
            onOpenCase={handleOpenCase}
            onStartReconstruction={handleStartReconstruction}
            onAskCopilot={handleAskCopilot}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'reconstruction' && (
          <InvestigationReconstruction
            onSelectEntity={setSelectedEntity}
            onOpenCase={handleOpenCase}
          />
        )}

        {activeTab === 'graph' && (
          <KnowledgeGraph
            onSelectEntity={setSelectedEntity}
            activeCaseFilter={activeCaseFilter}
          />
        )}

        {activeTab === 'copilot' && (
          <AICopilot
            onSelectEntity={setSelectedEntity}
            onOpenCase={handleOpenCase}
            initialQuery={copilotInitialQuery}
          />
        )}

        {activeTab === 'gaps' && (
          <GapsAndContradictions
            onSelectEntity={setSelectedEntity}
            onAskCopilot={handleAskCopilot}
          />
        )}

        {activeTab === 'similar' && (
          <SimilarCasesSearch
            onOpenCase={handleOpenCase}
          />
        )}

        {activeTab === 'intelligence' && (
          <NetworkIntelligenceView
            onSelectEntity={setSelectedEntity}
            onAskCopilot={handleAskCopilot}
          />
        )}

        {activeTab === 'integrity' && (
          <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">SHA-256 & Hyperledger Fabric Integrity Ledger</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Inspect cryptographic verification hashes, off-chain storage parameters, and Section 63B BNSS legal dossier exports.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsIntegrityOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                Open Cryptographic Verification Ledger
              </button>
              <button
                onClick={() => setIsDossierOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                Generate Digital Evidence Dossier
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedEntity && (
        <EntityCardModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onOpenCase={handleOpenCase}
          onAskCopilot={handleAskCopilot}
        />
      )}

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <EvidenceIntegrityModal
        isOpen={isIntegrityOpen}
        onClose={() => setIsIntegrityOpen(false)}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      <DigitalDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080b12] py-4 text-center text-xs text-slate-400">
        CrimeNexus (SIH26189) &bull; AI-Powered Criminal Network Analysis System &bull; Supabase + Neo4j + FastAPI + Hyperledger Fabric Architecture
      </footer>
    </div>
  );
}
