import React from 'react';
import { usePlantData } from '../hooks/usePlantData';
import { Pump } from '../components/scada/Pump';
import { Valve } from '../components/scada/Valve';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Wrench } from 'lucide-react';

export function Control() {
  const { pumps, valves, togglePump, toggleValve, changePumpMode, simulateFault, toggleMaintenance } = usePlantData();

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-200">
      <div className="border-b border-[#1e293b] pb-4 mb-8">
        <h2 className="text-xl font-bold tracking-widest text-white uppercase">Control & Pruebas de Failover</h2>
        <p className="text-sm text-[#8b9bb4] font-mono mt-1">Interacción manual y simulación de fallos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pumps Section */}
        <div className="bg-[#0a0f18] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-[#0b101e] border-b border-[#1e293b] px-6 py-4 flex justify-between items-center">
            <h3 className="text-sm font-mono tracking-widest text-[#8b9bb4] uppercase">Control de Bombas</h3>
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">{pumps.length} UNITS</span>
          </div>
          
          <div className="p-8 flex justify-center gap-12 flex-wrap">
            {pumps.map(pump => (
              <div key={pump.id} className="flex flex-col gap-4 bg-[#0d1320] p-4 rounded-xl border border-[#1e293b]">
                <Pump 
                  {...pump} 
                  onToggle={togglePump} 
                />
                
                {/* Individual Control Panel */}
                <div className="flex flex-col gap-2 mt-2">
                  <button 
                    onClick={() => changePumpMode(pump.id, pump.mode === 'AUTO' ? 'MANUAL' : 'AUTO')}
                    className={`px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded border transition-colors ${
                      pump.mode === 'AUTO' ? 'bg-[#1e293b] border-[#334155] text-slate-400 hover:bg-[#334155]' : 'bg-[#3b82f6]/20 border-[#3b82f6]/50 text-[#3b82f6] hover:bg-[#3b82f6]/30'
                    }`}
                  >
                     Modo {pump.mode} &rarr; {pump.mode === 'AUTO' ? 'MÁQUINA' : 'AUTO'}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button 
                      onClick={() => simulateFault(pump.id)}
                      className={`flex justify-center items-center py-1.5 rounded border transition-all ${
                        pump.fault ? 'bg-[#ef4444] text-white border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-[#1e293b] border-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400'
                      }`}
                      title="Simular Falla"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleMaintenance(pump.id)}
                      className={`flex justify-center items-center py-1.5 rounded border transition-all ${
                        pump.maintenance ? 'bg-[#f97316] text-[#ffedd5] border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-[#1e293b] border-slate-700 hover:bg-orange-500/20 text-slate-400 hover:text-orange-400'
                      }`}
                      title="Mantenimiento"
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Valves Section */}
        <div className="bg-[#0a0f18] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-[#0b101e] border-b border-[#1e293b] px-6 py-4 flex justify-between items-center">
            <h3 className="text-sm font-mono tracking-widest text-[#8b9bb4] uppercase">Control de Válvulas</h3>
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">{valves.length} UNITS</span>
          </div>
          <div className="p-8 flex justify-center gap-8 flex-wrap">
            {valves.map(valve => (
              <Valve 
                key={valve.id} 
                {...valve} 
                onToggle={toggleValve} 
              />
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-[#1e293b] my-8" />

      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6 font-mono text-xs text-slate-400 leading-relaxed shadow-lg flex flex-col gap-2">
        <strong className="text-white text-sm block mb-1 uppercase tracking-widest border-b border-[#1e293b] pb-2">Guía de Pruebas de Failover:</strong>
        <p>1. Asegurate de que P-101 y P-102 estén en <strong>AUTO</strong>.</p>
        <p>2. El sistema encenderá P-101 (Bomba Principal) automáticamente si el Tanque 1 tiene agua (y el tanque 2 no esta lleno).</p>
        <p>3. Presiona el botón de <strong>Falla (Triángulo)</strong> o <strong>Mantenimiento (Llave)</strong> en P-101.</p>
        <p>4. Observa cómo <strong>P-102 (Bomba Respaldo) se enciende automáticamente</strong> para mantener el flujo de agua.</p>
      </div>
    </div>
  );
}
