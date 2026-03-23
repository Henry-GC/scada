import React from 'react';
import { usePlantData } from '../hooks/usePlantData';
import { Tank } from '../components/scada/Tank';
import { Pump } from '../components/scada/Pump';
import { Valve } from '../components/scada/Valve';
import { Pipe } from '../components/scada/Pipe';
import { Activity } from 'lucide-react';

export function Overview() {
  const { tanks, pumps, valves, systemHealth, obstructionSensor } = usePlantData();

  const v101 = valves.find(v => v.id === 101);
  const t100 = tanks.find(t => t.id === 100);
  const p101 = pumps.find(p => p.id === 101);
  const p102 = pumps.find(p => p.id === 102); // Backup Pump
  const t200 = tanks.find(t => t.id === 200);
  const v200 = valves.find(v => v.id === 200);

  if (!t200) return <div className="text-white p-8 animate-pulse text-lg">Initializing Synoptic Array...</div>;

  const leftPipesActive = v101?.status === 'OPEN';
  const transferActive = p101?.status === 'RUN' || p102?.status === 'RUN';
  const rightPipesActive = v200?.status === 'OPEN';

  return (
    <div className="flex flex-col h-full bg-[#0d1320] text-slate-200">

      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-8 border-b border-[#1e293b] pb-4">
        <h2 className="text-xl font-bold tracking-widest text-white uppercase">Visión General del Sistema</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-[#0a0f18] border border-[#1e293b] px-4 py-2 rounded-md shadow-sm">
            <span className="text-xs text-[#8b9bb4] font-mono uppercase tracking-wider">Sen. Obstrucción:</span>
            <span className={`text-xs font-bold font-mono tracking-wider ${obstructionSensor > 5 ? 'text-orange-400' : 'text-blue-400'}`}>
              {((obstructionSensor || 0) * 10).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Synoptic Container */}
      <div className="flex-1 bg-[#0a0f18] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col relative w-full overflow-x-auto overflow-y-hidden">
        <div className="border-b border-[#1e293b] bg-[#0b101e] px-6 py-4 flex items-center gap-3 shrink-0">
          <Activity className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-mono tracking-widest text-[#8b9bb4] uppercase">Diagrama Sinóptico</span>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 min-w-[800px]">
          <div className="flex items-center justify-center">

            {/* INLET VALVE */}
            <Valve {...v101} />
            <Pipe active={leftPipesActive} />

            {/* TANK 1 */}
            <Tank {...t100} maxVolume={1800} />
            <Pipe active={transferActive} />

            {/* PARALLEL PUMP SECTION */}
            <div className="relative flex flex-col gap-6 py-6 px-4">
              {/* Top - Main Pump */}
              <div className="flex items-center">
                <Pipe active={p101?.status === 'RUN'} direction="horizontal" />
                <div className="scale-90 mx-[-0.5rem]"><Pump {...p101} /></div>
                <Pipe active={p101?.status === 'RUN'} direction="horizontal" />
              </div>

              {/* Bottom - Backup Pump */}
              <div className="flex items-center">
                <Pipe active={p102?.status === 'RUN'} direction="horizontal" />
                <div className="scale-90 mx-[-0.5rem]"><Pump {...p102} /></div>
                <Pipe active={p102?.status === 'RUN'} direction="horizontal" />
              </div>

              {/* Vertical pipe joints (CSS drawing for visual effect) */}
              <div className={`absolute left-0 top-1/2 -mt-10 h-20 w-2 ${transferActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] opacity-90' : 'bg-slate-600 opacity-50'} rounded-full`} />
              <div className={`absolute right-0 top-1/2 -mt-10 h-20 w-2 ${transferActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] opacity-90' : 'bg-slate-600 opacity-50'} rounded-full`} />
            </div>

            {/* JOINT TO TANK 2 */}
            <Pipe active={transferActive} />
            <Tank {...t200} maxVolume={2500} />

            <Pipe active={rightPipesActive} />

            {/* OUTLET VALVE */}
            <Valve {...v200} />

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-4 bg-[#1e293b]/40 mt-auto border-t border-[#1e293b] relative shrink-0">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full w-1/3 bg-blue-500 rounded-full opacity-50 ${transferActive ? 'animate-pulse' : 'hidden'}`} />
          </div>
        </div>

      </div>
    </div>
  );
}
