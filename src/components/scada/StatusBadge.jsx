import React from 'react';
import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status }) {
  let colorClass = 'bg-slate-500';
  let dotClass = 'bg-slate-300';

  if (status === 'GOOD' || status === 'OK' || status === 'RUN' || status === 'OPEN') {
    colorClass = 'bg-emerald-500 text-emerald-950 hover:bg-emerald-600';
    dotClass = 'bg-emerald-200';
  } else if (status === 'WARNING' || status === 'ACKNOWLEDGED') {
    colorClass = 'bg-yellow-500 text-yellow-950 hover:bg-yellow-600';
    dotClass = 'bg-yellow-200';
  } else if (status === 'CRITICAL' || status === 'ACTIVE') {
    colorClass = 'bg-red-500 text-red-950 hover:bg-red-600 animate-pulse';
    dotClass = 'bg-red-200';
  } else if (status === 'MANUAL') {
    colorClass = 'bg-blue-500 text-blue-950 hover:bg-blue-600';
    dotClass = 'bg-blue-200';
  }

  return (
    <Badge className={`px-2 py-0.5 font-mono text-xs flex items-center gap-1.5 uppercase ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </Badge>
  );
}
