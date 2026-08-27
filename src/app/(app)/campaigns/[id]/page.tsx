'use client';

import { useState, use, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notFound, useRouter } from 'next/navigation';
import { mockCampaigns, mockContents, mockSchedules, mockCampaignHistory } from '@/lib/mock-data';
import { ContentCard } from '@/components/common/ContentCard';
import { OpportunityGauge } from '@/components/common/OpportunityGauge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { Progress } from '@/components/ui/progress';
import { AIAssistantPanel } from '@/components/campaign/AIAssistantPanel';
import { GeneratedContent, Campaign } from '@/types';
import { cn, formatDate, getContentTypeLabel, getEventTypeLabel } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import {
  ArrowLeft, Sparkles, Zap, FileText, Hash, MessageCircle, Video, Image,
  CalendarDays, StickyNote, History, Eye, Target, BarChart3, Shield,
  MoreVertical, Edit3, Trash2, Plus
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const TABS = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'analysis', label: 'Analisis', icon: BarChart3 },
  { id: 'hook', label: 'Hooks', icon: Target },
  { id: 'script', label: 'Scripts', icon: FileText },
  { id: 'caption', label: 'Captions', icon: FileText },
  { id: 'cta', label: 'CTA', icon: Zap },
  { id: 'hashtag', label: 'Hashtags', icon: Hash },
  { id: 'video_idea', label: 'Ide Video', icon: Video },
];

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [targetContent, setTargetContent] = useState(10);
  
  const [editForm, setEditForm] = useState({
    productName: '',
    category: '',
    price: '',
    usp: '',
    target_audience: ''
  });
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [localContents, setLocalContents] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', unwrappedParams.id)
        .single();
        
      if (data) {
        setCampaign({
          id: data.id,
          userId: data.user_id,
          productName: data.product_name,
          productImage: data.product_image || '',
          tiktokShopUrl: data.tiktok_shop_url || '',
          status: data.status,
          opportunityScore: data.opportunity_score || 0,
          contentCount: data.content_count || 0,
          progress: data.progress || 0,
          nextSchedule: data.next_schedule,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          category: data.category,
          price: data.price,
          usp: data.usp,
          target_audience: data.target_audience,
          selling_points: data.selling_points,
          pain_points: data.pain_points,
          emotion_triggers: data.emotion_triggers,
          quick_analysis: data.quick_analysis,
        });
        
        const savedTarget = localStorage.getItem(`campaignTarget_${data.id}`);
        if (savedTarget) {
          setTargetContent(parseInt(savedTarget, 10));
        }
        
        setEditForm({
          productName: data.product_name || '',
          category: data.category || '',
          price: data.price || '',
          usp: data.usp || '',
          target_audience: data.target_audience || ''
        });
        const { data: contentsData } = await supabase
          .from('generated_contents')
          .select('*')
          .eq('campaign_id', data.id)
          .order('created_at', { ascending: false });

        if (contentsData) {
          const fetchedContents: GeneratedContent[] = contentsData.map(c => ({
            id: c.id,
            campaignId: c.campaign_id,
            type: c.type,
            title: c.title || undefined,
            content: c.content,
            format: c.format || undefined,
            visualConcept: c.visual_concept || undefined,
            emotion: c.emotion || undefined,
            favorite: c.favorite,
            archived: c.archived,
            aiModel: c.ai_model,
            createdAt: c.created_at,
            updatedAt: c.updated_at
          }));
          setLocalContents(fetchedContents);
        } else {
          setLocalContents([]);
        }
      }
      setIsLoading(false);
    };

    fetchCampaign();
  }, [unwrappedParams.id]);

  const handleDelete = async () => {
    if (!confirm('Apakah kamu yakin ingin menghapus campaign ini? Semua data terkait akan ikut terhapus.')) return;
    setIsDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaign?.id);
      
    if (!error) {
      router.push('/campaigns');
    } else {
      alert('Gagal menghapus campaign');
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!campaign) return;
    setIsUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('campaigns')
      .update({
        product_name: editForm.productName,
        category: editForm.category,
        price: editForm.price,
        usp: editForm.usp,
        target_audience: editForm.target_audience
      })
      .eq('id', campaign.id);
      
    if (!error) {
      setCampaign({
        ...campaign,
        productName: editForm.productName,
        category: editForm.category,
        price: editForm.price,
        usp: editForm.usp,
        target_audience: editForm.target_audience
      });
      setIsEditModalOpen(false);
    } else {
      alert('Gagal memperbarui campaign');
    }
    setIsUpdating(false);
  };

  const handleUpdateTarget = (newTarget: number) => {
    if (newTarget < 1) newTarget = 1;
    setTargetContent(newTarget);
    if (campaign) {
      localStorage.setItem(`campaignTarget_${campaign.id}`, newTarget.toString());
      // Recalculate progress based on new target
      const newProgress = Math.min(100, Math.round((campaign.contentCount / newTarget) * 100));
      updateProgressInDb(campaign.contentCount, newProgress);
    }
  };

  const handleAddContent = async () => {
    if (!campaign) return;
    const newCount = campaign.contentCount + 1;
    const newProgress = Math.min(100, Math.round((newCount / targetContent) * 100));
    await updateProgressInDb(newCount, newProgress);
  };

  const updateProgressInDb = async (newCount: number, newProgress: number) => {
    if (!campaign) return;
    setIsUpdatingProgress(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('campaigns')
      .update({ content_count: newCount, progress: newProgress })
      .eq('id', campaign.id);
      
    if (!error) {
      setCampaign({ ...campaign, contentCount: newCount, progress: newProgress });
    } else {
      alert('Gagal mengupdate progress');
    }
    setIsUpdatingProgress(false);
  };

  const schedules = mockSchedules.filter(s => s.campaignId === unwrappedParams.id);
  const history = mockCampaignHistory[unwrappedParams.id] || [];

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Memuat campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Campaign Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Campaign yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
        <Link href="/campaigns" className="btn-pill px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 shadow-sm transition-colors">Kembali ke Daftar Campaign</Link>
      </div>
    );
  }

  const renderTabContent = () => {
    // 1. OVERVIEW
    if (activeTab === 'overview') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="clean-card p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" /> Detail Produk
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Target Audience</span>
                  <p className="font-medium text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{campaign.target_audience || 'Belum ada data target audience'}</p>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Selling Points</span>
                  <ul className="list-disc list-inside space-y-1 text-gray-900 font-medium bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {campaign.selling_points && campaign.selling_points.length > 0 ? campaign.selling_points.map((point: string, i: number) => <li key={i}>{point}</li>) : <li className="list-none text-gray-500">Belum ada data</li>}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="clean-card p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" /> Analisis Cepat
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-gray-900">{campaign.quick_analysis || 'Belum ada analisis cepat.'}</p>
                </div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-gray-500">Progress Konten</span>
                    <span className="text-gray-900">{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2.5 bg-gray-100 [&_[data-slot=progress-indicator]]:bg-blue-600" />
                  
                  <div className="mt-5 p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Target Konten</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="1"
                          value={targetContent}
                          onChange={(e) => handleUpdateTarget(Number(e.target.value))}
                          className="w-16 h-8 px-2 text-center text-sm font-bold rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-xs font-medium text-gray-500">Video</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 mb-0.5">Selesai</span>
                        <span className="text-sm font-bold text-gray-900">{campaign.contentCount} <span className="text-gray-400 font-medium">/ {targetContent}</span></span>
                      </div>
                      <button 
                        onClick={handleAddContent}
                        disabled={isUpdatingProgress || campaign.contentCount >= targetContent}
                        className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-500 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> 1 Selesai
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. ANALYSIS
    if (activeTab === 'analysis') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="clean-card p-6">
             <h3 className="text-base font-bold text-gray-900 mb-4">Pain Points</h3>
             <ul className="space-y-3">
               {campaign.pain_points && campaign.pain_points.length > 0 ? campaign.pain_points.map((pp: string, i: number) => (
                 <li key={i} className="flex items-start gap-3 p-3 bg-red-50 text-red-900 text-sm font-medium rounded-lg border border-red-100">
                   <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">{i+1}</span>
                   {pp}
                 </li>
               )) : <p className="text-sm text-gray-500 font-medium">Belum ada data pain points.</p>}
             </ul>
          </div>
          <div className="clean-card p-6">
             <h3 className="text-base font-bold text-gray-900 mb-4">Emotion Triggers</h3>
             <div className="flex flex-wrap gap-2">
               {campaign.emotion_triggers && campaign.emotion_triggers.length > 0 ? campaign.emotion_triggers.map((et: string) => (
                 <span key={et} className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm font-bold">
                   {et}
                 </span>
               )) : <p className="text-sm text-gray-500 font-medium">Belum ada data emotion triggers.</p>}
             </div>
          </div>
        </div>
      );
    }

    // 11. SCHEDULE
    if (activeTab === 'schedule') {
      return (
        <div className="clean-card p-0 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900">Jadwal Campaign</h3>
            <button className="btn-pill px-4 py-2 text-xs bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" /> Tambah Jadwal
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {schedules.map(sch => (
              <div key={sch.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex flex-col items-center justify-center border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{new Date(sch.scheduleAt).toLocaleDateString('id-ID', { month: 'short' })}</span>
                    <span className="text-sm font-extrabold text-gray-900 leading-none">{new Date(sch.scheduleAt).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">{sch.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {getEventTypeLabel(sch.eventType)} · {new Date(sch.scheduleAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={sch.status} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 13. HISTORY
    if (activeTab === 'history') {
      return (
        <div className="clean-card p-6">
          <div className="space-y-8 pl-4 border-l-2 border-gray-100 ml-4 relative">
            {history.map((item, idx) => (
              <div key={item.id} className="relative">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-white border-[3px] border-blue-500" />
                <div className="mb-1 text-xs font-bold text-blue-600">
                  {formatDate(item.createdAt)}
                </div>
                <p className="text-sm font-semibold text-gray-900">{item.action}</p>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default: Content Lists (Hooks, Scripts, etc)
    const filteredContents = localContents.filter(c => c.type === activeTab);
    
    return filteredContents.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContents.map(content => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    ) : (
      <EmptyState
        icon={Sparkles}
        title={`Belum ada ${TABS.find(t => t.id === activeTab)?.label}`}
        description="Gunakan AI untuk menghasilkan konten menarik secara otomatis."
        actionLabel="Generate dengan AI"
        onAction={() => setIsAIPanelOpen(true)}
      />
    );
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link href="/campaigns" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        {campaign.productImage ? (
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-sm">
            <img src={campaign.productImage} alt={campaign.productName} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl shrink-0 border border-blue-100 shadow-sm">
            📦
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{campaign.productName}</h1>
            <StatusBadge status={campaign.status} variant="solid" />
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Dibuat {formatDate(campaign.createdAt)}
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          <button className="btn-pill px-4 py-2 bg-gray-100 text-gray-900 font-semibold text-sm hover:bg-gray-200 transition-colors shadow-sm">
            Simpan Draft
          </button>
          <button 
            onClick={() => setIsAIPanelOpen(true)}
            className="btn-pill flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> AI Assistant
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors text-gray-600 outline-none">
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-gray-100 shadow-xl rounded-xl">
              <DropdownMenuItem className="text-sm font-medium focus:bg-gray-50 cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
                <Edit3 className="w-4 h-4 mr-2 text-gray-500" /> Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2" /> {isDeleting ? 'Menghapus...' : 'Hapus Campaign'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Opportunity */}
        <div className="lg:col-span-1">
          <div className="clean-card p-6 flex flex-col items-center justify-center text-center h-full min-h-[240px]">
            <h3 className="font-bold text-gray-900 mb-6 w-full text-left">Opportunity Score</h3>
            <OpportunityGauge score={campaign.opportunityScore} size="lg" />
            <p className="text-xs text-gray-500 mt-6 leading-relaxed">
              Skor ini dihitung berdasarkan tren TikTok, persaingan hashtag, dan riwayat konversi produk serupa.
            </p>
          </div>
        </div>

        {/* Right Col: Tabs & Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Tabs Navigation */}
          <div className="clean-card p-2 rounded-full overflow-hidden">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max space-x-1 p-1">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all relative z-10',
                        isActive
                          ? 'text-white'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabPill"
                          className="absolute inset-0 bg-gray-900 rounded-full -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      <AIAssistantPanel 
        isOpen={isAIPanelOpen} 
        onClose={() => setIsAIPanelOpen(false)} 
        campaignId={campaign.id} 
        initialType={activeTab}
        onGenerate={(newContent) => {
          // Tambahkan content baru ke state
          setLocalContents(prev => [newContent, ...prev]);
          // Pindahkan tab aktif ke tipe konten yang baru digenerate agar pengguna langsung melihatnya
          setActiveTab(newContent.type);
        }}
      />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Perbarui informasi dasar campaign ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nama Produk</label>
              <input
                type="text"
                value={editForm.productName}
                onChange={(e) => setEditForm({...editForm, productName: e.target.value})}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Kategori</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Harga</label>
                <input
                  type="text"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Selling Points (USP)</label>
              <textarea
                value={editForm.usp}
                onChange={(e) => setEditForm({...editForm, usp: e.target.value})}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium text-sm resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Target Audience</label>
              <textarea
                value={editForm.target_audience}
                onChange={(e) => setEditForm({...editForm, target_audience: e.target.value})}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
