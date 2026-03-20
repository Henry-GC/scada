import React from 'react';
import { Settings, AlertTriangle, Wrench } from 'lucide-react';

export function Pump({ id, status, name, fault, maintenance, onToggle }) {
  const isRunning = status === 'RUN';
  
  let color = isRunning ? 'text-[#10b981]' : 'text-[#64748b]';
  let borderColor = isRunning ? 'border-[#10b981]/50' : 'border-[#1e293b]';
  let bgColor = isRunning ? 'bg-[#10b981]/10' : 'bg-[#0f1523]';
  let badgeColor = isRunning ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#1e293b] text-[#64748b]';
  let icon = <Settings className={`w-8 h-8 ${color} ${isRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />;
  let borderStyle = 'border-solid';
  let containerBorderColor = 'border-[#1e293b]';

  if (fault) {
    color = 'text-[#ef4444]';
    borderColor = 'border-[#ef4444]';
    bgColor = 'bg-[#ef4444]/20 animate-pulse';
    badgeColor = 'bg-[#ef4444] text-white';
    status = 'FAULT';
    icon = <AlertTriangle className={`w-8 h-8 ${color}`} />;
    containerBorderColor = 'border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]';
  } else if (maintenance) {
    color = 'text-[#f97316]';
    borderColor = 'border-[#f97316]/80';
    borderStyle = 'border-dashed border-2';
    bgColor = 'bg-[#f97316]/10';
    badgeColor = 'bg-[#f97316] text-[#ffedd5]';
    status = 'MAINT';
    icon = <Wrench className={`w-8 h-8 ${color}`} />;
    containerBorderColor = 'border-[#f97316]/50 border-dashed';
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex justify-between w-full px-2 items-center">
        <span className="text-[#8b9bb4] font-mono text-sm font-bold tracking-widest leading-none">P-{id}</span>
      </div>
      
      <div 
        onClick={() => onToggle && onToggle(id)}
        className={`w-32 h-36 rounded border ${containerBorderColor} ${borderStyle} flex flex-col items-center justify-center gap-4 shadow-xl ${
          onToggle ? 'cursor-pointer hover:border-[#3b82f6]/50 transition-colors' : ''
        } bg-[#0b101e]`}
      >
        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${borderColor} ${bgColor}`}>
          {icon}
        </div>

        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest ${badgeColor}`}>
          {status}
        </div>
      </div>
      
      <span className="text-slate-500 text-[10px] font-mono max-w-[100px] text-center uppercase leading-tight">
        {name}
      </span>
    </div>
  );
}
