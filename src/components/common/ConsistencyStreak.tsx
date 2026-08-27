'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConsistencyStreakProps {
  currentStreak?: number;
  // Representing the past 7 days. Array of booleans: true if active, false if not.
  // [Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu]
  activeDays?: boolean[];
  className?: string;
}

const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];

export function ConsistencyStreak({ 
  currentStreak = 0, 
  activeDays = [false, false, false, false, false, false, false],
  className 
}: ConsistencyStreakProps) {
  
  const [streak, setStreak] = useState(currentStreak);
  const [active, setActive] = useState(activeDays);

  useEffect(() => {
    const calculateStreak = () => {
      const globalTarget = parseInt(localStorage.getItem('userDailyTarget') || '10', 10);
      const newActive = [false, false, false, false, false, false, false];
      
      // Map JS getDay() (0=Sun, 1=Mon) to our array index (0=Senin, 6=Minggu)
      const dayMap = [6, 0, 1, 2, 3, 4, 5]; 
      
      let calculatedStreak = 0;
      let streakBroken = false;
      
      const today = new Date();
      // Iterate backwards for the last 30 days to calculate streak
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const progressStr = localStorage.getItem(`userDailyProgress_${dateStr}`);
        const progress = progressStr ? parseInt(progressStr, 10) : 0;
        const isCompleted = progress >= globalTarget;

        // If it's within the last 7 days of the CURRENT week, mark it active
        // Let's just mark the day of the week for the past 7 days
        if (i < 7) {
          const dIndex = dayMap[d.getDay()];
          newActive[dIndex] = isCompleted;
        }

        if (isCompleted && !streakBroken) {
          calculatedStreak++;
        } else if (i > 0 && !isCompleted) {
          // If a past day is not completed, streak is broken
          streakBroken = true;
        }
      }

      setStreak(calculatedStreak);
      setActive(newActive);
    };

    calculateStreak();
    
    // Poll every 5 seconds to catch updates from the target widget
    const interval = setInterval(calculateStreak, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={cn("clean-card p-6 flex flex-col md:flex-row items-center justify-between gap-6", className)}>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 transition-colors",
          streak > 0 ? "bg-orange-100" : "bg-gray-100"
        )}>
          <Flame className={cn("w-6 h-6", streak > 0 ? "text-orange-500" : "text-gray-400")} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Suhu Akun</h3>
          <p className="text-sm font-medium text-gray-500">
            {streak > 0 ? (
              <span className="text-orange-600 font-bold">{streak} Hari Berturut-turut! 🔥</span>
            ) : (
              "Belum ada streak (0 Hari)"
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-4">
        {days.map((day, idx) => {
          const isActive = active[idx];
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive 
                    ? "bg-orange-500 shadow-md shadow-orange-500/20" 
                    : "bg-gray-100 border border-gray-200"
                )}
              >
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-sm"
                  />
                )}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
