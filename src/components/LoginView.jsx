import React, { useState } from 'react';
import { Shield, Lock, UserCheck, KeyRound, ChevronRight, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
    <div className="min-h-screen bg-[#0B0F17] text-[#F1F5F9] flex flex-col justify-center items-center p-4 font-sans selection:bg-[#D4A359] selection:text-[#0B0F17]">
      {/* Dossier Terminal Container with smooth motion entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="p-6 space-y-5">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3 border-b border-[#222D3F] pb-4">
          <div className="w-9 h-9 rounded-[6px] bg-[#1A2332] border border-[#222D3F] flex items-center justify-center text-[#D4A359]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-serif font-bold text-[#F1F5F9] tracking-tight">
                CrimeNexus
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[3px] bg-[#1A2332] text-[#64748B] border border-[#222D3F]">
                AUTH-TERMINAL
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Criminal Network Analysis Platform
            </p>
          </div>
        </div>

        {/* Security Advisory */}
        <div className="p-2.5 rounded-[6px] bg-[#1A2332] border border-[#222D3F] flex items-start gap-2 text-xs">
          <Fingerprint className="w-4 h-4 text-[#D4A359] shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed text-[#94A3B8]">
            Restricted law-enforcement portal. Row-Level Security (RLS) cryptographically restricts intelligence access to authenticated jurisdictions.
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Jurisdiction Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F1F5F9] flex items-center justify-between">
              <span>Jurisdiction:</span>
              <span className="text-[10px] text-[#D4A359] font-mono">[ RLS ENFORCED ]</span>
            </label>
            <div className="space-y-1.5">
              {jurisdictions.map((j) => {
                const isSelected = selectedRegion === j.id;
                return (
                  <button
                    type="button"
                    key={j.id}
                    onClick={() => handleRegionSelect(j.id)}
                    className={`w-full text-left p-2.5 rounded-[6px] border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1A2332] border-[#D4A359] text-[#F1F5F9]'
                        : 'bg-[#0B0F17] border-[#222D3F] text-[#94A3B8] hover:border-[#2E3D55] hover:text-[#F1F5F9]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-medium flex items-center gap-1.5">
                        <span className={isSelected ? 'text-[#F1F5F9] font-semibold' : 'text-[#94A3B8]'}>{j.name}</span>
                      </div>
                      <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                        {j.officer} &bull; {j.badge}
                      </div>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#D4A359] bg-[#D4A359]' : 'border-[#222D3F] bg-[#0B0F17]'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0B0F17]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badge ID Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#F1F5F9]">Investigator Badge ID:</label>
            <div className="relative">
              <UserCheck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-1.5 bg-[#1A2332] border border-[#222D3F] rounded-[6px] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#D4A359]"
              />
            </div>
          </div>

          {/* Passkey */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#F1F5F9]">Clearance Passkey:</label>
            <div className="relative">
              <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-1.5 bg-[#1A2332] border border-[#222D3F] rounded-[6px] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#D4A359]"
              />
            </div>
          </div>

          {/* Submit Button (Brass Accent) */}
          <button
            type="submit"
            className="w-full py-2 px-3 bg-[#D4A359] hover:bg-[#E0B268] text-[#0B0F17] rounded-[6px] text-xs font-semibold tracking-wide transition flex items-center justify-center gap-1.5 mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authenticate &amp; Open Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast-Login Shortcuts */}
        <div className="pt-3 border-t border-[#222D3F] space-y-2">
          <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider text-center">
            One-Click Demonstration Clearance
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('REG-NCR')}
              className="py-1.5 px-2.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] border border-[#222D3F] text-[11px] text-[#94A3B8] hover:text-[#F1F5F9] transition flex items-center justify-between"
            >
              <span>Region A (NCR)</span>
              <span className="text-[10px] text-[#D4A359] font-mono">INV-101</span>
            </button>
            <button
              onClick={() => handleQuickLogin('SUPER-ADMIN')}
              className="py-1.5 px-2.5 rounded-[4px] bg-[#1A2332] hover:bg-[#1D2738] border border-[#222D3F] text-[11px] text-[#94A3B8] hover:text-[#F1F5F9] transition flex items-center justify-between"
            >
              <span>Super-Admin</span>
              <span className="text-[10px] text-[#8B5CF6] font-mono">ALL CASES</span>
            </button>
          </div>
        </div>

        </Card>
      </motion.div>

      <div className="mt-4 text-center text-[11px] text-[#64748B] font-mono">
        CRIMENEXUS &bull; SMART INDIA HACKATHON 2026
      </div>
    </div>
  );
}
