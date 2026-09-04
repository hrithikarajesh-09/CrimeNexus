import React, { useState } from 'react';
import { Shield, Lock, UserCheck, KeyRound, Building2, ChevronRight, AlertCircle, Fingerprint } from 'lucide-react';

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
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Container */}
      <div className="w-full max-w-xl bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">CrimeNexus</h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                SIH26189 Terminal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AI-Powered Criminal Network Analysis System &bull; Secure Jurisdictional Portal
            </p>
          </div>
        </div>

        {/* Security Advisory */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
          <Fingerprint className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            Access to this system is restricted to authenticated law enforcement personnel. Row-Level Security (RLS) restricts access strictly to authorized regional jurisdictions.
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Jurisdiction Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Select Station / Jurisdiction:</span>
              <span className="text-[10px] text-slate-400 font-mono">ENFORCED RLS</span>
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
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span>{j.name}</span>
                        {j.id === 'SUPER-ADMIN' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            FULL SCOPE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Officer: {j.officer} &bull; <span className="font-mono text-slate-400">{j.badge}</span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-700 bg-slate-800'
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
            <label className="text-xs font-semibold text-slate-300">Investigator Badge / Token ID:</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Passkey */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Security Clearance Passkey:</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold tracking-wide uppercase shadow-lg shadow-blue-600/20 transition active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authenticate & Enter Terminal</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Demo Fast-Login Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            One-Click Demonstration Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('REG-NCR')}
              className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition text-left flex items-center justify-between"
            >
              <span>Region A (Gurugram)</span>
              <span className="text-[10px] text-blue-400 font-mono">INV-NCR-101</span>
            </button>
            <button
              onClick={() => handleQuickLogin('SUPER-ADMIN')}
              className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] text-amber-300 transition text-left flex items-center justify-between"
            >
              <span>Super-Admin Mode</span>
              <span className="text-[10px] text-amber-400 font-mono">ALL CASES</span>
            </button>
          </div>
        </div>

      </div>

      {/* Security notice footer */}
      <div className="mt-6 text-center text-[11px] text-slate-400">
        CrimeNexus Security Protocol &bull; Tamper-Evident SHA-256 Audit Enabled &bull; SIH26189
      </div>
    </div>
  );
}
