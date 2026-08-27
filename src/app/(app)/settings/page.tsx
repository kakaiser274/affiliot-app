'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { mockPreferences } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import {
  User, Shield, CalendarDays, Brain, Settings as SettingsIcon,
  LogOut, Globe, Bell, Check
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const settingsSections = [
  { key: 'profile', label: 'Profil', icon: User },
  { key: 'account', label: 'Akun Google', icon: Shield },
  { key: 'calendar', label: 'Integrasi Kalender', icon: CalendarDays },
  { key: 'ai', label: 'Provider AI', icon: Brain },
  { key: 'preferences', label: 'Preferensi', icon: SettingsIcon },
];

const aiProviders = [
  { key: 'openai', name: 'OpenAI (GPT-4o)', description: 'Model paling populer, balance antara kualitas dan kecepatan.' },
  { key: 'claude', name: 'Claude (Anthropic)', description: 'Kuat dalam penulisan kreatif dan memahami konteks panjang.' },
  { key: 'gemini', name: 'Gemini (Google)', description: 'Cepat dan efisien, baik untuk tugas multi-modal.' },
  { key: 'openrouter', name: 'OpenRouter', description: 'Akses ke berbagai model melalui satu API.' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna';
  const email = user?.email || 'email@contoh.com';
  const initial = fullName.charAt(0).toUpperCase();
  
  const [activeSection, setActiveSection] = useState('profile');
  const [prefs, setPrefs] = useState(mockPreferences);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (fullName && fullName !== 'Pengguna') {
      setNameInput(fullName);
    }
  }, [fullName]);

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: nameInput }
    });

    setIsSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } else {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola akun, integrasi, dan preferensi kamu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Nav */}
        <div className="lg:col-span-1">
          <nav className="clean-card p-2 space-y-0.5">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                    activeSection === section.key
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* ===== PROFILE ===== */}
            {activeSection === 'profile' && (
              <div className="clean-card p-6 md:p-8 space-y-8">
                <h2 className="text-lg font-bold text-gray-900">Profil</h2>

                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 border border-blue-200">
                    {initial}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">{fullName}</p>
                    <p className="text-sm font-medium text-gray-500">{email}</p>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nama Lengkap</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
                    <input
                      type="email"
                      defaultValue={email}
                      disabled
                      className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Timezone</label>
                    <select
                      defaultValue="Asia/Jakarta"
                      className="w-full h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    >
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                      <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                      <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-pill flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : saved ? <><Check className="w-4 h-4" /> Tersimpan!</> : 'Simpan Perubahan'}
                </button>
              </div>
            )}

            {/* ===== GOOGLE ACCOUNT ===== */}
            {activeSection === 'account' && (
              <div className="clean-card p-6 md:p-8 space-y-8">
                <h2 className="text-lg font-bold text-gray-900">Akun Google</h2>

                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-semibold text-green-600">Terhubung</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Keamanan</h3>
                  <p className="text-xs font-medium text-gray-500 mb-4">Login menggunakan Google OAuth. Affiliot tidak menyimpan password.</p>
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="btn-pill flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" /> {isLoggingOut ? 'Sedang Logout...' : 'Logout dari Semua Perangkat'}
                  </button>
                </div>
              </div>
            )}

            {/* ===== CALENDAR INTEGRATION ===== */}
            {activeSection === 'calendar' && (
              <div className="clean-card p-6 md:p-8 space-y-8">
                <h2 className="text-lg font-bold text-gray-900">Integrasi Kalender</h2>

                {/* Google Calendar */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                        <CalendarDays className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Google Calendar</p>
                        <p className="text-xs font-medium text-gray-500">Sinkronisasi jadwal ke kalender utama</p>
                      </div>
                    </div>
                    <Switch
                      checked={prefs.calendarConnected}
                      onCheckedChange={(checked) => setPrefs({ ...prefs, calendarConnected: checked })}
                    />
                  </div>
                  {prefs.calendarConnected && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-600">Aktif & Tersinkronisasi</span>
                      </div>
                      <p className="text-[10px] font-medium text-gray-500">Sinkronisasi satu arah: Affiliot → Google Calendar</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== AI PROVIDER ===== */}
            {activeSection === 'ai' && (
              <div className="clean-card p-6 md:p-8 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Provider AI</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Pilih engine AI utama untuk menghasilkan konten.</p>
                </div>

                <div className="grid gap-3">
                  {aiProviders.map((provider) => (
                    <button
                      key={provider.key}
                      onClick={() => setPrefs({ ...prefs, preferredAiProvider: provider.key as any })}
                      className={cn(
                        'w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all border',
                        prefs.preferredAiProvider === provider.key
                          ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center shrink-0 border',
                        prefs.preferredAiProvider === provider.key
                          ? 'bg-white border-blue-200 text-blue-600'
                          : 'bg-gray-50 border-gray-100 text-gray-400'
                      )}>
                        <Brain className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{provider.name}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{provider.description}</p>
                      </div>
                      {prefs.preferredAiProvider === provider.key && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ===== PREFERENCES ===== */}
            {activeSection === 'preferences' && (
              <div className="clean-card p-6 md:p-8 space-y-8">
                <h2 className="text-lg font-bold text-gray-900">Preferensi</h2>

                <div className="space-y-6">
                  {/* Goals */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Target Upload Video</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Harian</label>
                        <input
                          type="number"
                          value={prefs.dailyGoal}
                          onChange={(e) => setPrefs({ ...prefs, dailyGoal: parseInt(e.target.value) || 0 })}
                          className="w-full h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Mingguan</label>
                        <input
                          type="number"
                          value={prefs.weeklyGoal}
                          onChange={(e) => setPrefs({ ...prefs, weeklyGoal: parseInt(e.target.value) || 0 })}
                          className="w-full h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bulanan</label>
                        <input
                          type="number"
                          value={prefs.monthlyGoal}
                          onChange={(e) => setPrefs({ ...prefs, monthlyGoal: parseInt(e.target.value) || 0 })}
                          className="w-full h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  {/* Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                        <Bell className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Notifikasi</p>
                        <p className="text-xs font-medium text-gray-500">Terima pengingat jadwal upload</p>
                      </div>
                    </div>
                    <Switch
                      checked={prefs.notificationEnabled}
                      onCheckedChange={(checked) => setPrefs({ ...prefs, notificationEnabled: checked })}
                    />
                  </div>

                  <Separator className="bg-gray-100" />

                  {/* Language */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> Bahasa Aplikasi
                    </label>
                    <select
                      value={prefs.language}
                      onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                      className="w-full sm:w-64 h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                    >
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English (US)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="btn-pill flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {saved ? <><Check className="w-4 h-4" /> Tersimpan!</> : 'Simpan Preferensi'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
