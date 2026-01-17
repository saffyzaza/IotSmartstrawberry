"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [theme, setTheme] = useState("dark"); // Default เป็น dark

  // --- ระบบจัดการ Theme ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // --- Fetch กล้อง ---
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("/api/Stream");
        const json = await res.json();
        if (json.image) setImgSrc(json.image);
      } catch (e) {
        console.log("Stream offline");
      }
    };
    const interval = setInterval(fetchImage, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Fetch Sensor ---
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
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <div className="animate-bounce text-cyan-500 font-bold">
          📡 Connecting...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              SMART FARM
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Monitoring Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* ปุ่มเปลี่ยนธีม */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-800/10 border border-slate-500/20 hover:scale-110 transition-all shadow-sm"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-slate-400 block uppercase">
                Last Sync
              </span>
              <span className="text-sm font-mono text-cyan-500">
                {data.lastUpdate}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Camera Stream Section (ซ้าย/บน) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="dashboard-card rounded-3xl overflow-hidden shadow-2xl relative border-2 border-cyan-500/20">
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-lg">
                LIVE
              </div>
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="Stream"
                  className="w-full aspect-video object-cover bg-black"
                />
              ) : (
                <div className="w-full aspect-video bg-slate-800 flex items-center justify-center text-slate-500 text-sm italic">
                  Waiting for stream...
                </div>
              )}
              <div className="p-3 bg-slate-900/80 text-center text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
                ESP32-CAM FEED
              </div>
            </div>
          </div>

          {/* Sensors Grid Section (ขวา/ล่าง) */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <Card
              title="CO2"
              value={data.co2}
              unit="ppm"
              icon="💨"
              color="text-emerald-500"
            />
            <Card
              title="Temp"
              value={data.temp}
              unit="°C"
              icon="🌡️"
              color="text-orange-500"
            />
            <Card
              title="Humidity"
              value={data.hum}
              unit="%"
              icon="💧"
              color="text-blue-500"
            />
            <Card
              title="Light"
              value={data.light}
              unit="%"
              icon={data.light > 50 ? "☀️" : "🌑"}
              color="text-yellow-500"
            />
            <Card
              title="pH"
              value={data.ph}
              unit="pH"
              icon="🧪"
              color="text-purple-500"
            />
            <Card
              title="EC"
              value={data.ec}
              unit="ms/cm"
              icon="⚡"
              color="text-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, unit, color, icon }: any) {
  const displayValue = typeof value === "number" ? value.toFixed(1) : value;
  return (
    <div className="dashboard-card p-5 rounded-3xl transition-transform hover:-translate-y-1 hover:shadow-xl">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl md:text-3xl font-black ${color}`}>
          {displayValue}
        </span>
        <span className="text-[10px] text-slate-400 font-bold">{unit}</span>
      </div>
    </div>
  );
}
