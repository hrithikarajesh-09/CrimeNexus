import React, { useState } from 'react';
import { Shield, Lock, UserCheck, KeyRound, Building2, ChevronRight, AlertCircle, Fingerprint, Sparkles } from 'lucide-react';

export default function LoginView({ onLogin }) {
  const [selectedRegion, setSelectedRegion] = useState('REG-NCR');
  const [badgeId, setBadgeId] = useState('INV-NCR-101');
  const [password, setPassword] = useState('••••••••••••');

  const jurisdictions = [
    {
      id: 'REG-NCR',
      name: 'Region A — NCR / Gurugram Cyber PS',
      code: 'REG-NCR',
      officer: 'Inspector Vikram Batra',
      badge: 'INV-NCR-101',
      jurisdiction: 'Gurugram Commissionerate, Haryana & NCR',
      caseCount: '2 Active Cases'
    },
    {
      id: 'REG-MUM',
      name: 'Region B — Western Coastal Region (Mumbai EOW)',
      code: 'REG-MUM',
      officer: 'ACP Sameer Deshmukh',
      badge: 'INV-MUM-204',
      jurisdiction: 'Mumbai Police Economic Offences Wing',
      caseCount: '1 Active Case'
    },
    {
      id: 'REG-BLR',
      name: 'Region C — Southern Tech Corridor (Bengaluru CID)',
      code: 'REG-BLR',
      officer: 'Inspector Sandeep Rao',
      badge: 'INV-BLR-305',
      jurisdiction: 'Bengaluru Cyber Command & Tech CID',
      caseCount: '0 Active Cases (Isolation)'
    },
    {
      id: 'SUPER-ADMIN',
      name: 'Super-Admin — Federal Cross-Jurisdiction Scope',
      code: 'SUPER-ADMIN',
      officer: 'Special Director V. K. Menon',
      badge: 'DIR-INTEL-001',
      jurisdiction: 'National Intelligence & Cross-Regional Audit',
      caseCount: 'Full 3 Cases Visibility'
    }
  ];

  const handleRegionSelect = (regId) => {
    setSelectedRegion(regId);
    const found = jurisdictions.find(j => j.id === regId);
    if (found) {
      setBadgeId(found.badge);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const current = jurisdictions.find(j => j.id === selectedRegion) || jurisdictions[0];
    onLogin({
      regionId: current.id,
      regionName: current.name,
      officerName: current.officer,
      badgeNumber: current.badge,
      isSuperAdmin: current.id === 'SUPER-ADMIN'
    });
  };

  const handleQuickLogin = (regId) => {
    handleRegionSelect(regId);
    const found = jurisdictions.find(j => j.id === regId);
    if (found) {
      onLogin({
        regionId: found.id,
        regionName: found.name,
        officerName: found.officer,
        badgeNumber: found.badge,
        isSuperAdmin: found.id === 'SUPER-ADMIN'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#121816] text-[#D1E8E2] flex flex-col justify-center items-center p-4 relative font-sans tech-grid-bg">
      {/* Sleek futuristic glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#116466]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[200px] bg-[#D9B08C]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Container */}
      <div className="w-full max-w-xl bg-[#1a2320]/95 border border-[#116466]/40 rounded-2xl shadow-2xl p-8 relative z-10 futuristic-glow">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-[#116466]/30">
          <div className="w-12 h-12 rounded-xl bg-[#116466]/20 border border-[#116466]/50 flex items-center justify-center shadow-inner text-[#D1E8E2]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-widest text-white uppercase font-display">
                CrimeNexus
              </h1>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-[#116466]/30 text-[#D1E8E2] border border-[#116466]/50">
                SIH26189 // SECURE GATEWAY
              </span>
            </div>
            <p className="text-xs text-[#7e968e] mt-0.5 tracking-wide">
              Criminal Network Analysis System &bull; <span className="text-[#D9B08C]">Sleek &amp; Futuristic Station Portal</span>
            </p>
          </div>
        </div>

        {/* Security Advisory */}
        <div className="mb-6 p-3 rounded-xl bg-[#151c19] border border-[#116466]/30 flex items-start gap-2.5 text-xs text-[#D1E8E2]">
          <Fingerprint className="w-4 h-4 text-[#D9B08C] shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed text-[#7e968e]">
            Access restricted to authorized cyber investigators. Row-Level Security (RLS) cryptographically restricts access strictly to verified jurisdictions.
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Jurisdiction Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D1E8E2] flex items-center justify-between tracking-wide">
              <span>Select Station / Jurisdiction:</span>
              <span className="text-[10px] text-[#D9B08C] font-mono">[ ENFORCED RLS ]</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {jurisdictions.map((j) => {
                const isSelected = selectedRegion === j.id;
                return (
                  <button
                    type="button"
                    key={j.id}
                    onClick={() => handleRegionSelect(j.id)}
                    className={`text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#116466]/25 border-[#116466] text-white shadow-sm'
                        : 'bg-[#151c19] border-[#2C3531] text-[#7e968e] hover:border-[#116466]/40 hover:text-[#D1E8E2]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span className={isSelected ? 'text-[#D1E8E2]' : 'text-[#7e968e]'}>{j.name}</span>
                        {j.id === 'SUPER-ADMIN' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#D9B08C]/15 text-[#FFCB9A] border border-[#D9B08C]/30">
                            FULL SCOPE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#7e968e] mt-0.5 font-mono">
                        Officer: <span className="text-[#D9B08C]">{j.officer}</span> &bull; {j.badge}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#116466] bg-[#116466]' : 'border-[#2C3531] bg-[#121816]'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badge ID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D1E8E2] tracking-wide">Investigator Badge / Token ID:</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e968e]" />
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#121816] border border-[#116466]/40 rounded-xl text-xs font-mono text-[#D1E8E2] focus:outline-none focus:border-[#116466] focus:ring-1 focus:ring-[#116466]"
              />
            </div>
          </div>

          {/* Passkey */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D1E8E2] tracking-wide">Security Clearance Passkey:</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e968e]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#121816] border border-[#116466]/40 rounded-xl text-xs text-[#D1E8E2] focus:outline-none focus:border-[#116466] focus:ring-1 focus:ring-[#116466]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#116466] hover:bg-[#167b7e] text-white rounded-xl text-xs font-bold tracking-widest uppercase shadow-lg shadow-[#116466]/20 transition active:scale-[0.99] flex items-center justify-center gap-2 mt-2 border border-[#116466]"
          >
            <Lock className="w-3.5 h-3.5 text-[#D1E8E2]" />
            <span>AUTHENTICATE &amp; ENTER TERMINAL</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Demo Fast-Login Shortcuts */}
        <div className="mt-6 pt-5 border-t border-[#116466]/30">
          <div className="text-[11px] font-semibold text-[#7e968e] uppercase tracking-widest mb-2.5 text-center">
            One-Click Demonstration Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('REG-NCR')}
              className="py-2 px-3 rounded-lg bg-[#151c19] hover:bg-[#1c2420] border border-[#116466]/30 text-[11px] text-[#D1E8E2] transition text-left flex items-center justify-between"
            >
              <span>Region A (NCR)</span>
              <span className="text-[10px] text-[#D9B08C] font-mono">INV-NCR-101</span>
            </button>
            <button
              onClick={() => handleQuickLogin('SUPER-ADMIN')}
              className="py-2 px-3 rounded-lg bg-[#151c19] hover:bg-[#1c2420] border border-[#D9B08C]/40 text-[11px] text-[#FFCB9A] transition text-left flex items-center justify-between"
            >
              <span>Super-Admin</span>
              <span className="text-[10px] text-[#FFCB9A] font-mono">ALL CASES</span>
            </button>
          </div>
        </div>

      </div>

      {/* Security notice footer */}
      <div className="mt-6 text-center text-[11px] text-[#7e968e] tracking-wider font-mono">
        CRIMENEXUS TERMINAL // SLEEK FUTURISTIC INTELLIGENCE LAYER // SIH26189
      </div>
    </div>
  );
}
