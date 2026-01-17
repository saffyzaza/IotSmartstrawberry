"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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
      } catch (e) { console.log("Sensor error"); }
    };
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-cyan-400">Loading...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[var(--background)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-cyan-500">SMART FARM</h1>
          <button onClick={toggleTheme} className="p-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm shadow-md">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 dashboard-card rounded-3xl overflow-hidden shadow-2xl">
            {imgSrc ? <img src={imgSrc} className="w-full aspect-video object-cover" /> : <div className="aspect-video flex items-center justify-center">No Stream</div>}
            <div className="p-3 bg-slate-800 text-cyan-400 text-xs text-center font-bold">LIVE CAMERA</div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <Card title="CO2" value={data.co2} unit="ppm" color="text-emerald-500" />
            <Card title="Temp" value={data.temp} unit="°C" color="text-orange-500" />
            <Card title="Hum" value={data.hum} unit="%" color="text-blue-500" />
            <Card title="pH" value={data.ph} unit="pH" color="text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, unit, color }: any) {
  return (
    <div className="dashboard-card p-5 rounded-3xl">
      <p className="text-[10px] font-bold text-slate-400 uppercase">{title}</p>
      <p className={`text-2xl font-black ${color}`}>{value} <span className="text-xs text-slate-400 font-normal">{unit}</span></p>
    </div>
  );
}