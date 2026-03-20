import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function AlarmTable({ alarms, onAcknowledge }) {
  if (!alarms || alarms.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-500 bg-slate-800/50 rounded-lg border border-slate-800">
        No active alarms
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-700 bg-slate-900 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-800">
          <TableRow className="border-slate-700 hover:bg-slate-800/80">
            <TableHead className="w-[120px] text-slate-300">Time</TableHead>
            <TableHead className="w-[100px] text-slate-300">Severity</TableHead>
            <TableHead className="text-slate-300">Message</TableHead>
            <TableHead className="w-[120px] text-slate-300">State</TableHead>
            <TableHead className="text-right w-[100px] text-slate-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alarms.map((alarm) => {
            const isCritical = alarm.severity === 'CRITICAL';
            const isActive = alarm.state === 'ACTIVE';
            
            return (
              <TableRow 
                key={alarm.id} 
                className={`border-slate-800 transition-colors ${
                  isActive 
                    ? isCritical 
                      ? 'bg-red-500/10 hover:bg-red-500/20' 
                      : 'bg-yellow-500/10 hover:bg-yellow-500/20'
                    : 'bg-transparent hover:bg-slate-800'
                }`}
              >
                <TableCell className="font-mono text-xs text-slate-400 py-3">{alarm.timestamp}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase ${
                    isCritical ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {alarm.severity}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-slate-200">{alarm.message}</TableCell>
                <TableCell>
                  <span className={`text-xs uppercase tracking-wider ${isActive ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                    {alarm.state}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAcknowledge(alarm.id)}
                      className="h-7 text-xs bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      ACK
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
