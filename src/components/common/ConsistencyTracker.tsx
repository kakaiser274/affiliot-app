'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConsistencyTrackerProps {
  title: string;
  currentValue: number;
  targetValue: number;
  className?: string;
}

export function ConsistencyTracker({ title, currentValue, targetValue: defaultTarget, className }: ConsistencyTrackerProps) {
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [target, setTarget] = useState(defaultTarget);
  const [inputValue, setInputValue] = useState(defaultTarget.toString());
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const savedTarget = localStorage.getItem('userDailyTarget');
    if (savedTarget) {
      setTarget(parseInt(savedTarget, 10));
    }
    
    const today = new Date().toISOString().split('T')[0];
    const savedProgress = localStorage.getItem(`userDailyProgress_${today}`);
    if (savedProgress) {
      setCurrent(parseInt(savedProgress, 10));
    }
  }, []);

  const saveTarget = (newTarget: number) => {
    setTarget(newTarget);
    localStorage.setItem('userDailyTarget', newTarget.toString());
    setIsEditing(false);
  };

  const handleAddProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const newProgress = current + 1;
    setCurrent(newProgress);
    localStorage.setItem(`userDailyProgress_${today}`, newProgress.toString());
  };

  const handleResetProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    setCurrent(0);
    localStorage.setItem(`userDailyProgress_${today}`, '0');
  };

  // SVG parameters
  const R = 80; // Radius
  const cx = 100; // Center X
  const cy = 100; // Center Y
  const strokeWidth = 14;

  // Length of the half-circle arc
  const arcLength = Math.PI * R;

  // Ensure progress doesn't exceed 100% visually
  const percentage = Math.min(Math.max((current / target), 0), 1);

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Calculate knob position based on progress
  // progress goes from 0 to 1. Angle goes from PI to 0.
  const angle = Math.PI - (progress * Math.PI);
  const knobX = cx + R * Math.cos(angle);
  const knobY = cy - R * Math.sin(angle);

  return (
    <div className={cn("rounded-[24px] bg-[#1C1C1E] p-6 relative overflow-hidden shadow-xl", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-white font-bold text-lg tracking-wide">{title}</h3>
        {isEditing ? (
          <div className="flex items-center gap-2 bg-[#2C2C2E] rounded-lg px-2 py-1 border border-[#3C3C3E]">
            <input 
              autoFocus
              type="number"
              min="1"
              max="999"
              className="bg-transparent text-white text-sm font-semibold outline-none w-12 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveTarget(parseInt(inputValue) || 1);
              }}
              onBlur={() => saveTarget(parseInt(inputValue) || 1)}
            />
            <span className="text-white text-sm font-semibold pr-1">Video</span>
          </div>
        ) : (
          <button 
            onClick={() => {
              setInputValue(target.toString());
              setIsEditing(true);
            }} 
            title="Ubah Target" 
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
          >
            <Pencil className="w-4 h-4 text-[#1C1C1E] ml-0.5" />
          </button>
        )}
      </div>

      {/* Gauge Container */}
      <div className="relative w-full max-w-[280px] mx-auto aspect-[5/3] flex items-end justify-center">
        <svg 
          viewBox="0 0 200 120" 
          className="absolute inset-0 w-full h-full drop-shadow-md"
          style={{ overflow: 'visible' }}
        >
          {/* Background Track Arc */}
          <path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none"
            stroke="#2C2C2E"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <motion.path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none"
            stroke="#007AFF" // Bright Apple-like Blue
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: arcLength - (arcLength * progress) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Knob */}
          <motion.g
            initial={{ x: cx - R, y: cy }}
            animate={{ x: knobX, y: knobY }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <circle cx="0" cy="0" r="10" fill="white" className="drop-shadow-lg" />
            {/* Small star or indicator inside the knob */}
            <path 
              d="M 0 -3.5 L 1 -1.5 L 3.5 -1.5 L 1.5 0 L 2.5 3 L 0 1.5 L -2.5 3 L -1.5 0 L -3.5 -1.5 L -1 1.5 Z" 
              fill="#007AFF" 
              transform="scale(1.2)"
            />
          </motion.g>
        </svg>

        {/* Text Inside Gauge */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-white text-5xl font-extrabold tracking-tight">{current}</span>
          </div>
          <p className="text-[#8E8E93] text-sm font-medium mt-1 mb-2 flex items-center gap-1.5">
            / {target} Video
            {current >= target && (
              <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-500/20" />
            )}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button 
              onClick={handleAddProgress}
              className="px-4 py-1.5 bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(0,122,255,0.3)] transition-all active:scale-95"
            >
              +1 Selesai
            </button>
            {current > 0 && (
              <button 
                onClick={handleResetProgress}
                className="px-3 py-1.5 bg-[#2C2C2E] hover:bg-[#3C3C3E] text-[#8E8E93] hover:text-white text-xs font-semibold rounded-full transition-all active:scale-95"
                title="Reset ke 0"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
