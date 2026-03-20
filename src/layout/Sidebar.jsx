import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, SlidersHorizontal, AlertTriangle, LineChart, Activity } from 'lucide-react';
import { usePlantData } from '../hooks/usePlantData';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/control', label: 'Control Manual', icon: SlidersHorizontal },
  { path: '/alarms', label: 'Alarmas', icon: AlertTriangle },
  { path: '/trends', label: 'Tendencias', icon: LineChart },
];

export function Sidebar() {
  const { systemHealth, alarms } = usePlantData();
  const activeAlarmsCount = alarms.filter(a => a.state === 'ACTIVE').length;

  return (
    <div className="w-64 bg-[#0a0f18] border-r border-[#1e293b] flex flex-col h-full text-slate-300 shadow-2xl z-10">
      {/* Header */}
      <div className="h-28 flex flex-col justify-center px-6 border-b border-[#1e293b] relative">
        <Activity className="h-6 w-6 text-blue-500 absolute left-6 top-8" />
        <div className="pl-10">
          <h1 className="text-base font-bold text-white tracking-widest leading-tight uppercase">Sistema SCADA</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Planta de Tratamiento<br/>de Agua</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#121c2c] text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  : 'text-slate-400 hover:bg-[#121c2c]/50 hover:text-slate-200 border border-transparent'
              }`
            }
          >
            <item.icon className={`mr-4 h-5 w-5 ${item.path === '/' ? 'text-blue-500' : ''}`} />
            <span className="font-mono tracking-wide">{item.label}</span>
            {item.path === '/alarms' && activeAlarmsCount > 0 && (
              <span className="ml-auto bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/50 animate-pulse">
                {activeAlarmsCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-[#1e293b] bg-[#080d14]">
        <div className="flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-emerald-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              SYS.ONLN
            </span>
            <span className="text-slate-500">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div className="flex items-center justify-between text-[#8b9bb4]">
            <span>HEALTH:</span>
            <span className={systemHealth === 'GOOD' ? 'text-emerald-500' : systemHealth === 'WARNING' ? 'text-yellow-500' : 'text-red-500'}>
              {systemHealth}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
