import React from 'react';
import { usePlantData } from '../hooks/usePlantData';
import { AlarmTable } from '../components/scada/AlarmTable';

export function Alarms() {
  const { alarms, acknowledgeAlarm } = usePlantData();

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-3rem)] flex flex-col text-slate-200">
      <div className="border-b border-[#1e293b] pb-4 mb-2">
        <h2 className="text-xl font-bold tracking-widest text-white uppercase">Registro de Alarmas</h2>
        <p className="text-sm text-[#8b9bb4] font-mono mt-1">Eventos del sistema y advertencias de operativas</p>
      </div>

      <div className="flex-1 overflow-auto bg-[#0a0f18] border border-[#1e293b] rounded-xl shadow-2xl">
        <AlarmTable alarms={alarms} onAcknowledge={acknowledgeAlarm} />
      </div>
    </div>
  );
}
