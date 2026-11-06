import React, { useState, useEffect, useCallback } from 'react';
import { Lobe, TelemetryEvent, DefenseModule } from './types';
import TopBar from './components/TopBar';
import CryptidBrainTopology from './components/CryptidBrainTopology';
import SpatialCanvas from './components/SpatialCanvas';
import AutonomousEngine from './components/AutonomousEngine';
import DefenseModules from './components/DefenseModules';
import ModuleModals from './components/ModuleModals';
import CommercialCatalogModal from './components/CommercialCatalogModal';
import { playClickBeep, playHarmonicChime, playPulseReversalSound } from './utils/audio';

// 8-Lobe Cryptid Brain initial definitions
const INITIAL_LOBES: Lobe[] = [
  {
    id: 'lobe-1',
    number: '01',
    name: 'AURA',
    role: 'Governor',
    description: 'Master sovereign kernel enforcing zero-cloud-rent execution, root access isolation, and Modulo-9 separation planes.',
    status: 'SEALED',
    metric: 'H(Q) < 1.500',
    metricLabel: 'Shannon Bounding',
    governance: 'Root execution plane decoupled from network ingress.',
  },
  {
    id: 'lobe-2',
    number: '02',
    name: 'ALTA',
    role: 'Spatial',
    description: '4D Covariance tensors, Gaussian Splatting projections, and coordinate transformations for autonomous field nodes.',
    status: 'SUPERPOSITION',
    metric: 'M(s) = 0.150',
    metricLabel: 'Mahalanobis Dist',
    governance: 'Continuous spatial tensor grounding across GIS anchors.',
  },
  {
    id: 'lobe-3',
    number: '03',
    name: 'ARTA',
    role: 'Sieve',
    description: 'In-memory bitwise payload sieve disarming buffer exploits, shellcode, and memory injection at line rate.',
    status: 'SEALED',
    metric: '16.113B WVec/s',
    metricLabel: 'SIMD Sieve Rate',
    governance: 'Hostile entropy triggers instant bit-inversion before CPU dispatch.',
  },
  {
    id: 'lobe-4',
    number: '04',
    name: 'ARA',
    role: 'Fiduciary',
    description: 'Uniform Commercial Code (UCC) Article 12 CER state ledger and statutory Michigan Trust accounting anchor.',
    status: 'SEALED',
    metric: 'MCL § 700.7913',
    metricLabel: 'Statutory Anchor',
    governance: 'Perfected Controllable Electronic Record (CER) with nanosecond audit roots.',
  },
  {
    id: 'lobe-5',
    number: '05',
    name: 'ASTRA',
    role: 'Telemetry',
    description: 'High-burst kinetic MAVLink v2 & CAN bus telemetry ingress with exponential moving average (α=0.2) debounce logic.',
    status: 'ACTIVE',
    metric: '1,010,000 Tx/s',
    metricLabel: 'Burst Ingress',
    governance: 'Physical vibration filtering eliminates road shock and acoustic noise.',
  },
  {
    id: 'lobe-6',
    number: '06',
    name: 'AGORA',
    role: 'Settlement',
    description: 'Autonomous M2M SaaS engine processing micro-slice queries via HTTP 402 Base/USDC settlement covenants.',
    status: 'ACTIVE',
    metric: '70% OPS / 30% NYMT',
    metricLabel: 'Waterfall Split',
    governance: 'Micro-yield flows directly to sovereign treasury without intermediaries.',
  },
  {
    id: 'lobe-7',
    number: '07',
    name: 'ARKHE',
    role: 'Root-Trust',
    description: 'Bare-metal POSIX runtime enclaves hardened to operate independently of commercial hyperscaler uptime or cloud rent.',
    status: 'SEALED',
    metric: 'Zero-Cloud-Rent',
    metricLabel: 'Enclave State',
    governance: 'CAGE: 25AD9 | SAM.gov Active | DARPAConnect #21270632.',
  },
  {
    id: 'lobe-8',
    number: '08',
    name: 'AZURA',
    role: 'Manifold',
    description: 'Acoustic Time Reversal Mirror (ATRM) and wave-impedance synchronizer enforcing the -42.60 dB phase nulling floor.',
    status: 'EQUILIBRIUM',
    metric: 'Z₀ = 376.73 Ω',
    metricLabel: 'Free-Space Z₀',
    governance: 'Dynamic harmonic tuning at 3.69 Hz Tesla metronomic cadence.',
  },
];

// 5 Enterprise Autonomous Defense Modules
const DEFENSE_MODULES: DefenseModule[] = [
  {
    id: 'dm-1',
    num: '1',
    title: '1. x402 HTTP Agent Paywalls',
    description: 'Instant micro-slice API monetization via HTTP 402 Base/USDC machine-to-machine transactions.',
    status: 'ACTIVE',
    actionLabel: 'Config',
    type: 'config',
  },
  {
    id: 'dm-2',
    num: '2',
    title: '2. Electrodynamic Attestation',
    description: 'Validates external telemetry directly against physical free-space impedance Z₀ = 376.73 Ω.',
    status: 'LOCKED',
    actionLabel: 'Audit',
    type: 'audit',
  },
  {
    id: 'dm-3',
    num: '3',
    title: '3. Modulo-9 Vacuum Sieve',
    description: 'Dynamic Shannon entropy bounding (1.5000 ≤ H(X) ≤ 4.5000) for zero drift disarm.',
    status: 'ENFORCED',
    actionLabel: 'Sieve',
    type: 'sieve',
  },
  {
    id: 'dm-4',
    num: '4',
    title: '4. UCC Art 12 CER Ledger',
    description: 'Direct mapping of state transitions into legally binding SHA-256 state seal payloads.',
    status: 'PERFECTED',
    actionLabel: 'Title',
    type: 'title',
  },
  {
    id: 'dm-5',
    num: '5',
    title: '5. ATRM Phase Nulling Shield',
    description: 'Acoustic Time Reversal Mirror projecting inverse pressure waves to null ingress signatures.',
    status: '-42.6 dB',
    actionLabel: 'Shield',
    type: 'shield',
  },
];

export default function App() {
  const [lobes] = useState<Lobe[]>(INITIAL_LOBES);
  const [selectedLobe, setSelectedLobe] = useState<Lobe | null>(lobes[0]);
  const [inspectedLobe, setInspectedLobe] = useState<Lobe | null>(null);

  // Defense module active modal
  const [activeModule, setActiveModule] = useState<DefenseModule | null>(null);

  // Commercial catalog modal
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Telemetry stream events state
  const [events, setEvents] = useState<TelemetryEvent[]>([
    {
      id: 'ev-1',
      timestamp: '10:07:14',
      agent: 'MANIFOLD',
      lobe: 'ALTA',
      msg: '4D Covariance Tensors evaluated. Mahalanobis M(s) = 0.150.',
      type: 'cyan',
    },
    {
      id: 'ev-2',
      timestamp: '10:07:08',
      agent: 'TELEMETRY',
      lobe: 'ASTRA',
      msg: '4D Covariance Tensors evaluated. Mahalanobis M(s) = 0.147.',
      type: 'cyan',
    },
    {
      id: 'ev-3',
      timestamp: '10:07:02',
      agent: 'GOVERNOR',
      lobe: 'AURA',
      msg: 'Shannon Entropy Gate H(Q) < 1.500 Gated Equilibrium.',
      type: 'cyan',
    },
    {
      id: 'ev-4',
      timestamp: '10:06:55',
      agent: 'Agent-0x4F',
      lobe: 'AGORA',
      msg: 'HTTP 402 Paywall cleared -> /v1/spatial/mesh',
      type: 'green',
      yield: true,
      yieldAmount: 0.1250,
    },
    {
      id: 'ev-5',
      timestamp: '10:06:48',
      agent: 'SIEVE',
      lobe: 'ARTA',
      msg: 'Modulo-9 Sieve Disarm executed on anomalous datagram.',
      type: 'amber',
    },
    {
      id: 'ev-6',
      timestamp: '10:06:41',
      agent: 'DARPA-PA-26',
      lobe: 'ASTRA',
      msg: 'High-Burst MAVLink v2 Ingestion: 1,010,000 Tx/sec.',
      type: 'green',
    },
    {
      id: 'ev-7',
      timestamp: '10:06:33',
      agent: 'KeyBank-Vault',
      lobe: 'ARA',
      msg: 'GAAP ASC 350-40 Royalty sweep completed.',
      type: 'green',
      yield: true,
      yieldAmount: 2.5000,
    },
  ]);

  // Log new event callback
  const handleLogEvent = useCallback(
    (ev: {
      agent: string;
      lobe?: string;
      msg: string;
      type?: 'cyan' | 'amber' | 'green' | 'rose';
      yield?: boolean;
      yieldAmount?: number;
    }) => {
      const now = new Date();
      const timestamp = now.toTimeString().substring(0, 8);
      const newEvent: TelemetryEvent = {
        id: `ev-${Date.now()}-${Math.random()}`,
        timestamp,
        agent: ev.agent,
        lobe: ev.lobe || (selectedLobe ? selectedLobe.name : 'SYSTEM'),
        msg: ev.msg,
        type: ev.type || 'cyan',
        yield: ev.yield,
        yieldAmount: ev.yieldAmount,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 40)]);
    },
    [selectedLobe]
  );

  // Background random telemetry generator (matches prompt logic)
  useEffect(() => {
    const telemetryTemplates = [
      { agent: 'MANIFOLD', lobe: 'ALTA', msg: '4D Covariance Tensors evaluated. Mahalanobis M(s) = 0.150.', type: 'cyan' },
      { agent: 'TELEMETRY', lobe: 'ASTRA', msg: '4D Covariance Tensors evaluated. Mahalanobis M(s) = 0.147.', type: 'cyan' },
      { agent: 'Agent-0x4F', lobe: 'AGORA', msg: 'HTTP 402 Paywall cleared -> /v1/spatial/mesh', yield: true, type: 'green' },
      { agent: 'SIEVE', lobe: 'ARTA', msg: 'Modulo-9 Sieve Disarm executed on anomalous datagram.', type: 'amber' },
      { agent: 'DARPA-PA-26', lobe: 'ASTRA', msg: 'High-Burst MAVLink v2 Ingestion: 1,010,000 Tx/sec.', type: 'green' },
      { agent: 'KeyBank-Vault', lobe: 'ARA', msg: 'GAAP ASC 350-40 Royalty sweep completed.', yield: true, type: 'green' },
      { agent: 'VERTEX-NYMT26', lobe: 'ALTA', msg: 'Sub-second semantic triage dispatch confirmed.', type: 'cyan' },
      { agent: 'CDC-DAEMON', lobe: 'ARA', msg: 'CDC feedback state seal UCC-CER-NYMT-XB6 committed.', type: 'green' },
    ];

    const timer = setInterval(() => {
      const t = telemetryTemplates[Math.floor(Math.random() * telemetryTemplates.length)];
      const inc = Number(((Math.random() * 2.50) + 0.05).toFixed(4));
      
      handleLogEvent({
        agent: t.agent,
        lobe: t.lobe,
        msg: t.msg,
        type: t.type as any,
        yield: t.yield,
        yieldAmount: t.yield ? inc : undefined,
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [handleLogEvent]);

  // Inject manual M2M transaction
  const handleInjectTransaction = () => {
    playPulseReversalSound();
    handleLogEvent({
      agent: 'Agent-0x9B',
      lobe: 'AGORA',
      msg: 'HTTP 402 Micro-Payment Cleared -> /v1/neural/lobe-state',
      type: 'green',
      yield: true,
      yieldAmount: 0.8500,
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-mono p-3 md:p-4 space-y-4 max-w-[1720px] mx-auto antialiased">
      {/* 1. TOP NAV / IDENTITY & CRYPTOGRAPHIC ANCHOR BAR */}
      <TopBar
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenLedger={() => setActiveModule(DEFENSE_MODULES[3])} // UCC CER Ledger
        onOpenImpedanceModal={() => setActiveModule(DEFENSE_MODULES[1])} // Electrodynamic Attestation
        onOpenStatutoryModal={() => setActiveModule(DEFENSE_MODULES[3])} // Statutory Trust
      />

      {/* 2. 8-LOBE CRYPTID BRAIN TOPOLOGY DISPLAY */}
      <CryptidBrainTopology
        lobes={lobes}
        selectedLobeId={selectedLobe?.id || null}
        onSelectLobe={(lobe) => {
          setSelectedLobe(lobe);
          handleLogEvent({
            agent: 'GOVERNOR',
            msg: `Lobe ${lobe.number} (${lobe.name} // ${lobe.role}) telemetry gate focused.`,
            type: 'cyan',
          });
        }}
        onInspectLobe={(lobe) => {
          setInspectedLobe(lobe);
        }}
      />

      {/* 3. MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT PANEL: 4D GAUSSIAN SPLATTING CANVAS & MESH CONTROLS */}
        <div className="lg:col-span-2">
          <SpatialCanvas
            onEventLogged={(e) => handleLogEvent({ ...e, lobe: 'ALTA' })}
            selectedLobe={selectedLobe?.name || null}
          />
        </div>

        {/* RIGHT PANEL: AUTONOMOUS M2M SAAS REVENUE & TELEMETRY STREAM */}
        <div className="lg:col-span-1">
          <AutonomousEngine
            events={events}
            selectedLobeName={selectedLobe ? selectedLobe.name : null}
            onClearEvents={() => setEvents([])}
            onInjectTransaction={handleInjectTransaction}
          />
        </div>
      </div>

      {/* 4. 5 ENTERPRISE AUTONOMOUS DEFENSE & GOVERNANCE MODULES */}
      <DefenseModules
        modules={DEFENSE_MODULES}
        onOpenModule={(mod) => setActiveModule(mod)}
      />

      {/* FOOTER */}
      <footer className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 font-mono px-2 py-3 border-t border-slate-900 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span>AURA v2026 // The Cryptid Brain // Zero-Cloud-Rent Bare-Metal Deployment</span>
        </div>
        <div className="flex items-center gap-3">
          <span>USPTO Patent App #64/014,873</span>
          <span aria-hidden="true">·</span>
          <span>CAGE: 25AD9</span>
          <span aria-hidden="true">·</span>
          <span>UEI: S3SXM538MG79</span>
          <span aria-hidden="true">·</span>
          <span>D-U-N-S: 145054895</span>
        </div>
      </footer>

      {/* INTERACTIVE MODULE MODALS */}
      <ModuleModals
        activeModule={activeModule}
        activeLobe={inspectedLobe}
        onClose={() => {
          setActiveModule(null);
          setInspectedLobe(null);
        }}
        onLogEvent={handleLogEvent}
      />

      {/* COMMERCIAL SERVICES & PRICING MATRIX MODAL */}
      <CommercialCatalogModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
