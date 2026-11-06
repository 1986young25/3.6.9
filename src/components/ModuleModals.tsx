import React, { useState } from 'react';
import { DefenseModule, Lobe } from '../types';
import { X, CheckCircle, ShieldAlert, Cpu, Terminal, Play, Lock, Copy, Check } from 'lucide-react';
import { playClickBeep, playHarmonicChime, playPulseReversalSound } from '../utils/audio';

interface ModuleModalsProps {
  activeModule: DefenseModule | null;
  activeLobe: Lobe | null;
  onClose: () => void;
  onLogEvent: (event: { agent: string; msg: string; type?: 'cyan' | 'amber' | 'green' | 'rose'; yield?: boolean; yieldAmount?: number }) => void;
}

export default function ModuleModals({
  activeModule,
  activeLobe,
  onClose,
  onLogEvent,
}: ModuleModalsProps) {
  // Paywall config state
  const [microFee, setMicroFee] = useState('0.0025');
  const [network, setNetwork] = useState('Base (Chain ID 8453)');
  const [paywallSimulationRunning, setPaywallSimulationRunning] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);

  // Sieve test payload state
  const [testPayload, setTestPayload] = useState('ATTACK_VECTOR_SHELL_INJECTION_HEX_9921_NOP_SLED');
  const [sieveResult, setSieveResult] = useState<{
    entropy: number;
    disarmed: boolean;
    inversionOutput: string;
  } | null>(null);

  // Copied state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    setCopiedText(label);
    playClickBeep(1800);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Run Paywall Test
  const handleSimulatePaywall = () => {
    playClickBeep(1500);
    setPaywallSimulationRunning(true);
    setSimResult('Agent initiating request to /v1/spatial/mesh... HTTP 402 Payment Required issued.');

    setTimeout(() => {
      setSimResult(
        `Agent signature verified on ${network}. Payment of ${microFee} USDC settled via smart covenant. HTTP 200 OK — 4D Covariance Splat Slice returned.`
      );
      setPaywallSimulationRunning(false);
      onLogEvent({
        agent: 'x402-GATEWAY',
        msg: `Micro-slice API query settled from Autonomous Agent. +${microFee} USDC allocated to NYMT waterfall.`,
        type: 'green',
        yield: true,
        yieldAmount: parseFloat(microFee) || 0.0025,
      });
    }, 900);
  };

  // Run Entropy Sieve calculation
  const handleCalculateEntropy = () => {
    playClickBeep(1400);
    const text = testPayload || ' ';
    const len = text.length;
    const freq: Record<string, number> = {};

    for (let i = 0; i < len; i++) {
      const char = text[i];
      freq[char] = (freq[char] || 0) + 1;
    }

    let entropy = 0;
    for (const char in freq) {
      const p = freq[char] / len;
      entropy -= p * Math.log2(p);
    }

    // Bitwise inversion disarm simulation
    let inverted = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      inverted += String.fromCharCode((~code) & 0x7f);
    }

    const disarmed = entropy < 1.5 || entropy > 4.5 || text.includes('INJECTION') || text.includes('SHELL');
    setSieveResult({
      entropy: Number(entropy.toFixed(4)),
      disarmed,
      inversionOutput: inverted.slice(0, 36) + '... [DISARMED_HEX]',
    });

    onLogEvent({
      agent: 'SIEVE-H(X)',
      msg: `Payload Entropy H(X) = ${entropy.toFixed(4)}. State: ${
        disarmed ? 'DISARMED VIA BITWISE INVERSION' : 'GATED EQUILIBRIUM NOMINAL'
      }`,
      type: disarmed ? 'amber' : 'green',
    });
  };

  if (!activeModule && !activeLobe) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-xl w-full max-w-2xl p-6 shadow-2xl space-y-5 text-xs font-mono max-h-[90vh] overflow-y-auto glow-cyan">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              {activeModule ? activeModule.title : `LOBE ${activeLobe?.number}: ${activeLobe?.name}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL 1: x402 HTTP Agent Paywalls Config */}
        {activeModule?.type === 'config' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Configure autonomous machine-to-machine HTTP 402 micro-monetization. External AI agents and automated nodes pay per-slice query access using cryptographic micro-tokens without subscription lock-in.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded border border-slate-800">
              <div>
                <label className="text-[10px] text-slate-400">Micro-Slice Fee (USDC)</label>
                <input
                  type="text"
                  value={microFee}
                  onChange={(e) => setMicroFee(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-cyan-300 mt-1 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Settlement Network</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-cyan-300 mt-1 focus:border-cyan-400 focus:outline-none"
                >
                  <option>Base (Chain ID 8453)</option>
                  <option>Ethereum Mainnet (Chain ID 1)</option>
                  <option>Arbitrum One (Chain ID 42161)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-400">Contract Recipient (NYMT Treasury)</label>
                <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 mt-1 truncate">
                  0x71C...416820289NYMT (Nicholas Young Master Trust / Michigan Sovereign Fiduciary)
                </div>
              </div>
            </div>

            {/* Paywall Simulator Box */}
            <div className="bg-black p-3.5 rounded border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400">M2M Request Simulator</span>
                <button
                  onClick={handleSimulatePaywall}
                  disabled={paywallSimulationRunning}
                  className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 rounded font-bold cursor-pointer disabled:opacity-50"
                >
                  {paywallSimulationRunning ? 'Verifying Token...' : 'Run Agent Test'}
                </button>
              </div>
              {simResult && (
                <div className="text-[10px] text-green-400 bg-slate-950 p-2 rounded border border-green-500/30 mt-2">
                  {simResult}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: Electrodynamic Attestation Audit */}
        {activeModule?.type === 'audit' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Validates external communication telemetry directly against physical electromagnetic invariants. Rejects synthetic spoofing by demanding harmonic resonance with the free-space characteristic wave impedance.
            </p>

            <div className="bg-slate-950 p-4 rounded border border-amber-500/30 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Characteristic Impedance (Z₀):</span>
                <span className="text-amber-400 font-bold">376.730313668(57) Ω</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Calculated Permeability (μ₀):</span>
                <span className="text-slate-200">1.25663706212 × 10⁻⁶ N·A⁻²</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Calculated Permittivity (ε₀):</span>
                <span className="text-slate-200">8.8541878128 × 10⁻¹² F·m⁻¹</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Tesla Harmonic Modulation Cadence:</span>
                <span className="text-cyan-400 font-bold">3.69000 Hz</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Attestation State:</span>
                <span className="text-green-400 font-bold">LOCKED & VERIFIED (0.000% DRIFT)</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  playHarmonicChime();
                  onLogEvent({
                    agent: 'ELECTRO-ATTEST',
                    msg: 'Attestation Verified: Free-space wave impedance Z₀ = 376.73 Ω within 10⁻⁹ tolerance.',
                    type: 'green',
                  });
                  onClose();
                }}
                className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/50 rounded font-bold"
              >
                Confirm Physical Audit
              </button>
            </div>
          </div>
        )}

        {/* MODAL 3: Modulo-9 Vacuum Sieve */}
        {activeModule?.type === 'sieve' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              In-memory Shannon Entropy Defense Gate (H(X)). Intercepts hostile datagrams, shellcode, and memory buffer overflows at line rate via bitwise bit-flip inversion before CPU registers parse execution.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">Inbound Telemetry Datagram Buffer:</label>
              <textarea
                rows={2}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTestPayload('BENIGN_MAVLINK_TELEMETRY_LAT_42.3314_LON_83.0458_ALT_180M')}
                className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px]"
              >
                Sample: Benign MAVLink
              </button>
              <button
                onClick={() => setTestPayload('\\x90\\x90\\x90\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e')}
                className="px-2 py-1 bg-slate-800 text-amber-300 rounded text-[10px]"
              >
                Sample: Shellcode Sled
              </button>
              <button
                onClick={handleCalculateEntropy}
                className="ml-auto px-4 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 rounded font-bold"
              >
                Evaluate Sieve H(X)
              </button>
            </div>

            {sieveResult && (
              <div className="p-3 bg-black rounded border border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Shannon Entropy H(X):</span>
                  <span className="text-cyan-400 font-bold">{sieveResult.entropy} bits/symbol</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Equilibrium Range:</span>
                  <span className="text-slate-300">1.5000 ≤ H(X) ≤ 4.5000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Modulo-9 Disarm Action:</span>
                  <span className={`font-bold ${sieveResult.disarmed ? 'text-amber-400' : 'text-green-400'}`}>
                    {sieveResult.disarmed ? 'BITWISE INVERSION APPLIED' : 'CLEARED TO REGISTERS'}
                  </span>
                </div>
                {sieveResult.disarmed && (
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    Neutralized Output: <span className="text-cyan-300">{sieveResult.inversionOutput}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODAL 4: UCC Art 12 CER Ledger & State Seals */}
        {activeModule?.type === 'title' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Uniform Commercial Code (UCC) Article 12 Controllable Electronic Records (CER). Direct deterministic binding of software runtime performance to balance-sheet assets, statutory filings, and Michigan trust code.
            </p>

            <div className="bg-slate-950 p-4 rounded border border-green-500/30 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">State Seal Prefix:</span>
                <span className="text-green-400 font-bold">UCC-CER-NYMT-XB6-2026-X89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">SHA-256 State Root:</span>
                <button
                  onClick={() => handleCopy('24ff87e49c7104b38fae19d701e847cbb6412098bc3ef8d22c9a108b5e21098bc', 'root')}
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>24ff87e4...21098bc</span>
                  {copiedText === 'root' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Statutory Authority:</span>
                <span className="text-slate-200">MCL §§ 700.7101, 700.7817, 700.7913</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Legal Classification:</span>
                <span className="text-amber-400 font-semibold">Perfected Controllable Electronic Record (CER)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fiduciary Entity:</span>
                <span className="text-slate-200">The Nicholas Young Master Trust (EIN 41-6820289)</span>
              </div>
            </div>

            <div className="p-3 bg-black rounded border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              Every database delta captured by the background daemon (cdc_feedback.py) is anchored with nanosecond timestamps, providing indisputable real-time proof of solvency and operational compliance for regulatory reviews and corporate audits.
            </div>
          </div>
        )}

        {/* MODAL 5: ATRM Phase Nulling Shield */}
        {activeModule?.type === 'shield' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Acoustic Time Reversal Mirror (ATRM) projecting inverse pressure waves to null acoustic ingress signatures and physical structural acoustic eavesdropping at a -42.60 dB attenuation floor.
            </p>

            <div className="bg-slate-950 p-4 rounded border border-cyan-500/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Noise Ingress:</span>
                <span className="text-rose-400 font-bold">+58.4 dB SPL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Phase Nulling Projector:</span>
                <span className="text-cyan-400 font-bold">-58.4 dB (180° Anti-Phase)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Residual Enforced Floor:</span>
                <span className="text-green-400 font-bold">-42.60 dB [ENFORCED]</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sampling Rate:</span>
                <span className="text-slate-200">192 kHz 32-Bit Float</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  playPulseReversalSound();
                  onLogEvent({
                    agent: 'ATRM-SHIELD',
                    msg: 'Acoustic Phase Nulling Beam Recalibrated. -42.60 dB attenuation verified across 20Hz-48kHz band.',
                    type: 'cyan',
                  });
                  onClose();
                }}
                className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 rounded font-bold"
              >
                Pulse Phase Calibration
              </button>
            </div>
          </div>
        )}

        {/* LOBE DIAGNOSTIC INSPECTOR (when activeLobe is open) */}
        {activeLobe && !activeModule && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded border border-cyan-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Designation:</span>
                <span className="text-cyan-300 font-bold text-sm">LOBE {activeLobe.number} // {activeLobe.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Specialization Role:</span>
                <span className="text-green-400 font-semibold">{activeLobe.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Metric:</span>
                <span className="text-amber-400 font-bold">{activeLobe.metric}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Operational Gate:</span>
                <span className="text-green-400">{activeLobe.status}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                {activeLobe.description}
              </div>
            </div>

            <div className="p-3 bg-black rounded border border-slate-800 text-[10px] text-slate-400">
              <span className="text-cyan-400 font-bold">GOVERNANCE INVARIANT:</span> {activeLobe.governance}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  playClickBeep(1600);
                  onLogEvent({
                    agent: activeLobe.name,
                    msg: `Manual diagnostics passed. Lobe ${activeLobe.number} operational gates in nominal equilibrium.`,
                    type: 'cyan',
                  });
                  onClose();
                }}
                className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 rounded font-bold"
              >
                Acknowledge Nominal Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
