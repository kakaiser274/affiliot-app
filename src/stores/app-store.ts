// ============================================================
// Affiliot — Zustand Store (UI State)
// ============================================================

import { create } from 'zustand';

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;

  // Modal
  activeModal: string | null;
  openModal: (modal: string) => void;
  closeModal: () => void;

  // Campaign
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;

  // Campaign Detail Tab
  activeCampaignTab: string;
  setActiveCampaignTab: (tab: string) => void;

  // Calendar View
  calendarView: 'month' | 'week' | 'day';
  setCalendarView: (view: 'month' | 'week' | 'day') => void;

  // Campaign List View
  campaignListView: 'grid' | 'list';
  setCampaignListView: (view: 'grid' | 'list') => void;

  // Campaign Filter
  campaignStatusFilter: string;
  setCampaignStatusFilter: (filter: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Modal
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),

  // Campaign
  selectedCampaignId: null,
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),

  // Campaign Detail Tab
  activeCampaignTab: 'overview',
  setActiveCampaignTab: (tab) => set({ activeCampaignTab: tab }),

  // Calendar View
  calendarView: 'month',
  setCalendarView: (view) => set({ calendarView: view }),

  // Campaign List View
  campaignListView: 'grid',
  setCampaignListView: (view) => set({ campaignListView: view }),

  // Campaign Filter
  campaignStatusFilter: 'all',
  setCampaignStatusFilter: (filter) => set({ campaignStatusFilter: filter }),
}));
