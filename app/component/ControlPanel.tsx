"use client";
import React from 'react';

interface ControlPanelProps {
  relays: {
    relay1: boolean;
    relay2: boolean;
    relay3: boolean;
    relay4: boolean;
  };
  schedules?: Record<string, { days: number[]; duration: number }>;
  onToggle: (id: string, state: boolean) => void;
  onOpenSchedule: (id: string, name: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ relays, schedules, onToggle, onOpenSchedule }) => {
  const controls = [
    { id: 'relay1', label: 'Relay 1', icon: '🔌' },
    { id: 'relay2', label: 'หลอดไฟ', icon: '💡' },
    { id: 'relay3', label: 'ปรับอากาศ', icon: '💨' },
    { id: 'relay4', label: 'ปั้มน้ำ', icon: '🌊' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-white dark:border-slate-800">
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-6 flex items-center gap-2">
        <span>🎮</span> System Control
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {controls.map((control) => {
          const isActive = relays[control.id as keyof typeof relays];
          const sched = schedules?.[control.id];
          const hasSchedule = sched && (sched.duration === -1 || (sched.days && sched.days.length > 0));
          
          return (
            <div key={control.id} className="flex flex-col gap-2">
              <button
                onClick={() => onToggle(control.id, !isActive)}
                className={`w-full relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/20' 
                    : 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 hover:border-green-300'
                }`}
              >
                {/* Animation Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                )}
                
                <span className={`text-3xl mb-2 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'grayscale'}`}>
                  {control.icon}
                </span>
                
                <span className={`text-[10px] uppercase tracking-widest font-bold ${isActive ? 'text-white' : 'text-gray-400 dark:text-slate-500'}`}>
                  {control.label}
                </span>
                
                <div className={`mt-2 px-3 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tighter ${
                  isActive ? 'bg-white text-green-600' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
                }`}>
                  {isActive ? 'ON' : 'OFF'}
                </div>
              </button>

              {/* Schedule Button - Moved to Bottom */}
              <button
                onClick={() => onOpenSchedule(control.id, control.label)}
                className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 text-[10px] font-bold uppercase tracking-wider ${
                  hasSchedule 
                    ? 'bg-blue-500 border-blue-400 text-white shadow-md shadow-blue-500/10' 
                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-400 hover:text-blue-500'
                }`}
                title="ตั้งเวลาทำงาน"
              >
                <span className={hasSchedule ? 'animate-bounce-slow' : ''}>
                  {hasSchedule ? '⏰' : '📅'}
                </span>
                {hasSchedule ? 'มีตารางทำงาน' : 'ตั้งเวลา'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default ControlPanel;
