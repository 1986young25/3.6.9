import React, { useState, useEffect, useRef } from 'react';
import { TelemetryEvent } from '../types';
import { playClickBeep } from '../utils/audio';
import { Pause, Play, Download, Trash2, Filter } from 'lucide-react';

interface AutonomousEngineProps {
  events: TelemetryEvent[];
  selectedLobeName: string | null;
  onClearEvents: () => void;
  onInjectTransaction: () => void;
}

export default function AutonomousEngine({
  events,
  selectedLobeName,
  onClearEvents,
  onInjectTransaction,
}: AutonomousEngineProps) {
  const [currentYield, setCurrentYield] = useState<number>(1482930.50);
  const [simdRate, setSimdRate] = useState<string>('16.113B WVec/s');
  const [netEquity, setNetEquity] = useState<number>(4006200.00);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>('');

  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Auto-accumulate yield periodically if not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const inc = Math.random() * 2.50 + 0.05;
      setCurrentYield((prev) => prev + inc);
      
      // Slight fluctuation in SIMD processing rate
      const rateNum = (16.080 + Math.random() * 0.065).toFixed(3);
      setSimdRate(`${rateNum}B WVec/s`);

      // Equity micro-compounding (30% waterfall allocation)
      setNetEquity((prev) => prev + inc * 0.30);
    }, 1800);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (selectedLobeName && ev.agent !== selectedLobeName && ev.lobe !== selectedLobeName) {
      return false;
    }
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      return (
        ev.agent.toLowerCase().includes(q) ||
        ev.msg.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Download logs as CSV
  const handleExportLogs = () => {
    playClickBeep(1600);
    const headers = 'Timestamp,Agent,Message,Yield,Hash\n';
    const rows = filteredEvents
      .map(
        (e) =>
          `"${e.timestamp}","${e.agent}","${e.msg.replace(/"/g, '""')}","${
            e.yield ? e.yieldAmount || '0.00' : ''
          }","${e.hash || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `titan-m2m-telemetry-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border-glow rounded-lg p-4 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Autonomous M2M SaaS Engine
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onInjectTransaction}
              title="Simulate micro-slice M2M API transaction"
              className="text-[10px] px-2 py-0.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded font-mono transition cursor-pointer"
            >
              + SIM PAYWALL
            </button>
            <span className="text-xs px-2 py-0.5 bg-green-950 text-green-400 border border-green-500/40 rounded font-mono font-semibold">
              SETTLEMENT LIVE
            </span>
          </div>
        </div>

        {/* REVENUE METRICS */}
        <div className="space-y-2 font-mono">
          <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between items-center shadow-inner">
            <span className="text-xs text-slate-400">M2M Yield (USDC/RSN):</span>
            <span id="m2m-yield" className="text-base font-bold text-green-400 tabular-nums">
              ${currentYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">SIMD Slice Processing:</span>
            <span id="api-rate" className="text-xs font-bold text-cyan-400 tabular-nums">
              {simdRate}
            </span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">Master Trust Net Equity:</span>
            <span className="text-xs font-bold text-amber-400 tabular-nums">
              ${netEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>

        {/* REAL-TIME FIRESTORE & M2M EVENT FEED HEADER */}
        <div className="flex items-center justify-between mt-4 mb-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>Live Telemetry & M2M Feed</span>
            {selectedLobeName && (
              <span className="text-[9px] text-cyan-300 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/40">
                Lobe: {selectedLobeName}
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-cyan-400 font-mono">PORT 9100 SSE</span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
              title={isPaused ? 'Resume stream' : 'Pause stream'}
            >
              {isPaused ? <Play className="w-3 h-3 text-green-400" /> : <Pause className="w-3 h-3" />}
            </button>
            <button
              onClick={handleExportLogs}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
              title="Export logs as CSV"
            >
              <Download className="w-3 h-3 text-cyan-400" />
            </button>
            <button
              onClick={onClearEvents}
              className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition"
              title="Clear feed"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Search / Filter input */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Filter stream by agent or keyword..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-black/70 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* STREAM FEED LOG */}
        <div
          id="m2m-feed"
          ref={feedContainerRef}
          className="h-48 overflow-y-auto bg-black p-2 text-[10px] space-y-1.5 font-mono rounded border border-slate-800"
        >
          {filteredEvents.length === 0 ? (
            <div className="text-slate-600 text-center py-6">No matching telemetry events.</div>
          ) : (
            filteredEvents.map((event) => {
              const colorClass =
                event.type === 'amber'
                  ? 'text-amber-400'
                  : event.type === 'green'
                  ? 'text-green-400'
                  : event.type === 'rose'
                  ? 'text-rose-400'
                  : 'text-cyan-400';

              return (
                <div key={event.id} className="text-slate-400 leading-tight border-b border-slate-900/60 pb-1">
                  <span className="text-slate-600">[{event.timestamp}]</span>{' '}
                  <span className={`font-semibold ${colorClass}`}>{event.agent}:</span>{' '}
                  <span>{event.msg}</span>
                  {event.yield && (
                    <span className="text-green-400 font-bold ml-1.5">
                      +{event.yieldAmount ? event.yieldAmount.toFixed(4) : '0.1250'} USDC
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FOOTER WATERFALL STATUS */}
      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row justify-between text-[10px] text-slate-500 font-mono gap-1">
        <span className="text-cyan-400/80">WATERFALL: 70% OPS / 30% NYMT</span>
        <span className="text-green-400/80">MCL § 700.7913 PERFECTED</span>
      </div>
    </div>
  );
}
