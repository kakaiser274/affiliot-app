'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockUser, mockCampaigns, mockContents } from '@/lib/mock-data';
import { 
  Send, Sparkles, Bot, User, Paperclip, Check, ChevronDown, 
  MessageSquarePlus, Copy, RefreshCw, BookmarkPlus, X, PenLine, Wand2, Info, MessageSquare
} from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import ReactMarkdown from 'react-markdown';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import type { GeneratedContent } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  created_at: string;
};

const quickActions = [
  "Buatkan hook 3 detik",
  "Tulis ulang caption ini",
  "Beri ide thumbnail",
  "Analisis kompetitor",
  "Buat jadwal konten",
  "Perbaiki script ini"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState<string>('general');
  const [attachedContent, setAttachedContent] = useState<GeneratedContent | null>(null);
  
  // Chat History States
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const userId = user?.id || null;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const activeCampaignName = activeCampaignId === 'general' 
    ? 'General Workspace' 
    : mockCampaigns.find(c => c.id === activeCampaignId)?.productName || 'General Workspace';

  const campaignContents = activeCampaignId === 'general' 
    ? mockContents.slice(0, 5)
    : mockContents.filter(c => c.campaignId === activeCampaignId);

  // Load User and Chat Sessions on Mount
  useEffect(() => {
    const loadInitialData = async () => {
      if (userId) {
        const { data: sessionData } = await supabase
          .from('ai_chat_sessions')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (sessionData) {
          setSessions(sessionData);
        }
      } else {
        setSessions([]);
        setActiveSessionId(null);
      }
    };
    loadInitialData();
  }, [userId]);

  // Load Messages when a session is selected
  const loadSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setAttachedContent(null);
    setIsLoading(true);
    
    const { data } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
      
    if (data) {
      setMessages(data.map(m => ({ id: m.id, role: m.role as any, content: m.content })));
    } else {
      setMessages([]);
    }
    setIsLoading(false);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setAttachedContent(null);
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string, actionType?: 'rewrite' | 'improve' | 'explain') => {
    if (!text.trim() && !actionType && !attachedContent) return;

    let finalPrompt = text;
    if (attachedContent && actionType) {
      if (actionType === 'rewrite') {
        finalPrompt = `Tolong tulis ulang konten ini dengan gaya yang berbeda:\n\n"${attachedContent.content}"`;
      } else if (actionType === 'improve') {
        finalPrompt = `Tolong perbaiki konten ini agar lebih menarik dan profesional:\n\n"${attachedContent.content}"`;
      } else if (actionType === 'explain') {
        finalPrompt = `Tolong jelaskan mengapa konten ini bagus dan apa strategi di baliknya:\n\n"${attachedContent.content}"`;
      }
    } else if (attachedContent && text) {
       finalPrompt = `Berdasarkan referensi konten berikut:\n"${attachedContent.content}"\n\nInstruksi: ${text}`;
    }

    // 1. Setup Session ID
    let currentSessionId = activeSessionId;
    
    if (!currentSessionId && userId) {
      const title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      const { data: newSession } = await supabase
        .from('ai_chat_sessions')
        .insert({ user_id: userId, title })
        .select()
        .single();
        
      if (newSession) {
        currentSessionId = newSession.id;
        setActiveSessionId(currentSessionId);
        setSessions(prev => [newSession, ...prev]);
      }
    }

    // 2. Optimistic UI Update for User Message
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: finalPrompt };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setAttachedContent(null);
    setIsLoading(true);

    // 3. Save User Message to Supabase
    if (currentSessionId && userId) {
      await supabase.from('ai_messages').insert({
        session_id: currentSessionId,
        user_id: userId,
        role: 'user',
        content: finalPrompt
      });
      await supabase.from('ai_chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', currentSessionId);
    }

    // 4. Call AI API
    try {
      const apiMessages = [...messages, newUserMsg].map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: AbortSignal.timeout(60000) // 1 minute timeout to prevent indefinite hang
      });

      if (!res.ok) throw new Error('API Error');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

      let fullAiResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullAiResponse += chunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }

      // 5. Save AI Response to Supabase
      if (currentSessionId && userId && fullAiResponse) {
        await supabase.from('ai_messages').insert({
          session_id: currentSessionId,
          user_id: userId,
          role: 'assistant',
          content: fullAiResponse
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      // Tampilkan pesan error ramah jika API Google sedang overload atau gagal
      setMessages(prev => [...prev, { 
        id: (Date.now() + 2).toString(), 
        role: 'assistant', 
        content: 'Maaf, server AI saat ini sedang sangat sibuk atau penuh. Mohon berikan saya waktu istirahat 1-2 menit, lalu coba kirim pesan Anda lagi ya! 🙇‍♂️' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex clean-card overflow-hidden">
      
      {/* LEFT SIDEBAR: Chat History */}
      <div className="w-64 border-r border-gray-100 flex flex-col bg-gray-50/30 shrink-0">
        <div className="p-4 border-b border-gray-100 shrink-0 bg-white">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4" /> Chat Baru
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Riwayat Obrolan</p>
          
          {loading ? (
             <div className="text-center text-sm text-gray-400 p-4 font-medium">Memuat...</div>
          ) : !userId ? (
            <div className="text-center p-4 bg-blue-50/50 rounded-xl border border-blue-100 mt-2 mx-1">
              <p className="text-xs font-semibold text-blue-800 mb-3">Login untuk menyimpan riwayat chat Anda</p>
              <Link href="/login" className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors inline-block shadow-sm">
                Login Sekarang
              </Link>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-sm text-gray-400 p-4 font-medium">Belum ada riwayat.</div>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl text-sm transition-colors flex items-center gap-3 group",
                  activeSessionId === session.id 
                    ? "bg-blue-100 text-blue-700 font-bold" 
                    : "hover:bg-gray-100 text-gray-600 font-medium"
                )}
              >
                <MessageSquare className={cn(
                  "w-4 h-4 shrink-0", 
                  activeSessionId === session.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span className="truncate flex-1">{session.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Active Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                Affiliot AI
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">ONLINE</span>
              </h2>
              <p className="text-xs text-gray-500">Asisten konten pintar kamu</p>
            </div>
          </div>

          {/* Campaign Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-900 transition-colors outline-none">
              <span className="truncate max-w-[150px]">{activeCampaignName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-100 shadow-xl rounded-2xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pilih Konteks</DropdownMenuLabel>
                <DropdownMenuItem 
                  className={cn("font-medium rounded-xl mb-1 cursor-pointer", activeCampaignId === 'general' && 'bg-blue-50 text-blue-700')}
                  onClick={() => setActiveCampaignId('general')}
                >
                  General Workspace
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Aktif</DropdownMenuLabel>
                {mockCampaigns.map(camp => (
                  <DropdownMenuItem 
                    key={camp.id}
                    className={cn("font-medium rounded-xl cursor-pointer", activeCampaignId === camp.id && 'bg-blue-50 text-blue-700')}
                    onClick={() => setActiveCampaignId(camp.id)}
                  >
                    <span className="truncate">{camp.productName}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Guest Warning Banner */}
        {!loading && !userId && (
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 flex items-center justify-between shrink-0">
            <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Anda masuk sebagai Tamu. Chat ini akan hilang jika Anda menutup halaman.</span>
            </p>
            <Link href="/login" className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-full transition-colors">
              Login untuk Menyimpan
            </Link>
          </div>
        )}

        {/* Chat Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50/50 relative"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <EmptyState
                icon={Sparkles}
                title="Mulai Sesi Kreatif"
                description={`Saya siap membantu membuat konten untuk ${activeCampaignName}. Pilih aksi cepat atau ketik sendiri idemu.`}
                className="border-none shadow-none bg-transparent"
              />
              <div className="mt-8 max-w-2xl w-full grid grid-cols-2 md:grid-cols-3 gap-3 px-4">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action)}
                    className="p-3 text-left text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm hover:text-blue-700 transition-all group"
                  >
                    <span className="text-blue-600 mr-2 group-hover:scale-110 transition-transform inline-block">✦</span>
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border",
                      msg.role === 'user' 
                        ? "bg-gray-900 border-gray-800 text-white" 
                        : "bg-blue-100 border-blue-200 text-blue-600"
                    )}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>

                    {/* Message Content */}
                    <div className={cn(
                      "group flex flex-col gap-2 max-w-[80%]",
                      msg.role === 'user' ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "p-4 shadow-sm text-sm",
                        msg.role === 'user' 
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm font-medium whitespace-pre-wrap leading-relaxed" 
                          : "bg-white border border-gray-100 text-gray-900 rounded-2xl rounded-tl-sm"
                      )}>
                        {msg.role === 'user' ? (
                          msg.content
                        ) : (
                          <div className="flex flex-col gap-3 font-medium">
                            <ReactMarkdown 
                              components={{
                                p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold text-blue-700" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5 flex flex-col gap-1.5" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5 flex flex-col gap-1.5" {...props} />,
                                li: ({node, ...props}) => <li className="pl-1" {...props} />
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      
                      {/* Message Actions */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Salin">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Simpan ke Campaign">
                            <BookmarkPlus className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Regenerate">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 flex-row"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                    <motion.div className="w-2 h-2 bg-blue-600 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-blue-600 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-blue-600 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0 flex flex-col gap-3">
          
          {/* Attached Content Indicator */}
          <AnimatePresence>
            {attachedContent && (
              <motion.div 
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                className="max-w-4xl mx-auto w-full"
              >
                <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 p-3 rounded-xl relative group">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-0.5">{attachedContent.type}</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{attachedContent.content}</p>
                  </div>
                  <button 
                    onClick={() => setAttachedContent(null)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Action Buttons for Attached Content */}
                <div className="flex gap-2 mt-2 ml-11">
                  <button 
                    onClick={() => handleSend('', 'rewrite')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 rounded-lg text-xs font-semibold text-gray-600 transition-colors shadow-sm"
                  >
                    <PenLine className="w-3.5 h-3.5" /> Tulis Ulang
                  </button>
                  <button 
                    onClick={() => handleSend('', 'improve')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-green-400 hover:text-green-600 rounded-lg text-xs font-semibold text-gray-600 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Perbaiki
                  </button>
                  <button 
                    onClick={() => handleSend('', 'explain')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600 rounded-lg text-xs font-semibold text-gray-600 transition-colors shadow-sm"
                  >
                    <Info className="w-3.5 h-3.5" /> Jelaskan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-4xl mx-auto w-full relative flex items-end gap-2">
            {/* Attachment Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors shrink-0 mb-1 outline-none">
                <Paperclip className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 bg-white border border-gray-100 shadow-xl rounded-2xl mb-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 pt-2">
                    Pilih Konten dari Campaign
                  </DropdownMenuLabel>
                  <div className="max-h-[300px] overflow-y-auto p-1 no-scrollbar">
                    {campaignContents.length > 0 ? (
                      campaignContents.map(content => (
                        <DropdownMenuItem 
                          key={content.id}
                          onClick={() => setAttachedContent(content)}
                          className="flex flex-col items-start gap-1 p-2 rounded-xl cursor-pointer hover:bg-blue-50 group"
                        >
                          <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-500 uppercase tracking-wider">{content.type}</span>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 line-clamp-2">{content.content}</span>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500 font-medium">
                        Belum ada konten di campaign ini.
                      </div>
                    )}
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-3xl relative focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder={attachedContent ? "Ketik instruksi tambahan..." : "Ketik instruksi untuk AI... (Shift+Enter untuk baris baru)"}
                className="w-full max-h-32 min-h-[52px] bg-transparent border-none resize-none py-3.5 pl-5 pr-12 text-sm text-gray-900 focus:outline-none focus:ring-0 placeholder:text-gray-400 font-medium"
                rows={1}
              />
            </div>

            <button
              onClick={() => handleSend(input)}
              disabled={(!input.trim() && !attachedContent) || isLoading}
              className="w-12 h-12 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-sm mb-0.5"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
          
          <p className="text-center text-[10px] text-gray-400 font-medium mt-1">
            AI dapat melakukan kesalahan. Selalu periksa kembali konten sebelum diunggah.
          </p>
        </div>
      </div>
    </div>
  );
}
