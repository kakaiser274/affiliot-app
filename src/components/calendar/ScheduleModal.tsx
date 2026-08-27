'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockCampaigns } from '@/lib/mock-data';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import type { ScheduleItem } from '@/types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Omit<ScheduleItem, 'id' | 'createdAt' | 'status'>) => void;
}

export function ScheduleModal({ isOpen, onClose, onSave }: ScheduleModalProps) {
  const [title, setTitle] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [eventType, setEventType] = useState<'upload' | 'reminder' | 'deadline' | 'review' | 'generate'>('upload');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSave = () => {
    if (!title || !campaignId || !date || !time) return;

    const campaign = mockCampaigns.find(c => c.id === campaignId);
    
    // Create ISO string for scheduleAt
    const scheduleAt = new Date(`${date}T${time}:00`).toISOString();

    onSave({
      title,
      campaignId,
      campaignName: campaign?.productName || 'Unknown Campaign',
      eventType,
      scheduleAt,
    });

    // Reset form
    setTitle('');
    setCampaignId('');
    setEventType('upload');
    setDate('');
    setTime('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Jadwal Baru</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Judul Event</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Misal: Upload Video Review"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Pilih Campaign</label>
            <select
              value={campaignId}
              onChange={e => setCampaignId(e.target.value)}
              className="p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
            >
              <option value="">Pilih campaign...</option>
              {mockCampaigns.map(camp => (
                <option key={camp.id} value={camp.id}>
                  {camp.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Tipe Event</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'upload', label: 'Upload Video' },
                { value: 'reminder', label: 'Reminder' },
                { value: 'deadline', label: 'Deadline' },
                { value: 'review', label: 'Review' },
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setEventType(type.value as any)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                    eventType === type.value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" /> Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Waktu
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-full font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={!title || !campaignId || !date || !time}
            className="px-6 py-2 rounded-full font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Simpan Jadwal
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
