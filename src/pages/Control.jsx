import React from 'react';
import { usePlantData } from '../hooks/usePlantData';
import { Pump } from '../components/scada/Pump';
import { Valve } from '../components/scada/Valve';
import { Separator } from '@/components/ui/separator';

export function Control() {
  const { pumps, valves, togglePump, toggleValve, toggleMaintenance } = usePlantData();

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-slate-200 h-full flex flex-col">
      <div className="border-b border-[#1e293b] pb-2 mb-4 shrink-0">
        <h2 className="text-xl font-bold tracking-widest text-white uppercase">Control Manual</h2>
        <p className="text-sm text-[#8b9bb4] font-mono mt-1">Interacción manual (Requiere MODO MANUAL en campo o forzado)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Pumps Section */}
        <div className="bg-[#0a0f18] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-[#0b101e] border-b border-[#1e293b] px-4 py-3 flex justify-between items-center shrink-0">
            <h3 className="text-sm font-mono tracking-widest text-[#8b9bb4] uppercase">Control de Bombas</h3>
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">{pumps.length} UNITS</span>
          </div>

          <div className="p-4 flex flex-col items-center gap-4 flex-1 justify-center">
            <div className="flex justify-center gap-6 flex-wrap mb-2">
              {pumps.map(pump => (
                <div key={pump.id} className="flex flex-col gap-4 bg-[#0d1320] p-4 rounded-xl border border-[#1e293b] relative min-w-[170px] pt-10">
                  {pump.id === 101 && (
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Mantenimiento</span>
                      <button
                        onClick={() => toggleMaintenance(101)}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${pump.maintenance ? 'bg-orange-500' : 'bg-slate-700'}`}
                        title="Toggle Mantenimiento"
                      >
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${pump.maintenance ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  )}
                  <Pump
                    {...pump}
                  />
                </div>
              ))}
            </div>

            {/* Main Pump Controls */}
            <div className="flex justify-center gap-4 w-full pt-4">
              <button
                onClick={() => togglePump('START')}
                className={`flex justify-center items-center py-2 px-6 rounded border transition-all bg-[#1e293b] border-slate-700 hover:bg-[#10b981]/20 text-slate-400 hover:text-[#10b981] w-40`}
                title="Marcha"
              >
                <span className="text-xs font-bold tracking-widest uppercase">Marcha</span>
              </button>
              <button
                onClick={() => togglePump('STOP')}
                className={`flex justify-center items-center py-2 px-6 rounded border transition-all bg-[#1e293b] border-slate-700 hover:bg-[#ef4444]/20 text-slate-400 hover:text-[#ef4444] w-40`}
                title="Paro"
              >
                <span className="text-xs font-bold tracking-widest uppercase">Paro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Valves Section */}
        <div className="bg-[#0a0f18] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-[#0b101e] border-b border-[#1e293b] px-4 py-3 flex justify-between items-center shrink-0">
            <h3 className="text-sm font-mono tracking-widest text-[#8b9bb4] uppercase">Control de Válvulas</h3>
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">{valves.length} UNITS</span>
          </div>
          <div className="p-4 flex justify-center gap-6 flex-wrap flex-1 items-center">
            {valves.map(valve => (
              <div key={valve.id} className="flex flex-col gap-4 bg-[#0d1320] p-4 rounded-xl border border-[#1e293b]">
                <Valve
                  {...valve}
                />

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => toggleValve(valve.id, 'OPEN')}
                    className={`flex justify-center items-center py-1.5 px-3 rounded border transition-all bg-[#1e293b] border-slate-700 hover:bg-[#3b82f6]/20 text-slate-400 hover:text-[#3b82f6]`}
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase">Abrir</span>
                  </button>
                  <button
                    onClick={() => toggleValve(valve.id, 'CLOSED')}
                    className={`flex justify-center items-center py-1.5 px-3 rounded border transition-all bg-[#1e293b] border-slate-700 hover:bg-[#ef4444]/20 text-slate-400 hover:text-[#ef4444]`}
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase">Cerrar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
