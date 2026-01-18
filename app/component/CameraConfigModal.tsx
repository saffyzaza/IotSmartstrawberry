"use client";
import React from 'react';

interface CameraConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: { interval: number; serverUrl: string };
  setConfig: (config: { interval: number; serverUrl: string }) => void;
  onSave: () => void;
  isSaving: boolean;
}

const CameraConfigModal: React.FC<CameraConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  setConfig, 
  onSave, 
  isSaving 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <span>⚙️</span> Camera Settings
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Upload Interval (ms)</label>
            <input 
              type="number" 
              value={config.interval}
              onChange={(e) => setConfig({ ...config, interval: Number(e.target.value) })}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-800 dark:text-white font-tech-mono focus:ring-2 focus:ring-green-500 outline-none transition-all"
              placeholder="e.g. 10000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">API Server URL</label>
            <input 
              type="text" 
              value={config.serverUrl}
              onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-800 dark:text-white font-tech-mono focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
              placeholder="http://..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onSave}
              disabled={isSaving}
              className="flex-[2] bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Save Config'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraConfigModal;
