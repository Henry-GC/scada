import React from 'react';

export function Pipe({ active, direction = 'horizontal' }) {
  const isHorizontal = direction === 'horizontal';
  
  // Style configurations
  const baseColor = active ? 'bg-blue-500' : 'bg-slate-600';
  const glow = active ? 'shadow-[0_0_8px_rgba(59,130,246,0.6)]' : '';
  const animate = active ? 'opacity-90' : 'opacity-50';

  return (
    <div className={`flex items-center justify-center ${isHorizontal ? 'w-16 h-12' : 'h-16 w-12'}`}>
      <div 
        className={`${baseColor} ${glow} ${animate} transition-all duration-300 ${
          isHorizontal ? 'w-full h-2 rounded' : 'h-full w-2 rounded'
        }`} 
      />
    </div>
  );
}
