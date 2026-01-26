"use client";
import React, { useState, useEffect } from 'react';

interface Schedule {
  days: number[];
  startTime: string;
  duration: number;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  relayName: string;
  relayId: string;
  schedule: Schedule;
  onSave: (relayId: string, newSchedule: Schedule) => void;
}

const DAYS = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 0, label: 'Sun' },
];

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, relayName, relayId, schedule, onSave }) => {
  const [localSchedule, setLocalSchedule] = useState<Schedule>(schedule);

  useEffect(() => {
    if (schedule) setLocalSchedule(schedule);
  }, [schedule]);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    setLocalSchedule(prev => ({
      ...prev,
      days: prev.days.includes(dayId)
        ? prev.days.filter(d => d !== dayId)
        : [...prev.days, dayId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-white dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">ตั้งเวลา {relayName}</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">ควบคุมการทำงานอัตโนมัติตามตาราง</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xl">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Always ON Toggle */}
          <div className="space-y-3">
            <button
              onClick={() => setLocalSchedule(prev => ({ 
                ...prev, 
                duration: prev.duration === -1 ? 1 : -1 
              }))}
              className={`w-full p-4 rounded-2xl font-bold transition-all flex items-center justify-between border-2 ${
                localSchedule.duration === -1 
                  ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-gray-50 dark:bg-slate-800 border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{localSchedule.duration === -1 ? '✨' : '⏱️'}</span>
                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-wider opacity-70">โหมดการทำงาน</span>
                  <span className="text-sm">{localSchedule.duration === -1 ? 'เปิดตลอดเวลา (Always ON)' : 'ตั้งเวลาทำงานปกติ'}</span>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${localSchedule.duration === -1 ? 'bg-white/30' : 'bg-gray-300 dark:bg-slate-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${localSchedule.duration === -1 ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            </button>
          </div>

          <div className={`space-y-6 transition-all duration-300 ${localSchedule.duration !== -1 ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
            {/* Days Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">วันทำงานในสัปดาห์</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={`flex-1 min-w-[3rem] py-3 rounded-xl text-xs font-bold transition-all ${
                      localSchedule.days.includes(day.id)
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">เวลาที่เริ่ม</label>
                <input
                  type="time"
                  value={localSchedule.startTime}
                  onChange={(e) => setLocalSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl text-gray-800 dark:text-white font-bold transition-all outline-none"
                />
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">ระยะเวลา (นาที)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={localSchedule.duration}
                    onChange={(e) => setLocalSchedule(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl text-gray-800 dark:text-white font-bold transition-all outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-800/30 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onSave(relayId, localSchedule)}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            บันทึกตาราง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
