'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Sparkles, ArrowRight, CheckCircle2, ChevronLeft, PenTool, LayoutDashboard, Image as ImageIcon, Trash2, Target, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { OpportunityGauge } from '@/components/common/OpportunityGauge';

const PREDEFINED_CATEGORIES = [
  'Elektronik',
  'Pakaian Wanita',
  'Pakaian Pria',
  'Kecantikan & Perawatan Diri',
  'Kesehatan',
  'Peralatan Rumah Tangga',
  'Makanan & Minuman',
  'Otomotif',
  'Olahraga & Outdoor',
  'Ibu & Bayi',
  'Buku & Alat Tulis',
  'Hewan Peliharaan',
  'Mainan & Hobi'
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [url, setUrl] = useState('');
  const [productNameInput, setProductNameInput] = useState('');
  const [inputMode, setInputMode] = useState<'url_only' | 'manual' | 'ai_guess'>('url_only');
  const [extractError, setExtractError] = useState<string | null>(null);
  const [productData, setProductData] = useState({
    productName: '',
    category: '',
    price: '',
    usp: ''
  });
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [productImageBase64, setProductImageBase64] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const supabase = createClient();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        setProductImageBase64(dataUrl);
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUrlExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setExtractError(null);
    setStep(2);

    try {
      const response = await fetch('/api/tiktok-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(120000) // Maksimal tunggu 2 menit di browser
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'PRODUCT_DATA_UNAVAILABLE') {
           setExtractError('Gagal mengekstrak data otomatis dari TikTok Shop. Silakan gunakan mode "Tebak AI" atau "Input Manual".');
           setStep(1);
           setInputMode('ai_guess');
           return;
        }
        throw new Error(data.error?.message || 'Failed to extract product');
      }

      const result = data.analysis;
      const product = data.product?.product;
      
      // Transform the new nested schema to the old flat schema expected by the UI
      const mappedAnalysisData = {
        opportunity_score: result?.opportunityScore?.score || 0,
        target_audience: result?.productDetails?.targetAudience?.join(', ') || '',
        selling_points: result?.productDetails?.keySellingPoints || [],
        quick_analysis: result?.quickAnalysis || '',
        pain_points: result?.painPoints?.map((p: any) => p.painPoint) || [],
        emotion_triggers: result?.emotionTriggers?.map((e: any) => e.emotion) || []
      };

      setProductData({
        productName: product?.name || '',
        category: product?.category || '',
        price: product?.price ? `Rp ${product.price}` : '',
        usp: mappedAnalysisData.quick_analysis || ''
      });
      
      if (product?.images && product.images.length > 0) {
        setProductImageBase64(product.images[0]);
      }
      
      setAnalysisData(mappedAnalysisData);

      setStep(3);
    } catch (error: any) {
      console.error(error);
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        setExtractError('Proses memakan waktu terlalu lama. Server atau AI mungkin sedang sibuk. Silakan gunakan metode "Tebak AI".');
      } else {
        setExtractError(error.message || 'Terjadi kesalahan saat memproses URL. Silakan gunakan metode lain.');
      }
      setStep(1);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !productNameInput) return;
    setStep(2);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: productNameInput })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }
      
      const result = data.result;
      setProductData({
        productName: productNameInput,
        category: result.category || '',
        price: result.price || '',
        usp: result.usp || ''
      });
      setAnalysisData(result);
      
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('Gagal menganalisis produk. Silakan coba lagi atau gunakan Input Manual.');
      setStep(1);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productData.productName,
          category: productData.category,
          price: productData.price,
          usp: productData.usp
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }
      
      const result = data.result;
      setProductData(prev => ({
        productName: prev.productName,
        category: prev.category || result.category || '',
        price: prev.price || result.price || '',
        usp: prev.usp || result.usp || ''
      }));
      setAnalysisData(result);
      
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('Gagal menganalisis produk. Silakan coba lagi.');
      setStep(1);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && analysisData) {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .insert({
            user_id: user.id,
            product_name: productData.productName,
            product_image: productImageBase64 || null,
            tiktok_shop_url: url,
            status: 'active',
            opportunity_score: analysisData.opportunity_score || 80,
            content_count: 0,
            progress: 0,
            category: productData.category,
            price: productData.price,
            usp: productData.usp,
            target_audience: analysisData.target_audience || '',
            selling_points: analysisData.selling_points || [],
            pain_points: analysisData.pain_points || [],
            emotion_triggers: analysisData.emotion_triggers || [],
            quick_analysis: analysisData.quick_analysis || ''
          })
          .select()
          .single();
          
        if (data) {
          router.push(`/campaigns/${data.id}`);
        } else {
          console.error("Error creating campaign:", JSON.stringify(error, null, 2), error);
          alert('Gagal menyimpan campaign ke database: ' + (error?.message || JSON.stringify(error)));
          setIsSaving(false);
        }
      } catch (err) {
        console.error("Error saving:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        alert('Gagal membuat campaign: ' + errorMessage);
        setIsSaving(false);
      }
    } else {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Tombol Back */}
      <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="clean-card overflow-hidden min-h-[400px] relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: INPUT URL */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8 md:p-12"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Riset Produk Baru</h1>
                <p className="text-gray-500">Pilih metode riset untuk mendapatkan insight terbaik dari AI Affiliate Coach.</p>
              </div>

              {extractError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-3">
                  <div className="mt-0.5">⚠️</div>
                  <p>{extractError}</p>
                </div>
              )}

              {/* TABS */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button 
                  onClick={() => setInputMode('url_only')} 
                  className={cn("flex-1 py-2 text-sm font-semibold rounded-lg transition-colors", inputMode === 'url_only' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700")}
                >
                  1. Paste Link (Otomatis)
                </button>
                <button 
                  onClick={() => setInputMode('manual')} 
                  className={cn("flex-1 py-2 text-sm font-semibold rounded-lg transition-colors", inputMode === 'manual' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700")}
                >
                  2. Manual
                </button>
              </div>

              {inputMode === 'url_only' && (
                <form onSubmit={handleUrlExtract} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tautan Produk (TikTok Shop)</label>
                    <div className="relative">
                      <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        required
                        placeholder="https://shop-id.tokopedia.com/pdp/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Mendukung link dari TikTok Shop Global maupun Indonesia (Tokopedia).</p>
                  </div>
                  <div className="flex items-center justify-end pt-4">
                    <button type="submit" disabled={!url} className="btn-pill flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md">
                      <Sparkles className="w-4 h-4" /> Tarik Data Otomatis
                    </button>
                  </div>
                </form>
              )}

              {inputMode === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk</label>
                    <input type="text" required value={productData.productName} onChange={e => setProductData({...productData, productName: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium" placeholder="Contoh: Lampu Tidur RGB" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                      <select required value={PREDEFINED_CATEGORIES.includes(productData.category) || productData.category === '' ? productData.category : 'Lainnya'} onChange={e => {
                        if (e.target.value === 'Lainnya') {
                          setProductData({...productData, category: 'Lainnya '});
                        } else {
                          setProductData({...productData, category: e.target.value});
                        }
                      }} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium mb-2">
                        <option value="" disabled>Pilih Kategori...</option>
                        {PREDEFINED_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="Lainnya">Lainnya (Ketik Sendiri)</option>
                      </select>
                      {(!PREDEFINED_CATEGORIES.includes(productData.category) && productData.category !== '') && (
                        <input type="text" required value={productData.category === 'Lainnya ' ? '' : productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium animate-in fade-in slide-in-from-top-2" placeholder="Ketik kategori produk..." autoFocus />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Harga</label>
                      <input type="text" required value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium" placeholder="Rp..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Selling Points / USP</label>
                    <textarea rows={3} required value={productData.usp} onChange={e => setProductData({...productData, usp: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-medium resize-none" placeholder="Jelaskan kelebihan produk ini..." />
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <button type="submit" className="btn-pill flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors shadow-md">
                      Lanjutkan <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* STEP 2: AI ANALYZING SPINNER */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-16 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
            >
              <div className="relative mb-8">
                {/* Ping animation behind the icon */}
                <div className="absolute -inset-4 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI sedang bekerja...</h2>
              <p className="text-gray-500 max-w-sm mx-auto">Menyedot data produk dari TikTok Shop, mengekstrak metrik penjualan, dan menyusun strategi campaign untukmu.</p>
              
              <div className="w-64 h-2 bg-gray-100 rounded-full mt-8 overflow-hidden">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 45, ease: 'easeOut' }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
              <p className="text-xs font-medium text-blue-600 mt-4 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">Proses ini memakan waktu 1-2 menit. Jangan tutup halaman ini.</p>
            </motion.div>
          )}

          {/* STEP 3: REVIEW RESULTS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Analisis Selesai</h2>
                  <p className="text-sm text-gray-500">Berikut adalah hasil analisis AI. Kamu bisa menyimpannya jika skor memuaskan.</p>
                </div>
              </div>

              {analysisData && (
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="clean-card p-6 border border-gray-200 shadow-sm rounded-2xl bg-white">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" /> Detail Produk
                      </h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <span className="text-gray-500 block mb-1">Target Audience</span>
                          <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{analysisData.target_audience || 'Belum ada data target audience'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">Selling Points</span>
                          <ul className="list-disc list-inside space-y-1 text-gray-900 font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {analysisData.selling_points && analysisData.selling_points.length > 0 ? analysisData.selling_points.map((point: string, i: number) => <li key={i}>{point}</li>) : <li className="list-none text-gray-500">Belum ada data</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="clean-card p-6 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Opportunity Score</h3>
                        <OpportunityGauge score={analysisData.opportunity_score} size="md" />
                      </div>
                      
                      <div className="clean-card p-6 border border-gray-200 shadow-sm rounded-2xl bg-white">
                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-green-500" /> Analisis Cepat
                        </h3>
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                          <p className="text-sm font-medium text-gray-900 leading-relaxed">{analysisData.quick_analysis || 'Belum ada analisis cepat.'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="clean-card p-6 border border-gray-200 shadow-sm rounded-2xl bg-white">
                       <h3 className="text-base font-bold text-gray-900 mb-4">Pain Points</h3>
                       <ul className="space-y-3">
                         {analysisData.pain_points && analysisData.pain_points.length > 0 ? analysisData.pain_points.map((pp: string, i: number) => (
                           <li key={i} className="flex items-start gap-3 p-3 bg-red-50 text-red-900 text-sm font-medium rounded-xl border border-red-100">
                             <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">{i+1}</span>
                             {pp}
                           </li>
                         )) : <p className="text-sm text-gray-500 font-medium">Belum ada data pain points.</p>}
                       </ul>
                    </div>
                    
                    <div className="clean-card p-6 border border-gray-200 shadow-sm rounded-2xl bg-white">
                       <h3 className="text-base font-bold text-gray-900 mb-4">Emotion Triggers</h3>
                       <div className="flex flex-wrap gap-2">
                         {analysisData.emotion_triggers && analysisData.emotion_triggers.length > 0 ? analysisData.emotion_triggers.map((et: string) => (
                           <span key={et} className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm font-bold shadow-sm">
                             {et}
                           </span>
                         )) : <p className="text-sm text-gray-500 font-medium">Belum ada data emotion triggers.</p>}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Produk</label>
                    <input type="text" value={productData.productName} onChange={e => setProductData({...productData, productName: e.target.value})} className="w-full bg-transparent font-semibold text-gray-900 focus:outline-none border-b border-transparent focus:border-gray-300 pb-1" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kategori & Harga</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <select required value={PREDEFINED_CATEGORIES.includes(productData.category) || productData.category === '' ? productData.category : 'Lainnya'} onChange={e => {
                          if (e.target.value === 'Lainnya') {
                            setProductData({...productData, category: 'Lainnya '});
                          } else {
                            setProductData({...productData, category: e.target.value});
                          }
                        }} className="w-full bg-transparent font-semibold text-gray-900 focus:outline-none border-b border-transparent focus:border-gray-300 pb-1 appearance-none cursor-pointer">
                          <option value="" disabled>Pilih Kategori...</option>
                          {PREDEFINED_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="Lainnya">Lainnya (Ketik Sendiri)</option>
                        </select>
                        <span className="text-gray-300">•</span>
                        <input type="text" required value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} placeholder="Harga" className="w-full bg-transparent font-semibold text-green-600 focus:outline-none border-b border-transparent focus:border-green-300 pb-1" />
                      </div>
                      {(!PREDEFINED_CATEGORIES.includes(productData.category) && productData.category !== '') && (
                        <input type="text" required value={productData.category === 'Lainnya ' ? '' : productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="w-full bg-transparent font-semibold text-gray-900 focus:outline-none border-b border-transparent focus:border-gray-300 pb-1 mt-1 animate-in fade-in" placeholder="Ketik kategori produk..." autoFocus />
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Foto Produk (Opsional)</label>
                    <div className="flex items-center gap-4">
                      {productImageBase64 ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                          <img src={productImageBase64} alt="Product" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 text-gray-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <input type="file" accept="image/*" id="product-image" className="hidden" onChange={handleImageUpload} />
                        <label htmlFor="product-image" className="btn-pill inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                          {isCompressing ? 'Memproses...' : 'Upload Foto'}
                        </label>
                        <p className="text-xs text-gray-400 mt-2">Format JPG/PNG. Ukuran akan dikompres otomatis.</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Selling Points (USP)</label>
                    <textarea rows={2} value={productData.usp} onChange={e => setProductData({...productData, usp: e.target.value})} className="w-full bg-transparent text-sm text-gray-700 leading-relaxed focus:outline-none border-b border-transparent focus:border-gray-300 pb-1 resize-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setStep(1)} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                  <Trash2 className="w-4 h-4" /> Buang
                </button>
                <button onClick={handleSave} disabled={isSaving} className="btn-pill flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-md disabled:opacity-70 disabled:cursor-wait">
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <LayoutDashboard className="w-4 h-4" /> 
                  )}
                  {isSaving ? 'Menyimpan...' : 'Simpan ke Campaign'}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
