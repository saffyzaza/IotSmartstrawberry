"use client";
import React from 'react';
import VerticalSlider from './VerticalSlider';

interface SensorConfig {
  label: string;
  unit: string;
  min: number;
  max: number;
  colors: string[];
  icon: string;
}

interface SensorGridProps {
  data: Record<string, number>;
  sensorConfig: Record<string, SensorConfig>;
  onUpdate: (key: string, val: number) => void;
}

// --- Helper Functions (Moved from BioDashboard) ---
const lerp = (start: number, end: number, t: number): number => start * (1 - t) + end * t;

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const getColor = (value: number, min: number, max: number, colors: string[]): string => {
  let t = (value - min) / (max - min);
  t = Math.max(0, Math.min(1, t));
  const c1 = hexToRgb(colors[0]);
  const c2 = hexToRgb(colors[1]);
  const r = Math.round(lerp(c1[0], c2[0], t));
  const g = Math.round(lerp(c1[1], c2[1], t));
  const b = Math.round(lerp(c1[2], c2[2], t));
  return `rgb(${r},${g},${b})`;
};

const SensorGrid: React.FC<SensorGridProps> = ({ data, sensorConfig, onUpdate }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-6xl">
      {Object.keys(sensorConfig).map((key) => {
        const config = sensorConfig[key];
        const currentColor = getColor(Number(data[key]), config.min, config.max, config.colors);
        
        return (
          <div 
            key={key} 
            className="hidden md:flex bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-3 md:p-5 flex-col justify-between h-56 md:h-64 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 border border-white/50 dark:border-slate-800 group"
          >
            {/* Top Section */}
            <div className="text-center w-full flex flex-col items-center">
              <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                <span className="text-2xl">{config.icon}</span>
              </div>
              <h3 className="text-[10px] md:text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{config.label}</h3>
              <div 
                className="text-2xl md:text-3xl font-bold font-tech-mono leading-none flex items-baseline gap-1"
                style={{ color: currentColor }}
              >
                {key === 'ph' ? Number(data[key]).toFixed(1) : Math.round(Number(data[key]))}
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-sans">{config.unit}</span>
              </div>
            </div>
            
            {/* Slider */}
            <div className="flex-1 flex items-center justify-center">
              <VerticalSlider 
                value={Number(data[key])} 
                min={config.min} 
                max={config.max} 
                onChange={(val) => onUpdate(key, val)}
                color={currentColor}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SensorGrid;
