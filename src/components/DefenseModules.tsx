import React from 'react';
import { DefenseModule } from '../types';
import { playClickBeep } from '../utils/audio';

interface DefenseModulesProps {
  modules: DefenseModule[];
  onOpenModule: (module: DefenseModule) => void;
}

export default function DefenseModules({ modules, onOpenModule }: DefenseModulesProps) {
  return (
    <div className="bg-slate-900 border-glow rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          5 Enterprise Autonomous Defense & Governance Modules
        </h2>
        <span className="text-[10px] text-slate-400 font-mono">
          STATUTORY COMPLIANCE // UCC ART. 12 & ZERO-CLOUD-RENT
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="p-3 bg-slate-950 rounded border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition group"
          >
            <div>
              <h3 className="font-bold text-cyan-300 mb-1 group-hover:text-cyan-200">
                {mod.title}
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                {mod.description}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[9px] text-green-400 font-bold tracking-wider">
                {mod.status}
              </span>
              <button
                onClick={() => {
                  playClickBeep(1300);
                  onOpenModule(mod);
                }}
                className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 hover:text-cyan-200 rounded text-[9px] font-semibold border border-cyan-500/30 transition cursor-pointer"
              >
                {mod.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
