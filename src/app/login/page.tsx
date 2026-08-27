'use client';

import { motion } from 'framer-motion';
import { Target, Zap, CalendarDays, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const features = [
  { icon: Target, text: 'AI yang membimbing workflow harian' },
  { icon: Zap, text: 'Generate konten sekali klik' },
  { icon: CalendarDays, text: 'Jadwal upload terintegrasi' },
  { icon: CheckCircle2, text: 'Campaign terorganisasi otomatis' },
];

function LoginMessage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  if (message === 'unauthorized') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600"
      >
        <div className="w-5 h-5 mt-0.5 rounded-full bg-red-200 flex items-center justify-center shrink-0 font-bold text-xs">
          !
        </div>
        <div>
          <h3 className="text-sm font-bold">Akses Ditolak</h3>
          <p className="text-xs font-medium opacity-90 mt-0.5">Anda belum login, silahkan login terlebih dahulu untuk mengakses fitur tersebut.</p>
        </div>
      </motion.div>
    );
  }
  return null;
}

export default function LoginPage() {
  const handleLoginGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 bg-white border-r border-gray-100">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5 mb-8"
        >
          <div className="flex -space-x-1">
            <div className="w-5 h-8 bg-blue-600 rounded-[3px] transform skew-x-[-15deg]" />
            <div className="w-5 h-8 bg-green-500 rounded-[3px] transform skew-x-[-15deg] mt-3" />
          </div>
          <span className="text-3xl font-bold text-gray-900 tracking-tight">Affiliot</span>
        </motion.div>

        {/* Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-extrabold leading-tight mb-4 text-gray-900"
        >
          AI Operating System
          <br />
          untuk <span className="text-blue-600">TikTok Affiliate</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-lg mb-10 max-w-md font-medium"
        >
          Ubah aktivitas konten yang berantakan menjadi workflow terstruktur yang dibimbing AI.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                <feature.icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-gray-700">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background relative">
        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden flex items-center gap-2.5 mb-8"
        >
          <div className="flex -space-x-1">
            <div className="w-4 h-6 bg-blue-600 rounded-[2px] transform skew-x-[-15deg]" />
            <div className="w-4 h-6 bg-green-500 rounded-[2px] transform skew-x-[-15deg] mt-2" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Affiliot</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <Suspense fallback={null}>
            <LoginMessage />
          </Suspense>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-sm text-gray-500 font-medium">Masuk untuk mulai mengelola campaign kamu</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleLoginGoogle}
            className="w-full flex items-center justify-center gap-3 h-14 rounded-full bg-white border border-gray-200 text-gray-900 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 group-hover:text-gray-900" />
          </button>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Dengan masuk, kamu menyetujui{' '}
              <span className="text-blue-600 hover:underline cursor-pointer">Ketentuan Layanan</span>
              {' '}dan{' '}
              <span className="text-blue-600 hover:underline cursor-pointer">Kebijakan Privasi</span>
            </p>
          </div>

          {/* Mobile features */}
          <div className="lg:hidden mt-12 space-y-4 border-t border-gray-200 pt-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <feature.icon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-bold text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="absolute bottom-6 text-[10px] text-gray-400 font-bold tracking-wider">
          © 2026 AFFILIOT INC.
        </p>
      </div>
    </div>
  );
}
