import React from 'react';

export function Tank({ id, level, name, maxVolume }) {
  // Determine color based on level
  let liquidColor = 'bg-[#3b82f6]'; // Default blue
  let glow = 'shadow-[0_0_15px_rgba(59,130,246,0.3)]';
  
  if (level > 90) {
    liquidColor = 'bg-[#ef4444]'; // Red
    glow = 'shadow-[0_0_20px_rgba(239,68,68,0.5)]';
  } else if (level < 10) {
    liquidColor = 'bg-[#eab308]'; // Yellow
    glow = 'shadow-[0_0_15px_rgba(234,179,8,0.3)]';
  }

  const currentVolume = maxVolume ? ((level / 100) * maxVolume).toFixed(1) : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center">
        <span className="text-[#8b9bb4] font-mono text-sm font-bold tracking-widest">T-{id}</span>
        {currentVolume !== null && (
          <span className="text-blue-300 font-mono text-xs font-bold tracking-widest mt-1 bg-[#1e293b]/50 px-2 py-0.5 rounded shadow-sm">
            {currentVolume} m³
          </span>
        )}
      </div>
      
      {/* Tank Container */}
      <div className="relative w-32 h-48 rounded dark:bg-[#0f1523] bg-[#0f1523] border-2 border-[#1e293b] shadow-xl overflow-hidden flex flex-col justify-end p-1">
        {/* Fill */}
        <div 
          className={`w-full rounded-sm transition-all duration-1000 ease-linear ${liquidColor} ${glow}`}
          style={{ height: `${Math.max(2, level)}%` }} // Minimum 2% visibility
        />
        
        {/* Value Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-mono font-bold text-lg tracking-wider drop-shadow-md bg-black/30 px-2 py-1 rounded">
            {level.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <span className="text-slate-500 text-[10px] font-mono max-w-[120px] text-center uppercase leading-tight">
          {name}
        </span>
        {maxVolume && (
          <span className="text-slate-600 text-[9px] font-mono text-center uppercase">
            Capacidad: {maxVolume} m³
          </span>
        )}
      </div>
    </div>
  );
}
