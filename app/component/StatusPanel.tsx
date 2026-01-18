"use client";
import React from 'react';

interface SensorConfig {
  label: string;
  unit: string;
  min: number;
  max: number;
  colors: string[];
  icon: string;
}

interface StatusPanelProps {
  data: Record<string, number>;
  sensorConfig: Record<string, SensorConfig>;
  lastUpdate: string;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ data, sensorConfig, lastUpdate }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-white dark:border-slate-800 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">System Status</h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {Object.keys(sensorConfig).map((key) => {
            const config = sensorConfig[key];
            return (
              <div key={`summary-${key}`} className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 p-3 px-4 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{config.icon}</span>
                  {config.label}
                </span>
                <span className="font-bold font-tech-mono text-gray-800 dark:text-slate-100">
                  {key === 'ph' ? Number(data[key]).toFixed(1) : Math.round(Number(data[key]))}
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1 font-sans">{config.unit}</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-[10px] text-gray-400 dark:text-slate-500 font-sans uppercase tracking-widest text-center">
          Update: {lastUpdate}
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
