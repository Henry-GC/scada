import React from 'react';

export function Valve({ id, status, name, onToggle }) {
  const isOpen = status === 'OPEN';
  const color = isOpen ? 'text-[#3b82f6]' : 'text-[#64748b]';
  const borderColor = isOpen ? 'border-[#3b82f6]/50' : 'border-[#1e293b]';
  const bgColor = isOpen ? 'bg-[#3b82f6]/10' : 'bg-[#0f1523]';
  const badgeColor = isOpen ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'bg-[#1e293b] text-[#64748b]';

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[#8b9bb4] font-mono text-sm font-bold tracking-widest">V-{id}</span>
      
      <div 
        onClick={() => onToggle && onToggle(id)}
        className={`w-28 h-28 rounded border border-[#1e293b] flex flex-col items-center justify-center gap-3 shadow-xl ${
          onToggle ? 'cursor-pointer hover:border-[#10b981]/50 transition-colors' : ''
        } bg-[#0b101e]`}
      >
        {/* Custom Valve Icon SVG */}
        <div className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${borderColor} ${bgColor}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={color}>
            <polygon points="4 4 20 20 20 4 4 20 4 4" />
            <line x1="12" y1="12" x2="12" y2="2" className={isOpen ? 'opacity-100' : 'opacity-0'} />
            <line x1="12" y1="12" x2="12" y2="22" className={isOpen ? 'opacity-100' : 'opacity-30'} />
            <path d="M9 2 h6" className={isOpen ? 'opacity-100' : 'opacity-0'} />
          </svg>
        </div>

        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest ${badgeColor}`}>
          {status}
        </div>
      </div>
      
      <span className="text-slate-500 text-[10px] font-mono max-w-[90px] text-center uppercase leading-tight">
        {name}
      </span>
    </div>
  );
}
