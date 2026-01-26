"use client";
import React, { useState, useEffect } from 'react';

interface AutomationRule {
  threshold: number;
  condition: 'above' | 'below';
  action: 'on' | 'off';
  relay: string;
  enabled: boolean;
}

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: Record<string, AutomationRule>;
  onSave: (newRules: Record<string, AutomationRule>) => void;
}

const SENSOR_LABELS: Record<string, { label: string; icon: string; unit: string }> = {
  temp: { label: "อุณหภูมิ", icon: "🌡️", unit: "°C" },
  hum: { label: "ความชื้น", icon: "💧", unit: "%" },
  co2: { label: "CO2", icon: "🌬️", unit: "ppm" },
  light: { label: "แสง", icon: "☀️", unit: "lux" },
  distance: { label: "ระดับน้ำ", icon: "📏", unit: "cm" },
  ph: { label: "ค่า pH", icon: "🧪", unit: "pH" },
  ec: { label: "ค่า EC", icon: "🌱", unit: "mS" },
};

const RELAYS = [
  { id: 'none', label: 'ไม่เลือก' },
  { id: 'relay1', label: 'Relay 1' },
  { id: 'relay2', label: 'Relay 2 (หลอดไฟ)' },
  { id: 'relay3', label: 'Relay 3 (ปรับอากาศ)' },
  { id: 'relay4', label: 'Relay 4 (ปั้มน้ำ)' },
];

const AutomationModal: React.FC<AutomationModalProps> = ({ isOpen, onClose, rules, onSave }) => {
  const [localRules, setLocalRules] = useState<Record<string, AutomationRule>>(rules);

  useEffect(() => {
    if (rules) setLocalRules(rules);
  }, [rules]);

  if (!isOpen) return null;

  const updateRule = (key: string, field: keyof AutomationRule, value: any) => {
    setLocalRules(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl my-8 rounded-3xl shadow-2xl border border-white dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">ตั้งค่าระบบอัตโนมัติ (Automation)</h3>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-slate-400">กำหนดเงื่อนไขการทำงานของ Relay ตามค่าเซนเซอร์</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xl">✕</button>
        </div>

        <div className="p-4 md:p-6 space-y-3 md:space-y-4 max-h-[60vh] md:max-h-[65vh] overflow-y-auto">
          {Object.keys(SENSOR_LABELS).map((key) => {
            const rule = localRules[key] || { threshold: 0, relay: 'none', enabled: false, condition: 'above', action: 'off' };
            const config = SENSOR_LABELS[key];
            
            return (
              <div key={key} className={`p-3 md:p-4 rounded-2xl border-2 transition-all ${rule.enabled ? 'border-orange-500/40 bg-orange-50/20 shadow-sm' : 'border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 grayscale-[0.5] opacity-80'}`}>
                <div className="flex flex-col gap-3">
                  {/* Top Row: Info + Toggle */}
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2 md:border-none md:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl md:text-2xl">{config.icon}</span>
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-200">{config.label}</span>
                    </div>
                    <button
                      onClick={() => updateRule(key, 'enabled', !rule.enabled)}
                      className={`w-12 h-6 md:w-14 md:h-7 rounded-full transition-all relative shrink-0 ${rule.enabled ? 'bg-orange-500 shadow-lg shadow-orange-500/20' : 'bg-gray-300 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full transition-transform ${rule.enabled ? 'translate-x-6 md:translate-x-7' : ''}`}></div>
                    </button>
                  </div>

                  {/* Middle Row: Condition + Threshold */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
                    <div className="col-span-1 md:col-span-1">
                      <select
                        value={rule.condition}
                        onChange={(e) => updateRule(key, 'condition', e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="above">มากกว่า</option>
                        <option value="below">น้อยกว่า</option>
                      </select>
                    </div>
                    
                    <div className="col-span-1 md:col-span-1 relative">
                      <input
                        type="number"
                        value={rule.threshold}
                        onChange={(e) => updateRule(key, 'threshold', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 pr-8 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-xs outline-none text-center"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{config.unit}</span>
                    </div>

                    <div className="col-span-2 md:col-span-2 flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase hidden md:inline">สั่ง</span>
                        <select
                          value={rule.action}
                          onChange={(e) => updateRule(key, 'action', e.target.value)}
                          className={`flex-1 p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none ${rule.action === 'on' ? 'text-green-500' : 'text-red-500'}`}
                        >
                          <option value="off">🔴 ปิด</option>
                          <option value="on">🟢 เปิด</option>
                        </select>
                      </div>

                      <select
                        value={rule.relay}
                        onChange={(e) => updateRule(key, 'relay', e.target.value)}
                        className="flex-[1.5] p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-xs outline-none"
                      >
                        {RELAYS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-800/30 flex flex-col md:flex-row gap-2 md:gap-3">
          <button
            onClick={onClose}
            className="md:flex-1 py-3 md:py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors order-2 md:order-1"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onSave(localRules)}
            className="md:flex-1 py-3 md:py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold text-white shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 order-1 md:order-2"
          >
            <span>💾</span> บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationModal;
