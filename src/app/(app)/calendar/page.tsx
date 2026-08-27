'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockSchedules, mockCampaigns } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { GoogleSyncBanner } from '@/components/calendar/GoogleSyncBanner';
import { ScheduleModal } from '@/components/calendar/ScheduleModal';
import type { ScheduleItem } from '@/types';

type CalendarView = 'month' | 'week' | 'day';

export default function CalendarPage() {
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // local state for schedules to allow adding new ones
  const [schedules, setSchedules] = useState<ScheduleItem[]>(mockSchedules);

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  // Date Helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  // Month View Days
  const monthDays = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    return {
      date: dayNumber,
      isCurrentMonth,
      isToday: isCurrentMonth && dayNumber === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear(),
      events: isCurrentMonth ? schedules.filter(s => {
        const d = new Date(s.scheduleAt);
        return d.getDate() === dayNumber && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      }) : []
    };
  });

  // Week View Days
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      date: d.getDate(),
      dayName: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][i],
      fullDate: d,
      isToday: d.getDate() === new Date().getDate() && d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear(),
      events: schedules.filter(s => {
        const sd = new Date(s.scheduleAt);
        return sd.getDate() === d.getDate() && sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      })
    };
  });

  // Day View
  const dayEvents = schedules.filter(s => {
    const sd = new Date(s.scheduleAt);
    return sd.getDate() === currentDate.getDate() && sd.getMonth() === currentDate.getMonth() && sd.getFullYear() === currentDate.getFullYear();
  });

  const getEventColor = (type: string) => {
    switch (type) {
      case 'upload': return 'bg-green-100 text-green-700 border-green-200';
      case 'reminder': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'deadline': return 'bg-red-100 text-red-700 border-red-200';
      case 'review': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'generate': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const selectedEvent = schedules.find(s => s.id === selectedEventId);
  const relatedCampaign = selectedEvent ? mockCampaigns.find(c => c.id === selectedEvent.campaignId) : null;

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleSaveSchedule = (newSchedule: any) => {
    const schedule: ScheduleItem = {
      ...newSchedule,
      id: `sch-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setSchedules([...schedules, schedule]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      
      <GoogleSyncBanner className="shrink-0" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-full border border-gray-200 p-1 shadow-sm">
            <button 
              onClick={navigatePrev}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              Hari Ini
            </button>
            <button 
              onClick={navigateNext}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {view === 'day' 
              ? `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-full p-1 border border-gray-200 shadow-sm">
            {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all',
                  view === v ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {v === 'month' ? 'Bulan' : v === 'week' ? 'Minggu' : 'Hari'}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-pill flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Jadwal
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Calendar Views */}
        <div className="flex-1 clean-card p-4 flex flex-col min-h-0">
          
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-4 px-2 shrink-0">
            {[
              { type: 'upload', label: 'Upload Video', color: 'bg-green-500' },
              { type: 'reminder', label: 'Reminder', color: 'bg-amber-500' },
              { type: 'deadline', label: 'Deadline', color: 'bg-red-500' },
              { type: 'review', label: 'Review', color: 'bg-blue-500' },
              { type: 'generate', label: 'Generate', color: 'bg-purple-500' },
            ].map(legend => (
              <div key={legend.type} className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", legend.color)} />
                <span className="text-xs font-medium text-gray-600">{legend.label}</span>
              </div>
            ))}
          </div>

          {/* Month View */}
          {view === 'month' && (
            <>
              <div className="grid grid-cols-7 gap-px mb-2 shrink-0">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                  <div key={day} className="py-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-2 min-h-0">
                {monthDays.map((day, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "p-1.5 md:p-2 rounded-xl flex flex-col gap-1 min-h-0 overflow-hidden transition-colors border border-transparent",
                      day.isCurrentMonth ? "bg-white hover:border-gray-200" : "bg-gray-50/50 opacity-50",
                      day.isToday && "ring-2 ring-blue-500 ring-offset-2"
                    )}
                  >
                    <div className="flex justify-between items-center px-1">
                      <span className={cn(
                        "text-sm font-semibold",
                        day.isToday ? "text-blue-600" : (day.isCurrentMonth ? "text-gray-900" : "text-gray-400")
                      )}>
                        {day.date > 0 ? day.date : ''}
                      </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                      {day.events.map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEventId(event.id)}
                          className={cn(
                            "w-full text-left text-[10px] sm:text-xs font-medium px-2 py-1 sm:py-1.5 rounded-lg truncate border transition-colors",
                            getEventColor(event.eventType),
                            selectedEventId === event.id && "ring-2 ring-gray-900 ring-offset-1"
                          )}
                        >
                          {new Date(event.scheduleAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Week View */}
          {view === 'week' && (
            <div className="flex-1 grid grid-cols-7 gap-2 min-h-0">
              {weekDays.map((day, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-2 rounded-xl flex flex-col gap-2 min-h-0 overflow-hidden bg-white border",
                    day.isToday ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100"
                  )}
                >
                  <div className="text-center pb-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase">{day.dayName}</p>
                    <p className={cn("text-xl font-bold mt-1", day.isToday ? "text-blue-600" : "text-gray-900")}>
                      {day.date}
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pt-1">
                    {day.events.map(event => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEventId(event.id)}
                        className={cn(
                          "w-full text-left text-xs font-medium px-2 py-2 rounded-lg border transition-colors flex flex-col gap-1",
                          getEventColor(event.eventType),
                          selectedEventId === event.id && "ring-2 ring-gray-900 ring-offset-1"
                        )}
                      >
                        <span className="font-bold opacity-75">
                          {new Date(event.scheduleAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="truncate">{event.title}</span>
                      </button>
                    ))}
                    {day.events.length === 0 && (
                      <div className="h-full flex items-center justify-center text-xs font-medium text-gray-300">
                        Kosong
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Day View */}
          {view === 'day' && (
            <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-100 p-4">
              <div className="max-w-2xl mx-auto space-y-4">
                {dayEvents.length > 0 ? (
                  dayEvents.sort((a,b) => new Date(a.scheduleAt).getTime() - new Date(b.scheduleAt).getTime()).map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border transition-colors text-left",
                        getEventColor(event.eventType),
                        selectedEventId === event.id && "ring-2 ring-gray-900 ring-offset-2"
                      )}
                    >
                      <div className="w-16 text-center shrink-0">
                        <p className="text-lg font-bold">
                          {new Date(event.scheduleAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="w-px h-10 bg-current opacity-20 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate text-base">{event.title}</h4>
                        <p className="text-sm opacity-80 truncate">{event.campaignName}</p>
                      </div>
                      <StatusBadge status={event.status} />
                    </button>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-medium">Tidak ada jadwal untuk hari ini.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Details (Visible on lg or when selected) */}
        <AnimatePresence>
          {selectedEventId && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 320 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="hidden lg:block shrink-0"
            >
              <div className="clean-card h-full p-6 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="font-bold text-gray-900">Detail Event</h2>
                  <button 
                    onClick={() => setSelectedEventId(null)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {selectedEvent && (
                  <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                    <div>
                      <div className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-bold mb-3 border", getEventColor(selectedEvent.eventType))}>
                        {selectedEvent.eventType.toUpperCase()}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Clock className="w-4 h-4" />
                        {new Date(selectedEvent.scheduleAt).toLocaleString('id-ID', { 
                          weekday: 'long', day: 'numeric', month: 'long', 
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Campaign Terkait</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                          📦
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {relatedCampaign?.productName || selectedEvent.campaignName}
                          </p>
                          <p className="text-xs text-blue-600 font-semibold truncate">Aktif</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Status</p>
                      <StatusBadge status={selectedEvent.status} />
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 mt-auto gap-3 flex flex-col">
                  <button className="btn-pill w-full py-2.5 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
                    Selesaikan Event
                  </button>
                  <button className="btn-pill w-full py-2.5 bg-white text-gray-900 font-semibold text-sm hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                    Edit Jadwal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
      />
    </div>
  );
}
