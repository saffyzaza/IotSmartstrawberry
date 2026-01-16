'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/sensor');
      const json = await res.json();
      setData(json);
    };
    const interval = setInterval(fetchData, 2000); // Refresh ทุก 2 วินาที
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Smart Sensor Monitoring
          </h1>
          <span className="text-sm bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            Last Update: {data.lastUpdate}
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: CO2 */}
          <Card title="CO2 Level" value={data.co2} unit="ppm" 
                color={data.co2 > 2000 ? "text-red-400" : "text-green-400"} icon="💨" />
          
          {/* Card: Temp & Hum */}
          <Card title="Temperature" value={data.temp} unit="°C" color="text-orange-400" icon="🌡️" />
          <Card title="Humidity" value={data.hum} unit="%" color="text-blue-400" icon="💧" />
          
          {/* Card: Water Level */}
          <Card title="Distance" value={data.distance} unit="cm" color="text-cyan-400" icon="📏" />
          
          {/* Card: pH & EC */}
          <Card title="pH Level" value={data.ph} unit="pH" color="text-purple-400" icon="🧪" />
          <Card title="EC Value" value={data.ec} unit="ms/cm" color="text-yellow-400" icon="⚡" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, unit, color, icon }: any) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-slate-500 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 font-medium uppercase tracking-wider text-xs">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline">
        <span className={`text-4xl font-bold ${color}`}>{value}</span>
        <span className="ml-2 text-slate-500 font-medium">{unit}</span>
      </div>
    </div>
  );
}