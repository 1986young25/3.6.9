import React from 'react';
import { Lobe } from '../types';
import { playClickBeep } from '../utils/audio';

interface CryptidBrainTopologyProps {
  lobes: Lobe[];
  selectedLobeId: string | null;
  onSelectLobe: (lobe: Lobe) => void;
  onInspectLobe: (lobe: Lobe) => void;
}

export default function CryptidBrainTopology({
  lobes,
  selectedLobeId,
  onSelectLobe,
  onInspectLobe,
}: CryptidBrainTopologyProps) {
  return (
    <section className="bg-slate-900 border-glow rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            ></path>
          </svg>
          <span>Active Neural Architecture // 8-Lobe Cryptid Brain Topology</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-green-400 font-mono px-2 py-0.5 bg-green-950 border border-green-500/40 rounded flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            ALL GATES SEALED
          </span>
          <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 bg-cyan-950 border border-cyan-500/30 rounded hidden md:inline-block">
            MODULO-9 INVARIANT
          </span>
        </div>
      </div>

      {/* 8-Lobe Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-mono">
        {lobes.map((lobe) => {
          const isSelected = selectedLobeId === lobe.id;
          return (
            <div
              key={lobe.id}
              onClick={() => {
                playClickBeep(1200 + parseInt(lobe.number) * 100);
                onSelectLobe(lobe);
              }}
              onDoubleClick={() => onInspectLobe(lobe)}
              className={`p-2.5 bg-slate-950 rounded border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'border-cyan-400 glow-cyan bg-cyan-950/30'
                  : 'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-slate-900/60'
              }`}
            >
              <div className="text-[10px] text-slate-400 group-hover:text-slate-300">
                LOBE {lobe.number}
              </div>
              <div className="font-bold text-cyan-300 text-sm tracking-wide mt-0.5">
                {lobe.name}
              </div>
              <div className="text-[9px] text-green-400 mt-1 font-medium">
                {lobe.role}
              </div>
              <div className="text-[8px] text-slate-500 mt-1 truncate">
                {lobe.metric}
              </div>

              {/* Inspect button overlay on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectLobe(lobe);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-x-1 bottom-1 text-[8px] bg-cyan-900/90 text-cyan-200 border border-cyan-500/50 rounded py-0.5"
              >
                Inspect
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
