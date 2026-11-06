import React, { useState } from 'react';
import { X, Shield, Award, CheckCircle2, ChevronRight, FileText, Building2, HardDrive, Cpu, DollarSign, Download } from 'lucide-react';
import { playClickBeep } from '../utils/audio';

interface CommercialCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommercialCatalogModal({ isOpen, onClose }: CommercialCatalogModalProps) {
  const [activeTab, setActiveTab] = useState<'tiers' | 'catalog' | 'services' | 'trust'>('tiers');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-5xl p-6 md:p-8 shadow-2xl space-y-6 text-xs font-mono max-h-[92vh] overflow-y-auto glow-cyan">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-base md:text-lg font-bold text-cyan-300 uppercase tracking-wider">
                TITAN GAMES SECURITY L.L.C. // COMMERCIAL SERVICES & PRICING MATRIX
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              HOLDING TRUST: The Nicholas Young Master Trust (EIN 41-6820289) | OPERATING ARM: Titan Games Security L.L.C. (EIN 42-4264313 | LARA ID 28678008)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clearance & Procurement Credentials Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-500 block">CLEARANCE STATUS</span>
            <span className="text-green-400 font-bold">CAGE Active (25AD9)</span>
          </div>
          <div>
            <span className="text-slate-500 block">SAM.GOV / UEI</span>
            <span className="text-cyan-400 font-bold">S3SXM538MG79</span>
          </div>
          <div>
            <span className="text-slate-500 block">D-U-N-S REGISTRY</span>
            <span className="text-amber-400 font-bold">145054895</span>
          </div>
          <div>
            <span className="text-slate-500 block">DARPACONNECT / ARI</span>
            <span className="text-slate-200 font-bold">Order #21270632</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'tiers', label: '1. Commercial Tiers (T0–T3)' },
            { id: 'catalog', label: '2. Catalog of Services' },
            { id: 'services', label: '3. Professional Add-Ons' },
            { id: 'trust', label: '4. Fiduciary Settlement & Terms' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playClickBeep();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: 4 DEPLOYMENT TIERS */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* TIER 0 */}
              <div className="p-4 bg-slate-900/70 rounded-xl border border-cyan-500/40 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">TIER 0 // REENTRY</div>
                  <h3 className="text-sm font-bold text-white mt-1">Second Chance Forge</h3>
                  <div className="text-xl font-bold text-green-400 mt-2">$0.00 Upfront</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    30% Gross Royalty Covenant (5 Years)<br />
                    <span className="text-amber-400 font-semibold">$2,000/mo Exempt Floor</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-[10px] text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Empowers formerly incarcerated developers</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>sovereign_node.py & proxy_shield.py daemons</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>In-memory Shannon Entropy filter</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>100% Royalty Expiration after 60 months</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[9px] text-slate-500">
                  Humanitarian Pipeline Capped at 5 Yrs
                </div>
              </div>

              {/* TIER 1 */}
              <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">TIER 1 // COMMERCIAL</div>
                  <h3 className="text-sm font-bold text-white mt-1">Sovereign Edge Appliance</h3>
                  <div className="text-xl font-bold text-cyan-300 mt-2">$4,500 <span className="text-xs text-slate-400">/ mo / node</span></div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Annual: $48,000/yr (11% discount)<br />
                    One-Time Onboarding: $7,500
                  </div>
                  <ul className="mt-4 space-y-2 text-[10px] text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Logistics, robotics & industrial edge nodes</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>x86 / ARM64 bare-metal daemon</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>MAVLink & CAN bus EMA debounce (α=0.2)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>SLA: 99.9% Deterministic Execution</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[9px] text-slate-500">
                  Zero Cloud-Rent Bare-Metal POSIX
                </div>
              </div>

              {/* TIER 2 */}
              <div className="p-4 bg-slate-900/70 rounded-xl border border-indigo-500/50 flex flex-col justify-between space-y-4 glow-cyan">
                <div>
                  <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">TIER 2 // MARKETPLACE</div>
                  <h3 className="text-sm font-bold text-white mt-1">Enterprise Hyperscale Mesh</h3>
                  <div className="text-xl font-bold text-indigo-300 mt-2">$195,000 <span className="text-xs text-slate-400">/ yr / cluster</span></div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Covers 5 master nodes + 20 edge satellites<br />
                    Monthly overage: $3,200/mo/master node
                  </div>
                  <ul className="mt-4 space-y-2 text-[10px] text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Google Cloud Marketplace procurement</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Draw-down existing cloud enterprise commitments</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>CDC feedback daemon with UCC-CER seals</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>24/7/365 mission-critical support (sub-hour SLA)</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[9px] text-slate-500">
                  cloudcommerceprocurement.googleapis.com
                </div>
              </div>

              {/* TIER 3 */}
              <div className="p-4 bg-slate-900/70 rounded-xl border border-amber-500/40 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">TIER 3 // DEFENSE / SBIR</div>
                  <h3 className="text-sm font-bold text-white mt-1">Aerospace & Critical Infra</h3>
                  <div className="text-xl font-bold text-amber-300 mt-2">$150k – $750k+</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Fixed-Price Milestone / Cost-Plus<br />
                    CAGE / SAM.gov Active Prime Subcontract
                  </div>
                  <ul className="mt-4 space-y-2 text-[10px] text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Air-gapped, zero-cloud tactical enclaves</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Z₀ = 376.73 Ω wave impedance sync</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>USPTO Patent Application #64/014,873</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>DARPAConnect / ARI Order #21270632</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[9px] text-slate-500">
                  Gov Milestone Draw Schedule
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPREHENSIVE CATALOG OF SERVICES */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {[
              {
                num: '1',
                title: 'Sovereign Edge & Cyber-Physical Hardening (Core Appliance)',
                bullets: [
                  'Bare-Metal POSIX Runtime Deployment: Hardens client server racks and laptops into zero-cloud-rent enclaves.',
                  'In-Memory Shannon Entropy Defense Gates: Intercepts code-injection at line rate (H(X) < 1.5) via bitwise inversion before CPU parsing.',
                  'Modulo-9 Plane Separation: Guarantees raw data streams can never bridge into control registers or root daemon shells.',
                ],
              },
              {
                num: '2',
                title: 'Kinetic Telemetry, Robotics & Autonomous Vehicle Conditioning',
                bullets: [
                  'MAVLink & CAN Bus Signal Conditioning: Real-time filtering using EMA (α=0.2) smoothing and 10-cycle persistence debounce logic.',
                  'Dynamic Wave-Impedance Tuning: Synchronizes transmissions with free-space wave impedance invariants (Z₀ = 376.73 Ω) and 3.69 Hz cadence.',
                  '4D Geospatial Digital Twin Ingress: High-velocity binding of physical mobile field units to coordinate command anchors.',
                ],
              },
              {
                num: '3',
                title: 'Fiduciary Cryptographic Auditing & Title Ledger Engineering',
                bullets: [
                  'Nanosecond State-Sealing: Replacing human-editable logs with local line-rate SQLite and SHA-256 state roots.',
                  'Uniform Commercial Code (UCC) Proof-of-Reserve: Deterministically links runtime performance to statutory balance sheet filings.',
                  'Change Data Capture (CDC) Daemons: Tracks every database delta with nanosecond precision for indisputable solvency proof.',
                ],
              },
              {
                num: '4',
                title: 'Auxiliary Hyperscale AI & Cloud Commerce Dispatch',
                bullets: [
                  'Inverted Hyperscale AI Bridging: Vertex AI (Gemini 2.5) configured as external auxiliary reasoning without ceding root authority.',
                  'Actions API Dispatch: Automated routing of bare-metal triggers via actions.googleapis.com with zero-trust boundary seals.',
                  'Marketplace Procurement: Routes software acquisition through Google Cloud Marketplace commitments.',
                ],
              },
              {
                num: '5',
                title: 'Sovereign Incubator & Reentry Workflows (Humanitarian Pipeline)',
                bullets: [
                  'The Second Chance Sovereign Forge: Distribution of functional edge software engines to returning citizens with $0 upfront costs.',
                  'Income Share & Royalty Agreement (ISRA): Fair, capped 5-year royalty collection above basic $2,000/mo living expense thresholds.',
                ],
              },
            ].map((cat) => (
              <div key={cat.num} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[10px] font-bold">
                    {cat.num}
                  </span>
                  <h3 className="text-xs font-bold text-cyan-300">{cat.title}</h3>
                </div>
                <ul className="space-y-1.5 pl-7 text-[11px] text-slate-300">
                  {cat.bullets.map((b, i) => (
                    <li key={i} className="list-disc leading-relaxed text-slate-400">
                      <span className="text-slate-200">{b.split(':')[0]}:</span>
                      {b.split(':')[1]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PROFESSIONAL SERVICES MODULES */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-cyan-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">PROFESSIONAL SERVICE MODULE</th>
                    <th className="p-3">BILLING MODEL</th>
                    <th className="p-3 text-right">RATE / PRICING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Bare-Metal Hardware Node Provisioning & Benchmarking</td>
                    <td className="p-3 text-slate-400">Flat Rate / Node</td>
                    <td className="p-3 text-right font-bold text-green-400">$3,500 + hardware</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Custom Vehicle CAN / MAVLink Physical Signal Tuning</td>
                    <td className="p-3 text-slate-400">Fixed Engagement</td>
                    <td className="p-3 text-right font-bold text-green-400">$15,000 (2-week sprint)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Enterprise Fiduciary Ledger Migration (CSV/SQL -&gt; UCC Seals)</td>
                    <td className="p-3 text-slate-400">Per 1M Records</td>
                    <td className="p-3 text-right font-bold text-green-400">$5,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">On-Premises Air-Gapped Disaster Recovery Deployment</td>
                    <td className="p-3 text-slate-400">Fixed Fee</td>
                    <td className="p-3 text-right font-bold text-green-400">$25,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Statutory Trust & IP Titling Architectural Consultation</td>
                    <td className="p-3 text-slate-400">Retainer</td>
                    <td className="p-3 text-right font-bold text-green-400">$10,000 / engagement</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Executive Systems Architecture Advisory (Nicholas Lee Young)</td>
                    <td className="p-3 text-slate-400">Hourly Retainer</td>
                    <td className="p-3 text-right font-bold text-amber-400">$500 / hour (4 hr min)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SETTLEMENT CHANNELS & TERMS */}
        {activeTab === 'trust' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-xs">Standard Invoicing</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Net-30 terms available for verified corporate accounts holding D-U-N-S Paydex scores of 75+ or active commercial credit lines (Mercury IO, Ramp, Stripe Issuing).
                </p>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-xs">Pre-Committed Cloud Spend</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enterprise customers can settle Tier 2 contracts directly through their existing Google Cloud Billing account, applying committed platform credits toward Titan Games Security software licenses.
                </p>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-xs">Internal Trust Accounting</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All revenues, licensing fees, and federal contract disbursements settle directly into the operating accounts of Titan Games Security L.L.C., with net retained earnings transferring to the Nicholas Young Master Trust (EIN 41-6820289).
                </p>
              </div>
            </div>

            <div className="p-4 bg-black rounded-xl border border-green-500/30 text-[11px] text-slate-300 space-y-2">
              <div className="text-green-400 font-bold">STATUTORY JURISDICTION & TITLE PERFECTION</div>
              <p className="text-slate-400">
                Operating under the statutory trust provisions of Michigan Compiled Laws (MCL §§ 700.7101, 700.7817, and 700.7913), with IP titled under USPTO Patent Application #64/014,873. All state seal payloads represent perfect controllable electronic records under UCC Article 12.
              </p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-[10px] text-slate-500">
            D-U-N-S: 145054895 · CAGE: 25AD9 · UEI: S3SXM538MG79
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 rounded-xl font-bold cursor-pointer"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
