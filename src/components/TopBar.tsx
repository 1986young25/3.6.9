import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, DollarSign, FileText, ExternalLink, Check, Copy } from 'lucide-react';
import { toggleAudio, isAudioEnabled, playClickBeep } from '../utils/audio';

interface TopBarProps {
  onOpenPricing: () => void;
  onOpenLedger: () => void;
  onOpenImpedanceModal: () => void;
  onOpenStatutoryModal: () => void;
}

export default function TopBar({
  onOpenPricing,
  onOpenLedger,
  onOpenImpedanceModal,
  onOpenStatutoryModal,
}: TopBarProps) {
  const [audioOn, setAudioOn] = useState(isAudioEnabled());
  const [copiedSeal, setCopiedSeal] = useState(false);

  const fullSeal = '24ff87e49c7104b38fae19d701e847cbb6412098bc3ef8d22c9a108b5e21098bc';

  const handleCopySeal = () => {
    playClickBeep(1800);
    navigator.clipboard?.writeText(fullSeal);
    setCopiedSeal(true);
    setTimeout(() => setCopiedSeal(false), 2000);
  };

  const handleToggleSound = () => {
    const next = toggleAudio();
    setAudioOn(next);
    if (next) playClickBeep(1200);
  };

  return (
    <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center p-4 bg-slate-900 border-glow rounded-lg shadow-lg gap-4">
      {/* Brand Identity & Fiduciary Trust Anchor */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <h1 className="text-lg md:text-xl font-bold text-cyan-400 tracking-wider">
            AURA CONTROL MATRIX v2026 // THE CRYPTID BRAIN
          </h1>
        </div>
        <p className="text-[11px] md:text-xs text-slate-400 mt-1">
          <span className="text-slate-300 font-semibold">FIDUCIARY:</span> Nicholas Young Master Trust (EIN: 41-6820289)
          <span className="mx-2 text-slate-600">|</span>
          <span className="text-slate-300 font-semibold">OPERATING ARM:</span> Titan Games Security L.L.C. (CAGE: 25AD9 | UEI: S3SXM538MG79 | LARA: 28678008)
        </p>
      </div>

      {/* Cryptographic Badges & Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono w-full xl:w-auto">
        {/* State Seal */}
        <button
          onClick={handleCopySeal}
          title="Click to copy full SHA-256 State Seal root"
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 rounded border border-cyan-500/40 flex items-center gap-2 transition cursor-pointer group"
        >
          <span className="text-slate-400 group-hover:text-cyan-300">STATE SEAL:</span>
          <span className="text-cyan-400 font-bold tracking-wider">24ff87e4...21098bc</span>
          {copiedSeal ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
          )}
        </button>

        {/* Impedance Z0 */}
        <button
          onClick={() => {
            playClickBeep();
            onOpenImpedanceModal();
          }}
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 rounded border border-amber-500/40 transition cursor-pointer flex items-center gap-1.5"
        >
          <span className="text-slate-400">IMPEDANCE Z₀:</span>
          <span className="text-amber-400 font-bold">376.73 Ω</span>
        </button>

        {/* Statutory Anchor */}
        <button
          onClick={() => {
            playClickBeep();
            onOpenStatutoryModal();
          }}
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 rounded border border-green-500/40 transition cursor-pointer flex items-center gap-1.5"
        >
          <span className="text-slate-400">STATUTORY ANCHOR:</span>
          <span className="text-green-400 font-bold">MCL §§ 700.7101 & 700.7817</span>
        </button>

        {/* Commercial Pricing Matrix & Deployment Tiers Modal Trigger */}
        <button
          onClick={() => {
            playClickBeep(1500);
            onOpenPricing();
          }}
          className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded border border-indigo-500/50 font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm hover:shadow-indigo-500/20"
        >
          <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
          <span>SERVICES & TIERS (T0–T3)</span>
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={handleToggleSound}
          title={audioOn ? 'Mute Procedural Harmonic Audio' : 'Enable Procedural Harmonic Audio'}
          className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          {audioOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>
    </header>
  );
}
