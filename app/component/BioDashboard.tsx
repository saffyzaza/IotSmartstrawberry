"use client";
import React, { useState, useEffect } from 'react';
import CameraConfigModal from './CameraConfigModal';
import CameraSection from './CameraSection';
import StatusPanel from './StatusPanel';
import ControlPanel from './ControlPanel';
import ScheduleModal from './ScheduleModal';
import AutomationModal from './AutomationModal';

// --- 1. Types & Interfaces ---

interface Schedule {
  days: number[];
  startTime: string;
  duration: number;
}

interface AutomationRule {
  threshold: number;
  condition: 'above' | 'below';
  action: 'on' | 'off';
  relay: string;
  enabled: boolean;
}

interface SensorConfig {
  label: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  colors: string[];
  icon: string;
}

interface SensorState {
  [key: string]: number;
}

// --- 2. Configuration ---

const SENSOR_CONFIG: Record<string, SensorConfig> = {
  temp: { label: "Temp", unit: "°C", min: 0, max: 100, default: 25, colors: ["#94a3b8", "#ff6b6b"], icon: "🌡️" },
  hum: { label: "Hum", unit: "%", min: 0, max: 100, default: 60, colors: ["#7dd3fc", "#0284c7"], icon: "💧" },
  ph: { label: "pH", unit: "pH", min: 0, max: 14, default: 7, colors: ["#fca5a5", "#22c55e"], icon: "🧪" },
  ec: { label: "EC", unit: "mS/cm", min: 0, max: 5, default: 1.5, colors: ["#fde047", "#ca8a04"], icon: "🌱" },
  co2: { label: "CO2", unit: "ppm", min: 0, max: 2000, default: 800, colors: ["#d8b4fe", "#9333ea"], icon: "🌬️" },
  light: { label: "Light", unit: "lux", min: 0, max: 10000, default: 5000, colors: ["#fef08a", "#eab308"], icon: "☀️" },
};

// --- 3. Main Dashboard Component ---

const BioDashboard: React.FC = () => {
  const [data, setData] = useState<SensorState>({
    temp: 0, hum: 0, ph: 0, ec: 0, co2: 0, light: 0
  });
  const [relays, setRelays] = useState({
    relay1: false, relay2: false, relay3: false, relay4: false
  });
  const [schedules, setSchedules] = useState<Record<string, Schedule>>({});
  const [automationRules, setAutomationRules] = useState<Record<string, AutomationRule>>({});
  const [streamImage, setStreamImage] = useState<string>('');

  // Modals Local State
  const [selectedRelay, setSelectedRelay] = useState<{ id: string; name: string } | null>(null);
  const [showAutomation, setShowAutomation] = useState(false);

  const [lastUpdate, setLastUpdate] = useState<string>('-');
  const [isDark, setIsDark] = useState(false);

  // Camera Config State
  const [showConfig, setShowConfig] = useState(false);
  const [camConfig, setCamConfig] = useState({ interval: 10000, serverUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Theme Persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await fetch('/api/sensor');
        const json = await res.json();
        if (json.temp !== undefined) {
          const { lastUpdate: updateTime, schedules: s, automationRules: a, relay1, relay2, relay3, relay4, ...sensors } = json;
          setData(prev => ({ ...prev, ...sensors }));
          setRelays({
            relay1: !!relay1,
            relay2: !!relay2,
            relay3: !!relay3,
            relay4: !!relay4
          });
          if (s) setSchedules(s);
          if (a) setAutomationRules(a);
          if (updateTime) setLastUpdate(updateTime);
        }
      } catch (e) { console.error(e); }
    };

    const fetchStream = async () => {
      try {
        const res = await fetch('/api/Stream');
        const json = await res.json();
        if (json.image) setStreamImage(json.image);
      } catch (e) { console.error(e); }
    };

    // Sensor poll every 2-5 seconds (now 3s for balance)
    const sensorInterval = setInterval(fetchSensors, 3000);
    
    // Stream poll every 15 minutes (900,000ms)
    const streamInterval = setInterval(fetchStream, 180000);

    fetchSensors();
    fetchStream();
    
    return () => {
      clearInterval(sensorInterval);
      clearInterval(streamInterval);
    };
  }, []);

  // Fetch Camera Config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const json = await res.json();
        setCamConfig(json);
      } catch (e) { console.error(e); }
    };
    fetchConfig();
  }, []);

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(camConfig)
      });
      setShowConfig(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const updateData = (key: string, val: number) => {
    setData(prev => ({ ...prev, [key]: val }));
  };

  const handleToggleRelay = async (id: string, state: boolean) => {
    setRelays(prev => ({ ...prev, [id]: state }));
    try {
      await fetch('/api/sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [id]: state })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSchedule = async (relayId: string, newSchedule: Schedule) => {
    try {
      setSchedules(prev => ({ ...prev, [relayId]: newSchedule }));
      await fetch('/api/sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedules: {
            ...schedules,
            [relayId]: newSchedule
          }
        })
      });
      setSelectedRelay(null);
    } catch (e) {
      console.error(e);
      alert('Failed to save schedule');
    }
  };

  const handleSaveAutomation = async (newRules: Record<string, AutomationRule>) => {
    try {
      setAutomationRules(newRules);
      await fetch('/api/sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automationRules: newRules })
      });
      setShowAutomation(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save automation rules');
    }
  };

  return (
    <div className="w-full min-h-screen bg-dot-pattern font-fredoka flex flex-col py-10 px-4 transition-colors duration-300">
      
      {/* Header & Theme Toggle */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          Bio-Sync <span className="text-green-500">🌱</span>
        </h1>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAutomation(true)}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 hover:scale-105 transition-all text-xl"
            title="Automation Setup"
          >
            🤖
          </button>

          <button 
            onClick={() => setShowConfig(true)}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 hover:scale-105 transition-all text-xl"
            title="Camera Configuration"
          >
            ⚙️
          </button>

          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 hover:scale-105 transition-all text-xl"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Camera Config Modal */}
      <CameraConfigModal 
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        config={camConfig}
        setConfig={setCamConfig}
        onSave={saveConfig}
        isSaving={isSaving}
      />

      <div className="w-full max-w-6xl mx-auto space-y-10">
        {/* Top Layout: Camera + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <CameraSection streamImage={streamImage} />
          <StatusPanel data={data} sensorConfig={SENSOR_CONFIG} lastUpdate={lastUpdate} />
        </div>

        {/* Control Panel: 4-Channel Relays */}
        <ControlPanel 
          relays={relays} 
          schedules={schedules}
          onToggle={handleToggleRelay} 
          onOpenSchedule={(id, name) => setSelectedRelay({ id, name })}
        />

        {/* Schedule Modal */}
        {selectedRelay && (
          <ScheduleModal
            isOpen={!!selectedRelay}
            onClose={() => setSelectedRelay(null)}
            relayId={selectedRelay.id}
            relayName={selectedRelay.name}
            schedule={schedules[selectedRelay.id] || { days: [], startTime: "08:00", duration: 1 }}
            onSave={handleSaveSchedule}
          />
        )}

        {/* Automation Modal */}
        <AutomationModal
          isOpen={showAutomation}
          onClose={() => setShowAutomation(false)}
          rules={automationRules}
          onSave={handleSaveAutomation}
        />
      </div>

    </div>
  );
};

export default BioDashboard;
