"use client";
import React from 'react';

interface CameraSectionProps {
  streamImage: string;
}

const CameraSection: React.FC<CameraSectionProps> = ({ streamImage }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 md:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden border border-white dark:border-slate-800 h-full flex flex-col">
        <div className="relative flex-1 bg-gray-950 rounded-2xl flex items-center justify-center text-white overflow-hidden min-h-[250px] md:min-h-[350px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)] z-10 pointer-events-none"></div>
          
          {streamImage ? (
            <img src={streamImage} alt="Stream" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-4 relative z-0">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-t-2 border-blue-400 rounded-full animate-spin"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs md:text-sm font-medium tracking-wider text-white/70 uppercase">Establishing Link</p>
                <p className="text-[8px] md:text-[10px] font-sans text-white/30 uppercase tracking-[0.3em] animate-pulse">Awaiting ESP32-CAM Data</p>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Live</span>
            </div>
            <div className="hidden md:flex bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">CH-01</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-[10px] font-mono text-white/70">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraSection;
