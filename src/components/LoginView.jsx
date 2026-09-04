import React, { useState } from 'react';
import { Shield, Lock, UserCheck, KeyRound, ChevronRight, Fingerprint } from 'lucide-react';

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
    <div className="min-h-screen bg-dark-bg text-slate-300 flex flex-col justify-center items-center p-4 font-sans">
      {/* Terminal Container */}
      <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-xl shadow-xl p-6 relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3 border-b border-dark-border pb-5">
          <div className="w-10 h-10 rounded-lg bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                CrimeNexus
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300 border border-white/10">
                GATEWAY
              </span>
            </div>
            <p className="text-xs text-dark-slate">
              Criminal Network Analysis Platform
            </p>
          </div>
        </div>

        {/* Security Advisory */}
        <div className="p-3 rounded-lg bg-dark-bg border border-dark-border flex items-start gap-2.5 text-xs">
          <Fingerprint className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed text-brand-slate">
            Authorized law-enforcement personnel only. Strict Row-Level Security (RLS) cryptographically enforces regional boundaries.
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Jurisdiction Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white flex items-center justify-between">
              <span>Jurisdiction:</span>
              <span className="text-[10px] text-brand-accent font-mono">RLS ENFORCED</span>
            </label>
            <div className="space-y-1.5">
              {jurisdictions.map((j) => {
                const isSelected = selectedRegion === j.id;
                return (
                  <button
                    type="button"
                    key={j.id}
                    onClick={() => handleRegionSelect(j.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-primary/10 border-brand-primary/50 text-white'
                        : 'bg-dark-bg border-dark-border text-brand-slate hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-medium flex items-center gap-2">
                        <span>{j.name}</span>
                      </div>
                      <div className="text-[11px] text-dark-slate font-mono mt-0.5">
                        {j.officer} &bull; {j.badge}
                      </div>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-brand-primary bg-brand-primary' : 'border-dark-border bg-dark-bg'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badge ID Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white">Investigator Badge ID:</label>
            <div className="relative">
              <UserCheck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-slate" />
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-xs font-mono text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Passkey */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white">Clearance Passkey:</label>
            <div className="relative">
              <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-slate" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-xs font-semibold tracking-wide transition flex items-center justify-center gap-1.5 mt-2 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authenticate &amp; Enter</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </form>

        {/* Demo Fast-Login Shortcuts */}
        <div className="pt-4 border-t border-dark-border space-y-2">
          <div className="text-[10px] font-medium text-dark-slate uppercase tracking-wider text-center">
            Quick Demonstration Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('REG-NCR')}
              className="py-2 px-3 rounded-lg bg-dark-bg hover:bg-dark-subtle border border-dark-border text-[11px] text-brand-slate hover:text-white transition flex items-center justify-between"
            >
              <span>Region A (NCR)</span>
              <span className="text-[10px] text-brand-accent font-mono">INV-101</span>
            </button>
            <button
              onClick={() => handleQuickLogin('SUPER-ADMIN')}
              className="py-2 px-3 rounded-lg bg-dark-bg hover:bg-dark-subtle border border-dark-border text-[11px] text-brand-slate hover:text-white transition flex items-center justify-between"
            >
              <span>Super-Admin</span>
              <span className="text-[10px] text-brand-amber font-mono">ALL</span>
            </button>
          </div>
        </div>

      </div>

      <div className="mt-4 text-center text-[11px] text-dark-slate font-mono">
        CRIMENEXUS &bull; SMART INDIA HACKATHON 2026
      </div>
    </div>
  );
}
