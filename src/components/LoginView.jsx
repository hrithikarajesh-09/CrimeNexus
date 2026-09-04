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
    <div className="min-h-screen bg-[#080c18] text-[#C1C8E4] flex flex-col justify-center items-center p-4 relative font-sans ethereal-aura-bg">
      {/* Ambient ethereal orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#5680E9]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[250px] bg-[#8860D0]/12 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Container */}
      <div className="w-full max-w-xl bg-[#0f1629]/95 border border-[#5680E9]/35 rounded-3xl shadow-2xl p-8 relative z-10 ethereal-glass">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-[#5680E9]/25">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5680E9] to-[#8860D0] p-0.5 shadow-lg shadow-[#5680E9]/25 flex items-center justify-center text-white">
            <div className="w-full h-full bg-[#080c18] rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#84CEEB]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider text-white uppercase font-display">
                CrimeNexus
              </h1>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#5680E9]/20 text-[#84CEEB] border border-[#5680E9]/40">
                SIH26189 // ACCESS TERMINAL
              </span>
            </div>
            <p className="text-xs text-[#8e9cc2] mt-0.5">
              AI-Powered Criminal Network Analysis Platform &bull; <span className="text-[#84CEEB]">Secure Gateway</span>
            </p>
          </div>
        </div>

        {/* Security Advisory */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#080c18] border border-[#5680E9]/25 flex items-start gap-2.5 text-xs text-[#C1C8E4]">
          <Fingerprint className="w-4 h-4 text-[#84CEEB] shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed text-[#8e9cc2]">
            Restricted to authenticated law enforcement. Strict Row-Level Security (RLS) cryptographically confines access to authorized jurisdictions.
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Jurisdiction Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Select Jurisdiction / Police Station:</span>
              <span className="text-[10px] text-[#84CEEB] font-mono">[ ENFORCED RLS ]</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {jurisdictions.map((j) => {
                const isSelected = selectedRegion === j.id;
                return (
                  <button
                    type="button"
                    key={j.id}
                    onClick={() => handleRegionSelect(j.id)}
                    className={`text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#5680E9]/15 border-[#5680E9] text-white shadow-md shadow-[#5680E9]/10'
                        : 'bg-[#080c18]/60 border-[#5680E9]/20 text-[#8e9cc2] hover:border-[#5680E9]/40 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span className={isSelected ? 'text-white' : 'text-[#C1C8E4]'}>{j.name}</span>
                        {j.id === 'SUPER-ADMIN' && (
                          <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#8860D0]/20 text-[#8860D0] border border-[#8860D0]/40">
                            FULL SCOPE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8e9cc2] mt-0.5 font-mono">
                        Lead: <span className="text-[#84CEEB]">{j.officer}</span> &bull; {j.badge}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#84CEEB] bg-[#5680E9]' : 'border-[#5680E9]/30 bg-[#080c18]'
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
            <label className="text-xs font-semibold text-white">Investigator Badge / Token ID:</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9cc2]" />
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#080c18] border border-[#5680E9]/35 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-[#84CEEB] focus:ring-1 focus:ring-[#84CEEB]"
              />
            </div>
          </div>

          {/* Passkey */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">Security Clearance Passkey:</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9cc2]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#080c18] border border-[#5680E9]/35 rounded-2xl text-xs text-white focus:outline-none focus:border-[#84CEEB] focus:ring-1 focus:ring-[#84CEEB]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#5680E9] to-[#8860D0] hover:opacity-95 text-white rounded-2xl text-xs font-bold tracking-widest uppercase shadow-lg shadow-[#5680E9]/25 transition active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>AUTHENTICATE &amp; ENTER TERMINAL</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Demo Fast-Login Shortcuts */}
        <div className="mt-6 pt-5 border-t border-[#5680E9]/25">
          <div className="text-[11px] font-semibold text-[#8e9cc2] uppercase tracking-widest mb-2.5 text-center">
            One-Click Demonstration Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('REG-NCR')}
              className="py-2.5 px-3.5 rounded-2xl bg-[#080c18] hover:bg-[#151f38] border border-[#5680E9]/30 text-[11px] text-[#C1C8E4] hover:text-white transition text-left flex items-center justify-between"
            >
              <span>Region A (NCR)</span>
              <span className="text-[10px] text-[#84CEEB] font-mono">INV-NCR-101</span>
            </button>
            <button
              onClick={() => handleQuickLogin('SUPER-ADMIN')}
              className="py-2.5 px-3.5 rounded-2xl bg-[#080c18] hover:bg-[#151f38] border border-[#8860D0]/40 text-[11px] text-[#C1C8E4] hover:text-white transition text-left flex items-center justify-between"
            >
              <span>Super-Admin</span>
              <span className="text-[10px] text-[#8860D0] font-mono">ALL CASES</span>
            </button>
          </div>
        </div>

      </div>

      {/* Security notice footer */}
      <div className="mt-6 text-center text-[11px] text-[#8e9cc2] font-mono tracking-wider">
        CRIMENEXUS // ETHEREAL SECURITY ARCHITECTURE // SIH26189
      </div>
    </div>
  );
}
