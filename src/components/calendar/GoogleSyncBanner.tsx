'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoogleSyncBannerProps {
  className?: string;
}

export function GoogleSyncBanner({ className }: GoogleSyncBannerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm", className)}>
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
          isConnected ? "bg-green-100" : "bg-gray-100"
        )}>
          <CalendarIcon className={cn("w-6 h-6", isConnected ? "text-green-600" : "text-gray-500")} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Google Calendar Sync</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {isConnected ? "Jadwal Anda tersinkronisasi dengan Google Calendar." : "Sinkronkan jadwal agar tidak ketinggalan upload."}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => setIsConnected(!isConnected)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative overflow-hidden group flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all",
          isConnected 
            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" 
            : "bg-gray-900 text-white hover:bg-gray-800"
        )}
      >
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2"
            >
              {isHovered ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{isHovered ? 'Putuskan Koneksi' : 'Terhubung'}</span>
            </motion.div>
          ) : (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <span>Hubungkan Akun</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
