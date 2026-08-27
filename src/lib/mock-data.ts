// ============================================================
// Affiliot — Data Mock Realistis (Bahasa Indonesia)
// ============================================================

import type {
  User,
  UserPreferences,
  Campaign,
  ProductAnalysis,
  GeneratedContent,
  ScheduleItem,
  Goals,
  CoachRecommendation,
  TodayTask,
  ChatSession,
  ChatMessage,
  CampaignHistoryItem,
  CampaignNote,
} from '@/types';

// ---- USER ----
export const mockUser: User = {
  id: 'usr-001',
  email: 'rina.affiliate@gmail.com',
  fullName: 'Rina Amelia',
  avatarUrl: '',
  timezone: 'Asia/Jakarta',
  createdAt: '2026-06-01T08:00:00Z',
};

export const mockPreferences: UserPreferences = {
  preferredAiProvider: 'openai',
  language: 'id',
  dailyGoal: 2,
  weeklyGoal: 10,
  monthlyGoal: 40,
  notificationEnabled: true,
  calendarConnected: true,
};

// ---- CAMPAIGNS ----
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    userId: 'usr-001',
    productName: 'Portable Blender MixGo',
    productImage: '',
    tiktokShopUrl: 'https://tiktok.com/shop/portable-blender-mixgo',
    status: 'active',
    opportunityScore: 85,
    contentCount: 24,
    progress: 72,
    nextSchedule: '2026-07-26T19:00:00+07:00',
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-07-25T12:00:00Z',
  },
  {
    id: 'camp-002',
    userId: 'usr-001',
    productName: 'LED Ring Light 10 Inch',
    productImage: '',
    tiktokShopUrl: 'https://tiktok.com/shop/led-ring-light-10',
    status: 'active',
    opportunityScore: 72,
    contentCount: 18,
    progress: 55,
    nextSchedule: '2026-07-27T18:00:00+07:00',
    createdAt: '2026-07-12T10:00:00Z',
    updatedAt: '2026-07-24T15:00:00Z',
  },
  {
    id: 'camp-003',
    userId: 'usr-001',
    productName: 'Mini Wireless Earbuds Pro',
    productImage: '',
    tiktokShopUrl: 'https://tiktok.com/shop/mini-wireless-earbuds',
    status: 'draft',
    opportunityScore: 64,
    contentCount: 8,
    progress: 25,
    createdAt: '2026-07-18T09:00:00Z',
    updatedAt: '2026-07-22T11:00:00Z',
  },
  {
    id: 'camp-004',
    userId: 'usr-001',
    productName: 'Skincare Set Glow Up',
    productImage: '',
    tiktokShopUrl: 'https://tiktok.com/shop/skincare-glow-up',
    status: 'completed',
    opportunityScore: 91,
    contentCount: 35,
    progress: 100,
    createdAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-07-15T16:00:00Z',
  },
  {
    id: 'camp-005',
    userId: 'usr-001',
    productName: 'Tas Laptop Anti Air SlimPack',
    productImage: '',
    tiktokShopUrl: 'https://tiktok.com/shop/tas-laptop-slimpack',
    status: 'archived',
    opportunityScore: 45,
    contentCount: 12,
    progress: 60,
    createdAt: '2026-05-20T08:00:00Z',
    updatedAt: '2026-06-30T10:00:00Z',
    archivedAt: '2026-07-01T08:00:00Z',
  },
];

// ---- PRODUCT ANALYSIS ----
export const mockProductAnalysis: Record<string, ProductAnalysis> = {
  'camp-001': {
    id: 'pa-001',
    campaignId: 'camp-001',
    audience: ['Mahasiswa', 'Pekerja Kantoran', 'Pecinta Fitness', 'Ibu Rumah Tangga'],
    painPoints: [
      'Tidak punya waktu membuat jus di rumah',
      'Blender biasa terlalu besar untuk dibawa',
      'Butuh minuman sehat saat di kantor',
      'Malas mencuci blender besar',
      'Sering beli jus mahal di luar',
    ],
    usp: 'Blender portable USB-C yang bisa membuat jus segar dalam 30 detik, bisa dicuci langsung dan dibawa ke mana saja',
    sellingAngle: 'Problem → Solution',
    emotionTrigger: ['Convenience', 'Fear of Missing Out', 'Happiness'],
    positioning: 'Blender portable terbaik untuk gaya hidup aktif dan sehat di mana saja',
    contentDifficulty: 'easy',
    swot: {
      strengths: ['Harga terjangkau', 'Mudah digunakan', 'Portable', 'Desain menarik'],
      weaknesses: ['Kapasitas kecil', 'Tidak bisa menghancurkan es batu besar'],
      opportunities: ['Tren hidup sehat meningkat', 'Banyak konten kreator butuh konten review'],
      threats: ['Banyak kompetitor sejenis', 'Produk mudah ditiru'],
    },
    recommendation: 'highly_recommended',
    recommendationReason: 'Produk ini memiliki permintaan tinggi, mudah didemonstrasikan dalam video pendek, dan margin komisi yang menarik. Sangat cocok untuk konten Before-After dan Demo.',
    createdAt: '2026-07-10T08:30:00Z',
  },
  'camp-002': {
    id: 'pa-002',
    campaignId: 'camp-002',
    audience: ['Content Creator', 'Beauty Enthusiast', 'Penjual Online', 'Mahasiswa'],
    painPoints: [
      'Pencahayaan buruk saat bikin konten',
      'Lampu ring light besar tidak portable',
      'Hasil video kurang profesional',
      'Budget terbatas untuk setup studio',
    ],
    usp: 'Ring light 10 inch dengan 3 mode warna dan 10 level kecerahan, dilengkapi tripod dan holder HP',
    sellingAngle: 'Before → After',
    emotionTrigger: ['Social Proof', 'Curiosity', 'Surprise'],
    positioning: 'Solusi pencahayaan terjangkau untuk konten kreator pemula yang ingin hasil profesional',
    contentDifficulty: 'easy',
    swot: {
      strengths: ['All-in-one package', 'Harga kompetitif', 'Mudah di-setup'],
      weaknesses: ['Kualitas tripod standar', 'Tidak ada remote bluetooth'],
      opportunities: ['Pertumbuhan konten kreator TikTok', 'Banyak pemula butuh setup murah'],
      threats: ['Produk serupa banyak beredar', 'Harga perang antar seller'],
    },
    recommendation: 'recommended',
    recommendationReason: 'Produk populer dengan demand konsisten. Konten Before-After sangat efektif untuk menunjukkan perbedaan kualitas video.',
    createdAt: '2026-07-12T10:30:00Z',
  },
};

// ---- GENERATED CONTENT ----
export const mockContents: GeneratedContent[] = [
  // Hooks - Campaign Blender
  {
    id: 'gc-001', campaignId: 'camp-001', type: 'hook',
    content: 'Stop beli jus Rp 25rb setiap hari! Ada cara yang lebih hemat dan sehat...',
    emotion: 'Curiosity', favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-11T09:00:00Z', updatedAt: '2026-07-11T09:00:00Z',
  },
  {
    id: 'gc-002', campaignId: 'camp-001', type: 'hook',
    content: 'Ternyata bikin jus segar cuma butuh 30 detik! Tanpa ribet, tanpa berantakan.',
    emotion: 'Surprise', favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-11T09:00:00Z', updatedAt: '2026-07-11T09:00:00Z',
  },
  {
    id: 'gc-003', campaignId: 'camp-001', type: 'hook',
    content: 'Blender ini muat di tas! Serius, coba lihat ukurannya...',
    emotion: 'Curiosity', favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-11T09:00:00Z', updatedAt: '2026-07-11T09:00:00Z',
  },
  {
    id: 'gc-004', campaignId: 'camp-001', type: 'hook',
    content: 'Teman kantor heran kenapa aku selalu bawa jus sendiri. Rahasianya cuma ini 👇',
    emotion: 'Social Proof', favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-12T10:00:00Z', updatedAt: '2026-07-12T10:00:00Z',
  },
  {
    id: 'gc-005', campaignId: 'camp-001', type: 'hook',
    content: 'Jangan beli blender portable sebelum nonton ini sampai habis!',
    emotion: 'Fear of Missing Out', favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-12T10:00:00Z', updatedAt: '2026-07-12T10:00:00Z',
  },
  // Scripts - Campaign Blender
  {
    id: 'gc-006', campaignId: 'camp-001', type: 'script',
    title: 'Script Demo 30 Detik',
    content: `[HOOK] Tau gak sih, bikin jus segar itu cuma butuh 30 detik?

[BODY] Jadi ini namanya MixGo Portable Blender. Caranya gampang banget:
1. Masukin buah potong ke dalamnya
2. Tambahin air atau susu
3. Tekan tombol, tunggu 30 detik
4. Jus segar siap diminum!

Yang bikin aku suka, bisa di-charge pake USB-C, jadi bisa bikin jus di mana aja. Di kantor, di kampus, bahkan di mobil.

[CTA] Klik keranjang kuning sekarang, harganya lagi promo cuma Rp 89.000!`,
    favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-13T11:00:00Z', updatedAt: '2026-07-13T11:00:00Z',
  },
  {
    id: 'gc-007', campaignId: 'camp-001', type: 'script',
    title: 'Script Storytelling - Hemat Jajan',
    content: `[HOOK] Dulu aku habis Rp 750rb per bulan cuma buat beli jus...

[BODY] Serius, setiap hari beli jus Rp 25rb. Sebulan udah Rp 750rb. Terus temen kasih tau soal blender portable ini.

Awalnya ragu, masa iya blender sekecil ini bisa beneran works? Ternyata... BISA! Hasilnya halus, rasanya fresh, dan yang paling penting: HEMAT.

Sekarang sebulan cuma keluar Rp 200rb buat buah. Hemat Rp 550rb!

[CTA] Link ada di keranjang kuning. Harga lagi diskon, jangan sampai kehabisan!`,
    favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-13T11:00:00Z', updatedAt: '2026-07-13T11:00:00Z',
  },
  // Captions - Campaign Blender
  {
    id: 'gc-008', campaignId: 'camp-001', type: 'caption',
    content: 'Jus segar 30 detik? Bisa banget! 🍹 Blender portable ini game changer banget buat kalian yang sibuk tapi tetap mau hidup sehat. Harga lagi promo, cek keranjang kuning! 👇 #BlenderPortable #HidupSehat #TikTokMadeMeBuyIt',
    favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T08:00:00Z', updatedAt: '2026-07-14T08:00:00Z',
  },
  {
    id: 'gc-009', campaignId: 'camp-001', type: 'caption',
    content: 'Bye bye jus mahal! 👋 Sekarang bikin sendiri aja, cuma 30 detik dan bisa di mana aja. USB-C rechargeable, tinggal charge kayak HP. Mau? Klik keranjang kuning! 🛒✨',
    favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T08:00:00Z', updatedAt: '2026-07-14T08:00:00Z',
  },
  // CTAs
  {
    id: 'gc-010', campaignId: 'camp-001', type: 'cta',
    content: 'Klik keranjang kuning sekarang sebelum promonya habis! 🛒',
    favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T09:00:00Z', updatedAt: '2026-07-14T09:00:00Z',
  },
  {
    id: 'gc-011', campaignId: 'camp-001', type: 'cta',
    content: 'Jangan cuma nonton, langsung checkout! Link di keranjang kuning 👇',
    favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T09:00:00Z', updatedAt: '2026-07-14T09:00:00Z',
  },
  {
    id: 'gc-012', campaignId: 'camp-001', type: 'cta',
    content: 'Stok terbatas! Checkout sekarang sebelum kehabisan. Link di bio! 🔥',
    favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T09:00:00Z', updatedAt: '2026-07-14T09:00:00Z',
  },
  // Hashtags
  {
    id: 'gc-013', campaignId: 'camp-001', type: 'hashtag',
    title: 'Set A - Umum',
    content: '#BlenderPortable #JusSehat #HidupSehat #TikTokMadeMeBuyIt #RekomendasiTikTok #ViralProduct',
    favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z',
  },
  {
    id: 'gc-014', campaignId: 'camp-001', type: 'hashtag',
    title: 'Set B - Lifestyle',
    content: '#GayaHidupSehat #JusBuah #MinumanSehat #HealthyLifestyle #PortableBlender #MixGo',
    favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z',
  },
  {
    id: 'gc-015', campaignId: 'camp-001', type: 'hashtag',
    title: 'Set C - Promo',
    content: '#PromoTikTok #DiskonBesar #FlashSale #BelanjaHemat #TikTokShop #AffiliateIndonesia',
    favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z',
  },
  // First Comments
  {
    id: 'gc-016', campaignId: 'camp-001', type: 'first_comment',
    content: 'Yang mau tanya-tanya soal blender ini, langsung comment aja ya! Aku jawab satu-satu 💬',
    favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-15T08:00:00Z', updatedAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 'gc-017', campaignId: 'camp-001', type: 'first_comment',
    content: 'UPDATE: Stok tinggal sedikit! Yang kemarin nanya, buruan checkout sebelum kehabisan 🏃‍♀️',
    favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-15T08:00:00Z', updatedAt: '2026-07-15T08:00:00Z',
  },
  // Video Ideas
  {
    id: 'gc-018', campaignId: 'camp-001', type: 'video_idea',
    title: 'Demo Bikin Jus di Kantor',
    content: 'Rekam proses bikin jus di meja kantor. Mulai dari bawa blender dari tas, potong buah, blend, minum. Reaksi teman kantor yang kaget.',
    format: 'Demo', favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-15T10:00:00Z', updatedAt: '2026-07-15T10:00:00Z',
  },
  {
    id: 'gc-019', campaignId: 'camp-001', type: 'video_idea',
    title: 'Before After: Pengeluaran Jus',
    content: 'Split screen: kiri menunjukkan struk pembelian jus Rp 25rb x 30 hari, kanan menunjukkan buah segar + blender portable. Total penghematan per bulan.',
    format: 'Before After', favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-15T10:00:00Z', updatedAt: '2026-07-15T10:00:00Z',
  },
  {
    id: 'gc-020', campaignId: 'camp-001', type: 'video_idea',
    title: 'POV: Anak Kost Hemat',
    content: 'POV kamu anak kost yang selalu bawa bekal jus sendiri. Teman-teman heran kenapa kamu selalu punya jus fresh. Reveal: blender portable di dalam tas.',
    format: 'POV', favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-15T10:00:00Z', updatedAt: '2026-07-15T10:00:00Z',
  },
  // Thumbnail Ideas
  {
    id: 'gc-021', campaignId: 'camp-001', type: 'thumbnail_idea',
    title: 'Ekspresi Kaget + Jus',
    content: 'Wajah terkejut memegang blender portable dengan jus berwarna-warni. Teks besar: "30 DETIK?!"',
    visualConcept: 'Close-up wajah + produk, background warna cerah', emotion: 'Surprise',
    favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-16T08:00:00Z', updatedAt: '2026-07-16T08:00:00Z',
  },
  {
    id: 'gc-022', campaignId: 'camp-001', type: 'thumbnail_idea',
    title: 'Perbandingan Harga',
    content: 'Split layout: kiri Rp 750rb/bulan (jus beli), kanan Rp 200rb/bulan (jus bikin sendiri). Panah menunjuk blender portable.',
    visualConcept: 'Split screen dengan warna kontras merah vs hijau', emotion: 'Fear of Missing Out',
    favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-16T08:00:00Z', updatedAt: '2026-07-16T08:00:00Z',
  },
  // --- Campaign 2 content ---
  {
    id: 'gc-023', campaignId: 'camp-002', type: 'hook',
    content: 'Video kamu jelek bukan karena HP-nya, tapi karena cahayanya! ☀️',
    emotion: 'Curiosity', favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-13T09:00:00Z', updatedAt: '2026-07-13T09:00:00Z',
  },
  {
    id: 'gc-024', campaignId: 'camp-002', type: 'hook',
    content: 'Rahasia video TikTok yang jernih dan aesthetic? Bukan kamera mahal, tapi ini...',
    emotion: 'Curiosity', favorite: false, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-13T09:00:00Z', updatedAt: '2026-07-13T09:00:00Z',
  },
  {
    id: 'gc-025', campaignId: 'camp-002', type: 'script',
    title: 'Script Before-After Pencahayaan',
    content: `[HOOK] Mau tau kenapa video aku sekarang jauh lebih jernih?

[BODY] Dulu video aku selalu gelap dan grainy. Udah coba segala cara, edit pakai filter, naikin brightness... tetap jelek.

Ternyata masalahnya bukan di HP atau di editing, tapi di PENCAHAYAAN.

Sejak pakai ring light ini, hasilnya beda banget! 3 mode warna, 10 level kecerahan, dan udah include tripod + holder HP.

[CTA] Harga cuma Rp 65.000. Serius, ini investasi terbaik buat konten kreator. Klik keranjang kuning! 🛒`,
    favorite: true, archived: false, aiModel: 'gpt-4o',
    createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z',
  },
];

// ---- SCHEDULES ----
export const mockSchedules: ScheduleItem[] = [
  {
    id: 'sch-001', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Upload Video Demo Blender', scheduleAt: '2026-07-26T19:00:00+07:00',
    status: 'pending', eventType: 'upload', createdAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'sch-002', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Balas Komentar Video Blender', scheduleAt: '2026-07-26T20:00:00+07:00',
    status: 'pending', eventType: 'reminder', createdAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'sch-003', campaignId: 'camp-002', campaignName: 'LED Ring Light 10 Inch',
    title: 'Upload Video Before-After Ring Light', scheduleAt: '2026-07-27T18:00:00+07:00',
    status: 'pending', eventType: 'upload', createdAt: '2026-07-21T09:00:00Z',
  },
  {
    id: 'sch-004', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Generate Caption Baru', scheduleAt: '2026-07-27T10:00:00+07:00',
    status: 'pending', eventType: 'generate', createdAt: '2026-07-22T08:00:00Z',
  },
  {
    id: 'sch-005', campaignId: 'camp-003', campaignName: 'Mini Wireless Earbuds Pro',
    title: 'Review Campaign Earbuds', scheduleAt: '2026-07-28T14:00:00+07:00',
    status: 'pending', eventType: 'review', createdAt: '2026-07-22T08:00:00Z',
  },
  {
    id: 'sch-006', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Upload Video POV Anak Kost', scheduleAt: '2026-07-28T19:00:00+07:00',
    status: 'pending', eventType: 'upload', createdAt: '2026-07-23T09:00:00Z',
  },
  {
    id: 'sch-007', campaignId: 'camp-002', campaignName: 'LED Ring Light 10 Inch',
    title: 'Deadline: Selesaikan Script Baru', scheduleAt: '2026-07-29T17:00:00+07:00',
    status: 'pending', eventType: 'deadline', createdAt: '2026-07-23T09:00:00Z',
  },
  {
    id: 'sch-008', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Upload Video Storytelling', scheduleAt: '2026-07-25T19:00:00+07:00',
    status: 'completed', eventType: 'upload', createdAt: '2026-07-19T08:00:00Z',
  },
  {
    id: 'sch-009', campaignId: 'camp-002', campaignName: 'LED Ring Light 10 Inch',
    title: 'Upload Video Unboxing', scheduleAt: '2026-07-24T18:00:00+07:00',
    status: 'completed', eventType: 'upload', createdAt: '2026-07-18T08:00:00Z',
  },
  {
    id: 'sch-010', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Upload Video Review Jujur', scheduleAt: '2026-07-23T19:00:00+07:00',
    status: 'missed', eventType: 'upload', createdAt: '2026-07-17T08:00:00Z',
  },
];

// ---- GOALS ----
export const mockGoals: Goals = {
  id: 'goal-001',
  userId: 'usr-001',
  weeklyTarget: 10,
  monthlyTarget: 40,
  weeklyProgress: 6,
  monthlyProgress: 25,
  streak: 12,
  updatedAt: '2026-07-25T20:00:00Z',
};

// ---- AI COACH ----
export const mockCoachRecommendations: CoachRecommendation[] = [
  {
    id: 'cr-001', userId: 'usr-001', priority: 1,
    recommendation: 'Upload video Campaign Blender hari ini pukul 19:00. Audience paling aktif di jam tersebut.',
    icon: '🎯',
    validUntil: '2026-07-26T23:59:59Z', createdAt: '2026-07-26T06:00:00Z',
  },
  {
    id: 'cr-002', userId: 'usr-001', priority: 2,
    recommendation: 'Gunakan Hook #3 untuk video berikutnya. Hook ini memiliki potensi engagement paling tinggi.',
    icon: '💡',
    validUntil: '2026-07-26T23:59:59Z', createdAt: '2026-07-26T06:00:00Z',
  },
  {
    id: 'cr-003', userId: 'usr-001', priority: 3,
    recommendation: 'Campaign Ring Light perlu 2 video lagi minggu ini untuk mencapai target.',
    icon: '📊',
    validUntil: '2026-07-26T23:59:59Z', createdAt: '2026-07-26T06:00:00Z',
  },
];

// ---- TODAY'S TASKS ----
export const mockTodayTasks: TodayTask[] = [
  {
    id: 'tt-001', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Upload Video Demo Blender', status: 'pending', dueTime: '19:00',
  },
  {
    id: 'tt-002', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Balas Komentar Video Kemarin', status: 'pending', dueTime: '20:00',
  },
  {
    id: 'tt-003', campaignId: 'camp-002', campaignName: 'LED Ring Light 10 Inch',
    title: 'Generate Caption Produk Ring Light', status: 'completed',
  },
  {
    id: 'tt-004', campaignId: 'camp-003', campaignName: 'Mini Wireless Earbuds Pro',
    title: 'Review Campaign Earbuds', status: 'pending', dueTime: '14:00',
  },
];

// ---- CHAT ----
export const mockChatSessions: ChatSession[] = [
  {
    id: 'cs-001', campaignId: 'camp-001', campaignName: 'Portable Blender MixGo',
    title: 'Perbaiki Caption Blender',
    lastMessage: 'Caption sudah diperbaiki dengan tone yang lebih engaging.',
    createdAt: '2026-07-24T14:00:00Z',
  },
  {
    id: 'cs-002', campaignId: 'camp-002', campaignName: 'LED Ring Light 10 Inch',
    title: 'Brainstorm Angle Baru',
    lastMessage: 'Coba angle "Setup Studio Murah" untuk menarik audience pemula.',
    createdAt: '2026-07-23T10:00:00Z',
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'cm-001', sessionId: 'cs-001', role: 'user',
    message: 'Tolong perbaiki caption ini agar lebih engaging: "Blender portable bagus, beli sekarang"',
    createdAt: '2026-07-24T14:00:00Z',
  },
  {
    id: 'cm-002', sessionId: 'cs-001', role: 'assistant',
    message: 'Berikut caption yang sudah diperbaiki:\n\n"Jus segar 30 detik? Bisa banget! 🍹 Blender portable ini game changer buat kalian yang sibuk tapi tetap mau hidup sehat. Harga lagi promo, cek keranjang kuning! 👇"\n\nPerubahan yang dilakukan:\n- Menambahkan hook di awal\n- Menyebutkan benefit utama (30 detik)\n- Menggunakan bahasa casual yang relatable\n- Menambahkan emoji untuk engagement\n- CTA yang jelas',
    createdAt: '2026-07-24T14:01:00Z',
  },
  {
    id: 'cm-003', sessionId: 'cs-001', role: 'user',
    message: 'Bagus! Bisa buat versi yang lebih pendek juga?',
    createdAt: '2026-07-24T14:02:00Z',
  },
  {
    id: 'cm-004', sessionId: 'cs-001', role: 'assistant',
    message: 'Tentu! Berikut versi pendek:\n\n"Bye bye jus mahal! 👋 Bikin sendiri 30 detik, bisa di mana aja. Klik keranjang kuning! 🛒✨"\n\nLebih singkat, tetap memiliki hook dan CTA yang jelas.',
    createdAt: '2026-07-24T14:03:00Z',
  },
];

// ---- CAMPAIGN HISTORY ----
export const mockCampaignHistory: Record<string, CampaignHistoryItem[]> = {
  'camp-001': [
    { id: 'ch-001', campaignId: 'camp-001', action: 'campaign_created', description: 'Campaign dibuat', createdAt: '2026-07-10T08:00:00Z' },
    { id: 'ch-002', campaignId: 'camp-001', action: 'product_analyzed', description: 'Analisis produk selesai — Skor: 85', createdAt: '2026-07-10T08:30:00Z' },
    { id: 'ch-003', campaignId: 'camp-001', action: 'hook_generated', description: '5 hook berhasil dibuat', createdAt: '2026-07-11T09:00:00Z' },
    { id: 'ch-004', campaignId: 'camp-001', action: 'script_generated', description: '2 script berhasil dibuat', createdAt: '2026-07-13T11:00:00Z' },
    { id: 'ch-005', campaignId: 'camp-001', action: 'caption_generated', description: '2 caption berhasil dibuat', createdAt: '2026-07-14T08:00:00Z' },
    { id: 'ch-006', campaignId: 'camp-001', action: 'content_scheduled', description: 'Video dijadwalkan untuk 26 Juli pukul 19:00', createdAt: '2026-07-20T10:00:00Z' },
    { id: 'ch-007', campaignId: 'camp-001', action: 'script_edited', description: 'Script "Demo 30 Detik" diperbarui', createdAt: '2026-07-22T15:00:00Z' },
    { id: 'ch-008', campaignId: 'camp-001', action: 'video_uploaded', description: 'Video Storytelling berhasil diupload', createdAt: '2026-07-25T19:00:00Z' },
  ],
};

// ---- CAMPAIGN NOTES ----
export const mockCampaignNotes: Record<string, CampaignNote[]> = {
  'camp-001': [
    {
      id: 'cn-001', campaignId: 'camp-001',
      note: 'Fokus demo produk pakai buah warna-warni biar menarik secara visual. Jangan lupa tunjukkan ukuran blender vs botol minum biasa.',
      createdAt: '2026-07-11T10:00:00Z', updatedAt: '2026-07-11T10:00:00Z',
    },
    {
      id: 'cn-002', campaignId: 'camp-001',
      note: 'Competitor research: brand X pakai angle "hemat uang", brand Y pakai angle "hidup sehat". Kita bisa gabungin dua-duanya.',
      createdAt: '2026-07-15T14:00:00Z', updatedAt: '2026-07-15T14:00:00Z',
    },
    {
      id: 'cn-003', campaignId: 'camp-001',
      note: 'Insight dari komentar: banyak yang tanya soal daya tahan baterai. Bikin video khusus tentang baterai!',
      createdAt: '2026-07-20T09:00:00Z', updatedAt: '2026-07-20T09:00:00Z',
    },
  ],
};

// ---- MOTIVATIONAL QUOTES ----
export const mockMotivationQuotes: string[] = [
  'Konsistensi lebih penting daripada viral. 🔥',
  'Setiap video yang kamu upload adalah peluang penjualan baru.',
  'Yang membedakan affiliate sukses dan gagal adalah konsistensi.',
  'Satu video hari ini lebih baik daripada rencana sempurna besok.',
  'Upload dulu, sempurnakan kemudian. Progress > Perfection.',
  'Setiap komisi dimulai dari satu video yang berani diupload.',
  'Audience sedang menunggu konten dari kamu hari ini.',
];
