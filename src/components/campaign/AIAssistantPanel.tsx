'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Loader2, Target, FileText, Zap, Video, Image as ImageIcon, Hash } from 'lucide-react';
import { GeneratedContent } from '@/types';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  onGenerate: (content: GeneratedContent) => void;
  initialType?: string;
}

const CONTENT_TYPES = [
  { id: 'hook', label: 'Hook', icon: Target },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'caption', label: 'Caption', icon: FileText },
  { id: 'cta', label: 'CTA', icon: Zap },
  { id: 'video_idea', label: 'Ide Video', icon: Video },
  { id: 'hashtag', label: 'Hashtags', icon: Hash },
];

export function AIAssistantPanel({ isOpen, onClose, campaignId, onGenerate, initialType }: AIAssistantPanelProps) {
  const [selectedType, setSelectedType] = useState(initialType || 'hook');

  useEffect(() => {
    if (isOpen && initialType) {
      const isValidType = CONTENT_TYPES.some(t => t.id === initialType);
      if (isValidType) {
        setSelectedType(initialType);
      }
    }
  }, [isOpen, initialType]);

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const supabase = createClient();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          type: selectedType,
          prompt,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newContent: GeneratedContent = {
          id: `gc-new-${Date.now()}`,
          campaignId,
          type: selectedType as GeneratedContent['type'],
          title: selectedType === 'script' || selectedType === 'video_idea' ? 'Generated AI Content' : undefined,
          content: data.result,
          favorite: false,
          archived: false,
          aiModel: 'gemini-1.5-flash',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setResult(newContent);
      } else {
        console.error('Failed to generate content:', data.error);
        alert('Gagal menghasilkan konten: ' + data.error);
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      alert('Terjadi kesalahan saat menghubungi AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (result) {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('generated_contents').insert({
          campaign_id: campaignId,
          user_id: user.id,
          type: result.type,
          title: result.title,
          content: result.content,
          format: result.format,
          visual_concept: result.visualConcept,
          emotion: result.emotion,
          favorite: result.favorite,
          archived: result.archived,
          ai_model: result.aiModel
        }).select().single();

        if (data) {
          const savedContent: GeneratedContent = {
            id: data.id,
            campaignId: data.campaign_id,
            type: data.type,
            title: data.title || undefined,
            content: data.content,
            format: data.format || undefined,
            visualConcept: data.visual_concept || undefined,
            emotion: data.emotion || undefined,
            favorite: data.favorite,
            archived: data.archived,
            aiModel: data.ai_model,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          onGenerate(savedContent);
        } else {
          console.error("Error saving content:", error);
        }
      }
      setIsSaving(false);
      setResult(null);
      setPrompt('');
      onClose(); // Auto close after save
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 transition-opacity"
          />
          
          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-gray-100 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">AI Assistant</h2>
                  <p className="text-xs text-gray-500">Buat konten dalam hitungan detik</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Pilih Jenis Konten
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                          isSelected 
                            ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Input Prompt */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Instruksi Khusus (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Buatkan dengan gaya bahasa yang santai dan sebutkan diskon 50%..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium resize-none transition-all"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-md shadow-blue-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menganalisis Data...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Mulai Generate
                  </>
                )}
              </button>

              {/* Result Area */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Hasil Generate
                      </label>
                      <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Berhasil
                      </span>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-4">
                      {result.title && <h4 className="font-bold text-gray-900 mb-2">{result.title}</h4>}
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.content}</p>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {isSaving ? 'Menyimpan...' : 'Simpan ke Campaign'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
