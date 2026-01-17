"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
  const fetchImage = async () => {
    const res = await fetch('/api/Stream');
    const json = await res.json();
    if (json.image) setImgSrc(json.image);
  };
  const interval = setInterval(fetchImage, 5000);
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400 font-medium">
          Connecting to Sensors...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - ปรับให้ Responsive */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Sensor Dashboard
            </h1>
            <p className="text-slate-500 text-xs md:text-sm">
              Real-time Environmental Monitoring
            </p>
          </div>
          <div className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-[10px] uppercase text-slate-500 block leading-none mb-1">
              Last Update
            </span>
            <span className="text-xs md:text-sm font-mono text-cyan-400">
              {data.lastUpdate || "Waiting..."}
            </span>
          </div>
        </header>

        {/* Grid - มือถือแสดง 2 คอลัมน์, คอมแสดง 3 คอลัมน์ */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          <Card
            title="CO2 Level"
            value={data.co2}
            unit="ppm"
            icon="💨"
            color={data.co2 > 2000 ? "text-red-400" : "text-green-400"}
          />

          <Card
            title="Temp"
            value={data.temp}
            unit="°C"
            icon="🌡️"
            color="text-orange-400"
          />

          <Card
            title="Humidity"
            value={data.hum}
            unit="%"
            icon="💧"
            color="text-blue-400"
          />

          <Card
            title="Distance"
            value={data.distance}
            unit="cm"
            icon="📏"
            color="text-cyan-400"
          />

          <Card
            title="pH Level"
            value={data.ph}
            unit="pH"
            icon="🧪"
            color="text-purple-400"
          />

          <Card
            title="EC Value"
            value={data.ec}
            unit="ms/cm"
            icon="⚡"
            color="text-yellow-400"
          />

          <Card
            title="Light Intensity"
            value={data.light}
            unit="%"
            icon={data.light > 50 ? "☀️" : "🌑"}
            color="text-yellow-300"
          />

          {imgSrc && (
  <div className="mt-6 border-2 border-slate-700 rounded-xl overflow-hidden shadow-2xl">
    <img src={imgSrc} alt="ESP32-CAM Stream" className="w-full h-auto" />
    <div className="bg-slate-800 p-2 text-center text-xs text-cyan-400">LIVE FEED</div>
  </div>
)}
        </div>
        
      </div>
    </div>
  );
}

function Card({ title, value, unit, color, icon }: any) {
  // ฟังก์ชันช่วยจัดการตัวเลขให้สวยงาม
  const displayValue = typeof value === "number" ? value.toFixed(1) : value;

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg backdrop-blur-sm transition-all hover:border-slate-500">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <span className="text-slate-500 font-bold uppercase tracking-tighter text-[10px] md:text-xs">
          {title}
        </span>
        <span className="text-lg md:text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl md:text-4xl font-black font-mono ${color}`}>
          {displayValue}
        </span>
        <span className="text-[10px] md:text-sm text-slate-500 font-medium">
          {unit}
        </span>
      </div>
    </div>
  );
}
