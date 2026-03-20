import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { usePlantData } from '../hooks/usePlantData';

export function Trends() {
  const { history } = usePlantData();

  // Map history according to the new `tank100` and `tank200` keys
  const data = history?.tank100?.map((t100, index) => {
    const t200 = history?.tank200?.[index];
    return {
      time: t100.time,
      T100: t100.level,
      T200: t200?.level || 0,
    };
  }) || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-3rem)] flex flex-col text-slate-200">
      <div className="border-b border-[#1e293b] pb-4 mb-2">
        <h2 className="text-xl font-bold tracking-widest text-white uppercase">Tendencias en Vivo</h2>
        <p className="text-sm text-[#8b9bb4] font-mono mt-1">Monitoreo de datos históricos en tiempo real</p>
      </div>

      <div className="flex-1 flex flex-col bg-[#0a0f18] border border-[#1e293b] rounded-xl shadow-2xl">
        <div className="border-b border-[#1e293b] bg-[#0b101e] px-6 py-4 flex items-center">
          <h3 className="text-sm font-mono tracking-widest text-[#8b9bb4] uppercase">Niveles de Tanques (%)</h3>
        </div>
        <div className="flex-1 p-6 min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10} 
                tickMargin={10}
                tickFormatter={(val) => val.substring(0, val.lastIndexOf(':'))}
                fontFamily="monospace"
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#64748b" 
                fontSize={12} 
                tickFormatter={(val) => `${val}%`}
                fontFamily="monospace"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b101e', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px' }}
                itemStyle={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'monospace' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontFamily: 'monospace', fontSize: '12px', color: '#8b9bb4' }} />
              <Line 
                type="monotone" 
                dataKey="T100" 
                name="Tanque Agua Bruta (T-100)" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="T200" 
                name="Tanque Agua Tratada (T-200)" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
