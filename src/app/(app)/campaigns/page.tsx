'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Plus, Filter, LayoutGrid, List as ListIcon, CalendarDays, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/common/EmptyState';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import type { Campaign } from '@/types';

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'active' | 'draft' | 'completed' | 'archived';

// Map database row to Campaign type
const mapDatabaseToCampaign = (row: any): Campaign => ({
  id: row.id,
  userId: row.user_id,
  productName: row.product_name,
  productImage: row.product_image || '',
  tiktokShopUrl: row.tiktok_shop_url || '',
  status: row.status,
  opportunityScore: row.opportunity_score || 0,
  contentCount: row.content_count || 0,
  progress: row.progress || 0,
  nextSchedule: row.next_schedule,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export default function CampaignsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real data state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch campaigns for this user
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (data) {
          setCampaigns(data.map(mapDatabaseToCampaign));
        }
      }
      setIsLoading(false);
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchSearch = c.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola semua proyek campaign TikTok Affiliate kamu</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 h-10 pl-9 pr-4 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow shadow-sm"
            />
          </div>
          <Link href="/campaigns/create" className="btn-pill flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" /> Buat Baru
          </Link>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between clean-card px-4 py-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {(['all', 'active', 'draft', 'completed', 'archived'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold transition-colors capitalize whitespace-nowrap',
                filterStatus === status
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              {status === 'all' ? 'Semua' : status}
            </button>
          ))}
        </div>
        
        <div className="hidden sm:flex items-center gap-1 border-l border-gray-200 pl-3 ml-3">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-2 rounded-full transition-colors', viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-900')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-2 rounded-full transition-colors', viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-900')}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Memuat campaign...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={Filter}
          title={searchQuery ? "Tidak ada campaign ditemukan" : "Belum ada campaign"}
          description={searchQuery ? "Coba ubah filter pencarianmu." : "Buat campaign pertamamu sekarang untuk mulai mengatur konten!"}
          actionLabel="Buat Campaign"
          onAction={() => router.push('/campaigns/create')}
        />
      ) : (
        <motion.div
          layout
          className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
          )}
        >
          {filteredCampaigns.map((camp) => (
            <Link key={camp.id} href={`/campaigns/${camp.id}`}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'clean-card clean-card-hover group cursor-pointer flex flex-col h-full',
                  viewMode === 'list' ? 'p-4 sm:flex-row sm:items-center' : 'p-6'
                )}
              >
                {/* Header info */}
                <div className={cn("flex-1", viewMode === 'list' && 'flex items-center gap-6')}>
                  <div className="flex justify-between items-start mb-4 gap-3 w-full min-w-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center text-xl shadow-sm border border-blue-100 shrink-0">
                        {camp.productImage ? (
                          <img src={camp.productImage} alt={camp.productName} className="w-full h-full object-cover" />
                        ) : (
                          "📦"
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors truncate">{camp.productName}</h3>
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 truncate">
                          <CalendarDays className="w-3.5 h-3.5 shrink-0" /> Dibuat {formatDate(camp.createdAt)}
                        </p>
                      </div>
                    </div>
                    {viewMode === 'grid' && (
                      <div className="shrink-0 ml-2">
                        <StatusBadge status={camp.status as any} />
                      </div>
                    )}
                  </div>

                  {/* Progress & Stats */}
                  <div className={cn(viewMode === 'list' && 'flex-1 flex items-center justify-end gap-8')}>
                    {viewMode === 'list' && <div className="hidden lg:block"><StatusBadge status={camp.status as any} /></div>}
                    
                    <div className={cn("flex items-center gap-4", viewMode === 'list' ? 'w-48' : 'mb-6 mt-auto')}>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-gray-900">{camp.progress}%</span>
                        </div>
                        <Progress value={camp.progress} className="h-2 bg-gray-100 [&_[data-slot=progress-indicator]]:bg-blue-600" />
                      </div>
                    </div>

                    <div className={cn("flex items-center gap-4 text-sm font-semibold shrink-0", viewMode === 'grid' ? 'justify-between border-t border-gray-100 pt-4' : '')}>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-gray-600" />
                        </div>
                        <span>{camp.contentCount} Konten</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Skor</span>
                        <div className="px-2.5 py-1 rounded-full bg-gray-900 text-white text-xs">
                          {camp.opportunityScore}/100
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}
