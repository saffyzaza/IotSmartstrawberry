"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface VerticalSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  color: string;
}

const VerticalSlider: React.FC<VerticalSliderProps> = ({ value, min, max, onChange, color }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = useMemo(() => {
    if (max === min) return 0;
    const pct = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  }, [value, min, max]);

  const updateValue = useCallback((clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const yOffset = clientY - rect.top;
    const pct = 1 - Math.max(0, Math.min(rect.height, yOffset)) / rect.height;
    const newVal = min + pct * (max - min);
    onChange(newVal);
  }, [min, max, onChange]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    updateValue(clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      updateValue(clientY);
    };

    const endDrag = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }, [isDragging, updateValue]);

  return (
    <div 
      className="relative w-full h-28 md:h-32 flex justify-center items-center cursor-ns-resize touch-none group"
      onMouseDown={startDrag}
      onTouchStart={startDrag}
    >
      <div 
        ref={trackRef}
        className="w-1.5 h-16 md:h-20 bg-gray-100 dark:bg-slate-800 rounded-full relative"
      >
        <div 
          className={`absolute bottom-0 w-full rounded-full ${isDragging ? 'transition-none' : 'transition-all duration-200'}`}
          style={{ height: `${percentage}%`, background: color }} 
        />

        <div 
          className={`absolute left-1/2 w-7 h-7 md:w-8 md:h-8 bg-white dark:bg-slate-100 rounded-full cursor-grab active:cursor-grabbing shadow-lg dark:shadow-slate-950/50 z-10 -translate-x-1/2 translate-y-1/2 ${isDragging ? 'transition-none' : 'transition-all duration-150'}`}
          style={{ 
            bottom: `${percentage}%`, 
            borderColor: color,
            borderWidth: '3px',
            borderStyle: 'solid'
          }}
        >
          <div className="absolute inset-0.5 rounded-full border-2 border-white dark:border-slate-100"></div>
        </div>
      </div>
    </div>
  );
};

export default VerticalSlider;
