"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [theme, setTheme] = useState('light'); // Default light based on your css :root
  const [loading, setLoading] = useState(true);

  // Theme Handling
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Stream Fetch
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch('/api/Stream');
        const json = await res.json();
        if (json.image) setImgSrc(json.image);
      } catch (e) { console.error("Stream error"); }
    };
    fetchImage();
    const interval = setInterval(fetchImage, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sensor Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor");
        const json = await res.json();
        setData(json);
      } catch (e) { console.log("Sensor error"); }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="text-7xl animate-bounce mb-6 filter drop-shadow-xl">🍓</div>
        <h2 className="text-2xl font-black text-red-500 animate-pulse">Strawberry IoT System</h2>
        <p className="text-sm opacity-60 mt-2">กำลังเชื่อมต่อฐานข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center text-white text-3xl shadow-lg border-4 border-white/20 animate-[spin_10s_linear_infinite]">
              🍓
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-600">
                STRAWBERRY FARM
              </h1>
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Smart Monitoring System</p>
            </div>
          </div>

          <button 
            onClick={toggleTheme} 
            className="px-5 py-2.5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Camera Section (Left Side - Spans 2 Columns) */}
          <div className="lg:col-span-2 dashboard-card rounded-3xl overflow-hidden shadow-2xl relative group">
            {/* Live Badge */}
            <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              LIVE
            </div>

            {imgSrc ? (
              <img 
                src={imgSrc} 
                alt="Stream" 
                className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="aspect-video bg-slate-900 flex items-center justify-center text-slate-500">
                <span className="text-4xl mb-2 animate-pulse">📷</span>
              </div>
            )}
            
            <div className="p-4 bg-[var(--card-bg)]/50 backdrop-blur border-t border-[var(--card-border)] flex justify-between items-center">
              <span className="font-bold text-sm opacity-80">Zone A: Main Greenhouse</span>
              <span className="text-xs font-mono opacity-50">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Sensor Grid (Right Side - Spans 2 Columns, Internal Grid 2 Cols) */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <Card
              title="CO2"
              value={data.co2}
              unit="ppm"
              icon="💨"
              color="text-emerald-500"
              desc="Air Quality"
            />
            <Card
              title="Temp"
              value={data.temp}
              unit="°C"
              icon="🌡️"
              color="text-orange-500"
              desc="Temperature"
            />
            <Card
              title="Humidity"
              value={data.hum}
              unit="%"
              icon="💧"
              color="text-blue-500"
              desc="Moisture"
            />
            <Card
              title="Light"
              value={data.light}
              unit="%"
              icon={data.light > 50 ? "☀️" : "🌑"}
              color="text-yellow-500"
              desc="Intensity"
            />
            <Card
              title="pH"
              value={data.ph}
              unit="pH"
              icon="🧪"
              color="text-purple-500"
              desc="Acidity"
            />
            <Card
              title="EC"
              value={data.ec}
              unit="ms/cm"
              icon="⚡"
              color="text-amber-500"
              desc="Conductivity"
            />
          </div>

        </div>
      </div>
      
      {/* CSS Styles based on your request */}
      <style jsx global>{`
        @import "tailwindcss";
        @import "tailwindcss/preflight";
        @import "tailwindcss/utilities";

        :root {
          --background: #f8fafc; /* Light Sky Blueish Grey */
          --foreground: #334155;
          --card-bg: rgba(255, 255, 255, 0.7);
          --card-border: #e2e8f0;
        }

        [data-theme='dark'] {
          --background: #0f172a; /* Deep Slate */
          --foreground: #f1f5f9;
          --card-bg: rgba(30, 41, 59, 0.4);
          --card-border: rgba(51, 65, 85, 0.5);
        }

        body {
          background: var(--background);
          color: var(--foreground);
          transition: all 0.3s ease;
        }

        /* Custom Card Style for Theme */
        .dashboard-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          backdrop-filter: blur(12px); /* Increased blur for glass effect */
          -webkit-backdrop-filter: blur(12px);
        }
        
        /* Additions for "Nature" feel animations */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        .hover\:float:hover {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function Card({ title, value, unit, icon, color, desc }: any) {
  return (
    <div className="dashboard-card p-5 rounded-3xl relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:float">
      
      {/* Decorative Background Blob */}
      <div className={`absolute -right-6 -top-6 text-9xl opacity-[0.03] ${color.replace('text-', 'bg-')} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
        {icon}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-3xl mb-1 filter drop-shadow-sm">{icon}</span>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] opacity-50">{title}</h3>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
            <span className="text-xs font-bold opacity-60">{unit}</span>
          </div>
          <p className="text-[10px] font-medium opacity-40 mt-1">{desc}</p>
        </div>

        {/* Decorative Progress Bar (Visual only) */}
        <div className="w-full h-1 bg-[var(--foreground)]/10 rounded-full mt-3 overflow-hidden">
          <div className={`h-full ${color.replace('text-', 'bg-')} opacity-60 w-[60%] rounded-full group-hover:w-[80%] transition-all duration-500`}></div>
        </div>
      </div>
    </div>
  );
}