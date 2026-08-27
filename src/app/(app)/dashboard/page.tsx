'use client';

import { motion } from 'framer-motion';
import { getGreeting } from '@/lib/utils';
import { mockTodayTasks, mockGoals, mockCoachRecommendations, mockCampaigns, mockSchedules } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Plus, Sparkles, Zap, CalendarDays, CheckCircle2, Circle, Clock,
  ArrowRight, TrendingUp, Upload, Target, ChevronRight, Wallet, ArrowUpRight, ArrowDownRight, Info,
  Check, Trash2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { ConsistencyTracker } from '@/components/common/ConsistencyTracker';
import { ConsistencyStreak } from '@/components/common/ConsistencyStreak';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const userId = user?.id || null;
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Tamu';
  
  const [tasks, setTasks] = useState<{id: string, title: string, status: 'pending'|'completed', dueTime: string}[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [totalActiveCampaigns, setTotalActiveCampaigns] = useState(0);
  const upcomingSchedules: any[] = [];
  const coachInsights: any[] = [];
  const weeklyProgress = 0;

  const saveTasks = (newTasks: any[]) => {
    setTasks(newTasks);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`userDailyTasks_${today}`, JSON.stringify(newTasks));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      status: 'pending' as const,
      dueTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    saveTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => 
      t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    );
    saveTasks(updated);
  };

  const removeTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedTasks = localStorage.getItem(`userDailyTasks_${today}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const fetchData = async () => {
      if (!userId) return;
      const supabase = createClient();

      // Get exact count first
      const { count: totalCount, error: countError } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
      if (totalCount !== null) {
        setTotalActiveCampaigns(totalCount);
      }

      // Then get the latest 3 campaigns for the list
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) {
        console.error("Error fetching campaigns data:", error);
      }
        
      if (data) {
        setActiveCampaigns(data.map((row: any) => ({
          id: row.id,
          productName: row.product_name,
          productImage: row.product_image || '',
          progress: row.progress || 0,
          contentCount: row.content_count || 0,
          opportunityScore: row.opportunity_score || 0,
        })));
      }
    };
    
    fetchData();
  }, [userId]);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;


  // Calendar preview
  const today = new Date();
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-12">
      
      {/* Guest Warning Banner */}
      {!loading && !userId && (
        <motion.div variants={item} className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">Anda masuk sebagai Tamu</h3>
              <p className="text-xs font-medium text-amber-700 mt-0.5">Untuk membuat campaign dan menyimpan data, Anda perlu membuat akun.</p>
            </div>
          </div>
          <Link href="/login" className="whitespace-nowrap px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
            Login Sekarang
          </Link>
        </motion.div>
      )}

      {/* Header Actions (Moneed style top actions) */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Performa Akun</h1>
            <p className="text-sm text-gray-500">{getGreeting()}, {firstName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={user ? "/campaigns/create" : "/login?message=unauthorized"} className="btn-pill flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Buat Campaign
          </Link>
        </div>
      </motion.div>

      {/* ===== HERO STATS (Moneed Style) ===== */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance / Progress */}
        <div className="clean-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold text-gray-900">Total Campaign Aktif</span>
            <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
              BULAN INI
            </div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
              <AnimatedCounter target={totalActiveCampaigns} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <Sparkles className="w-3 h-3" /> Semangat!
              </span>
              <span className="text-gray-500 font-medium">Tingkatkan terus performamu hari ini.</span>
            </div>
          </div>
        </div>

        {/* Target Harian (Consistency Tracker) */}
        <ConsistencyTracker 
          title="Target Harian" 
          currentValue={weeklyProgress} 
          targetValue={10}
          className="h-full"
        />

        {/* Tugas (Expense style) */}
        <div className="clean-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-semibold text-gray-900">Tugas Harian</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-gray-900">
              {pendingCount}
            </span>
            <span className="text-gray-500 font-medium">pending</span>
          </div>
          <div className="space-y-3 mt-4 border-t border-gray-100 pt-4 max-h-[160px] overflow-y-auto">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div key={task.id} className="flex justify-between items-center text-sm group">
                  <div 
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full flex-shrink-0 border-2 transition-all flex items-center justify-center", 
                      task.status === 'completed' 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 group-hover:border-blue-500'
                    )}>
                      {task.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={cn(
                      "text-gray-600 truncate font-medium transition-all",
                      task.status === 'completed' && 'line-through text-gray-400'
                    )}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-semibold text-gray-400 text-xs">{task.dueTime}</span>
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-xs font-medium text-gray-400 bg-gray-50 rounded-xl">Belum ada tugas hari ini. Mulai tambahkan!</div>
            )}
          </div>
          
          <form onSubmit={addTask} className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Ketik tugas baru..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>

      {/* ===== CONSISTENCY STREAK ===== */}
      <motion.div variants={item}>
        <ConsistencyStreak 
          currentStreak={0}
          activeDays={[false, false, false, false, false, false, false]}
        />
      </motion.div>

      {/* ===== MIDDLE SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaign List (Like Cashflow Chart) */}
        <motion.div variants={item} className="lg:col-span-2 clean-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Campaign Berjalan</h2>
            </div>
            <Link href={user ? "/campaigns" : "/login?message=unauthorized"} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Lihat Semua
            </Link>
          </div>
          
          <div className="space-y-4">
            {activeCampaigns.length > 0 ? (
              activeCampaigns.map((camp) => (
                <Link
                  key={camp.id}
                  href={user ? `/campaigns/${camp.id}` : "/login?message=unauthorized"}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-xl shadow-sm">
                    {camp.productImage ? (
                      <img src={camp.productImage} alt={camp.productName} className="w-full h-full object-cover" />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate mb-1">{camp.productName}</h3>
                    <div className="flex items-center gap-3">
                      <Progress value={camp.progress} className="w-32 h-2 bg-gray-200 [&_[data-slot=progress-indicator]]:bg-blue-600" />
                      <span className="text-xs font-semibold text-gray-500">{camp.progress}%</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end mr-4">
                    <span className="text-sm font-bold text-gray-900">{camp.contentCount} Konten</span>
                    <span className="text-xs text-gray-500">Skor: {camp.opportunityScore}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Target className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Belum Ada Campaign</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Buat campaign pertama Anda sekarang.</p>
                <Link href={user ? "/campaigns/create" : "/login?message=unauthorized"} className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block shadow-sm">
                  Buat Campaign
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Coach (Like Premium Feature / Goals) */}
        <motion.div variants={item} className="flex flex-col gap-6">
          <div className="rounded-3xl shadow-xl bg-gray-900 text-white p-6 relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-base font-bold">AI Coach Insights</h2>
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            
            <div className="space-y-4 relative z-10">
              {coachInsights.length > 0 ? (
                coachInsights.map((rec) => (
                  <div key={rec.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <p className="text-sm font-medium text-gray-100 leading-relaxed">{rec.recommendation}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                  <Info className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-xs font-medium text-gray-400 leading-relaxed">AI Coach sedang mengumpulkan data dari campaign Anda untuk memberikan rekomendasi yang akurat.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Calendar Mini */}
          <div className="clean-card p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Jadwal Terdekat</h2>
              <Link href={user ? "/calendar" : "/login?message=unauthorized"} className="text-xs font-semibold text-gray-500 hover:text-gray-900">
                Buka Kalender
              </Link>
            </div>
            <div className="flex gap-2 justify-between mb-6">
              {weekDays.map((day, idx) => {
                const isToday = idx === 0;
                return (
                  <div key={idx} className={cn(
                    "flex flex-col items-center justify-center w-10 h-14 rounded-full",
                    isToday ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-600"
                  )}>
                    <span className="text-[10px] font-bold uppercase">{monthNames[day.getMonth()]}</span>
                    <span className="text-sm font-extrabold">{day.getDate()}</span>
                  </div>
                )
              })}
            </div>
            <div className="space-y-3">
              {upcomingSchedules.length > 0 ? (
                upcomingSchedules.map(sch => (
                  <div key={sch.id} className="flex items-center gap-3">
                    <div className="w-2 h-10 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{sch.title}</p>
                      <p className="text-xs font-medium text-gray-500">{new Date(sch.scheduleAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs font-medium text-gray-400">Belum ada jadwal upload terdekat.</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
