import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { speakArabic } from '../lib/audio';
import {
  BookOpen,
  Compass,
  MessageSquare,
  Sparkles,
  Award,
  Bookmark,
  Volume2,
  Flame,
  ArrowRight,
  Target,
  BotMessageSquare,
  GraduationCap,
  BookOpenCheck,
  Calendar,
  Trophy,
  CheckCircle2,
  Play,
  RotateCw,
  Clock,
  ChevronRight,
  Zap,
  Gamepad2,
  Film,
  Gift,
  Star,
  Check
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { userProfile, savedWords, progressList, quizResults, awardXP } = useAuth();
  const isGuru = userProfile?.role === 'guru';

  // Rotating Arabic Wisdom Quotes (Mahfudzot & Hadits)
  const quotesList = [
    {
      arabic: 'مَنْ سَلَكَ طَرِيْقًا يَلْتَمِسُ فِيْهِ عِلْمًا، سَهَّلَ اللهُ لَهُ بِهِ طَرِيْقًا إِلَى الْجَنَّةِ',
      transliteration: 'Man salaka thariiqan yaltamisu fiihi \'ilman, sahhalallaahu lahu bihii thariiqan ilal jannah',
      meaning: 'Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.',
      source: 'Hadits Shahih Riwayat Imam Muslim',
    },
    {
      arabic: 'مَنْ جَدَّ وَجَدَ، وَمَنْ سَارَ عَلَى الدَّرْبِ وَصَلَ',
      transliteration: 'Man jadda wajada, wa man saara \'alad-darbi washala',
      meaning: 'Barangsiapa bersungguh-sungguh niscaya ia berhasil, dan barangsiapa berjalan di jalurnya niscaya ia akan sampai.',
      source: 'Mahfudzot Pilihan Santri',
    },
    {
      arabic: 'الْوَقْتُ أَثْمَنُ مِنَ الذَّهَبِ، وَإِنْ لَمْ تَقْطَعْهُ قَطَعَكَ',
      transliteration: 'Al-waqtu atsmanu minadz-dzahabi, wa in lam taqtha\'hu qatha\'aka',
      meaning: 'Waktu lebih berharga daripada emas, dan jika engkau tidak memanfaatkannya ia akan menebasmu.',
      source: 'Syair Hikmah Syafi\'iyyah',
    },
    {
      arabic: 'تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا مِنْ دِيْنِكُمْ',
      transliteration: 'Ta\'allamul \'Arabiyyata fa-innahaa min diinikum',
      meaning: 'Pelajarilah bahasa Arab, karena sesungguhnya bahasa Arab adalah bagian dari agama kalian.',
      source: 'Atsar Sahabat Umar bin Khattab r.a.',
    },
  ];

  const [activeQuoteIdx, setActiveQuoteIdx] = useState<number>(0);
  const currentQuote = quotesList[activeQuoteIdx];

  // Daily Mystery Gift State
  const [mysteryClaimed, setMysteryClaimed] = useState<boolean>(() => {
    return localStorage.getItem('albayan_daily_mystery_date') === new Date().toDateString();
  });
  const [showMysteryAlert, setShowMysteryAlert] = useState<boolean>(false);

  const handleClaimMystery = async () => {
    if (mysteryClaimed) return;
    setMysteryClaimed(true);
    setShowMysteryAlert(true);
    localStorage.setItem('albayan_daily_mystery_date', new Date().toDateString());
    await awardXP(15);
  };

  const nextQuote = () => {
    setActiveQuoteIdx((prev) => (prev + 1) % quotesList.length);
  };

  // Rank / Level Progression Calculation
  const currentXP = userProfile?.xp || 0;
  let levelTitle = 'Santri Baru';
  let nextLevelXP = 100;
  let prevLevelXP = 0;

  if (currentXP < 100) {
    levelTitle = 'Santri Baru (Pemula)';
    nextLevelXP = 100;
    prevLevelXP = 0;
  } else if (currentXP < 300) {
    levelTitle = 'Santri Teladan (Menengah)';
    nextLevelXP = 300;
    prevLevelXP = 100;
  } else if (currentXP < 600) {
    levelTitle = 'Bintang Kelas Aliyah';
    nextLevelXP = 600;
    prevLevelXP = 300;
  } else if (currentXP < 1000) {
    levelTitle = 'Duta Bahasa Arab MA';
    nextLevelXP = 1000;
    prevLevelXP = 600;
  } else {
    levelTitle = 'Syabab Lughowi (Mahir / Ustadz Muda)';
    nextLevelXP = 2000;
    prevLevelXP = 1000;
  }

  const progressPercent = Math.min(
    100,
    Math.round(((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100)
  );

  // 6 Bab Silabus Kelas 10 MA (KMA 183)
  const chaptersMA = [
    {
      num: 1,
      arab: 'التَّحِيَّاتُ وَالتَّعَارُفُ',
      judul: 'Sapaan, Perkenalan & Biodata Santri',
      fokus: 'أَقْسَامُ الْكَلَامِ (Isim, Fi\'il, Huruf) & الضَّمَائِرُ',
      completed: progressList.some((p) => p.category === 'mufrodat' && p.completed),
      totalItems: '24 Kosakata',
      level: 'Semester Ganjil',
    },
    {
      num: 2,
      arab: 'الْأُسْرَةُ وَالْبَيْتُ',
      judul: 'Keluarga & Tempat Tinggal Santri',
      fokus: 'الضَّمَائِرُ الْمُتَّصِلَةُ & أَدَوَاتُ الاِسْتِفْهَامِ',
      completed: false,
      totalItems: '18 Kosakata',
      level: 'Semester Ganjil',
    },
    {
      num: 3,
      arab: 'الْمَدْرَسَةُ وَمَرَافِقُهَا',
      judul: 'Fasilitas & Lingkungan Madrasah Aliyah',
      fokus: 'أَسْمَاءُ الْإِشَارَةِ & النَّعْتُ وَالْمَنْعُوْتُ',
      completed: false,
      totalItems: '20 Kosakata',
      level: 'Semester Ganjil',
    },
    {
      num: 4,
      arab: 'الْحَيَاةُ الْيَوْمِيَّةُ',
      judul: 'Keseharian Santri (Bangun Tidur - Malam)',
      fokus: 'الْجُمْلَةُ الْفِعْلِيَّةُ & تَصْرِيْفُ الْأَفْعَالِ',
      completed: false,
      totalItems: '22 Kosakata',
      level: 'Semester Genap',
    },
    {
      num: 5,
      arab: 'الْهِوَايَةُ وَالتَّرْوِيْحُ',
      judul: 'Hobi & Ekstrakurikuler di Madrasah',
      fokus: 'أَنْ النَّاصِبَةُ + الْفِعْلُ الْمُضَارِعُ',
      completed: false,
      totalItems: '16 Kosakata',
      level: 'Semester Genap',
    },
    {
      num: 6,
      arab: 'الطَّعَامُ وَالشَّرَابُ',
      judul: 'Makanan Halal Thayyib & Kantin MA',
      fokus: 'الْجُمْلَةُ الاِسْمِيَّةُ (الْمُبْتَدَأُ وَالْخَبَرُ)',
      completed: false,
      totalItems: '15 Kosakata',
      level: 'Semester Genap',
    },
  ];

  // Leaderboard Santri MA
  const santriLeaderboard = [
    { rank: 1, name: 'Ahmad Fauzi', madrasah: 'MAN 1 Model', xp: 520, badge: '🥇 Mumtaz' },
    { rank: 2, name: 'Fatimah Az-Zahra', madrasah: 'MA Ali Maksum', xp: 460, badge: '🥈 Jayyid Jiddan' },
    { rank: 3, name: 'Salman Al-Farisi', madrasah: 'MAN Insan Cendekia', xp: 410, badge: '🥉 Jayyid' },
    { rank: 4, name: 'Zaid bin Tsabit', madrasah: 'MA Al-Azhar', xp: 340, badge: '⭐ Rajin' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-14">
      
      {/* Royal Forest Emerald Hero Banner replaced with Deep Sapphire & Light Blue */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07172b] via-[#0b2b4d] to-[#07172b] text-white p-6 sm:p-8 border border-amber-500/25 shadow-xl shadow-sky-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-amber-400/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
              <span className="font-arabic text-sm">صَبَاحُ الْخَيْرِ وَالسُّرُوْرِ</span>
              <span aria-hidden="true">·</span>
              <span>{isGuru ? 'Portal Pendidik Bahasa Arab MA' : 'Ruang Belajar Santri Kelas 10 MA'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-sky-300">DikoSaputra</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Ahlan wa Sahlan, {userProfile?.displayName || 'Penuntut Ilmu'}!
            </h1>

            <p className="text-sky-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Media pembelajaran interaktif Bahasa Arab Kelas 10 Madrasah Aliyah kurikulum Kemenag KMA 183.
              {isGuru 
                ? ' Akses perangkat pembelajaran terstruktur, capaian pembelajaran (CP), serta generator instrumen bank soal ujian.'
                : ' Asah hafalan dengan Flashcard Mnemonic 3D, tonton video animasi santri, taklukkan arena game, dan raih poin XP harianmu!'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('mufrodat')}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>Buka Flashcard Mnemonic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('games')}
                className="px-4 py-2.5 bg-sky-900/60 hover:bg-sky-800/70 text-sky-200 border border-sky-400/30 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                <span>Arena Game Seru</span>
              </button>
            </div>
          </div>

          {/* User Level Card */}
          <div className="bg-slate-950/70 border border-sky-700/50 rounded-2xl p-4 sm:p-5 min-w-[260px] backdrop-blur-md space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-sky-900/50">
              <div className="w-10 h-10 rounded-full bg-sky-900 text-sky-100 flex items-center justify-center font-bold text-sm ring-2 ring-amber-400/40">
                {userProfile?.displayName?.[0] || 'S'}
              </div>
              <div>
                <p className="font-bold text-xs text-white line-clamp-1">{userProfile?.displayName}</p>
                <p className="text-[10px] text-amber-400 font-medium">{levelTitle}</p>
              </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-300">
                <span>Poin XP</span>
                <span className="font-bold text-amber-300">{currentXP} / {nextLevelXP} XP</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-base">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{userProfile?.streak || 1} Hari</span>
                </div>
                <p className="text-[10px] text-slate-400">Streak Belajar</p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-sky-400 font-bold text-base">
                  <Trophy className="w-4 h-4 text-sky-400" />
                  <span>{progressList.filter((p) => p.completed).length} Bab</span>
                </div>
                <p className="text-[10px] text-slate-400">Materi Tuntas</p>
              </div>
            </div>
          </div>
        </div>

        {isGuru && (
          <div className="mt-6 pt-4 border-t border-sky-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-amber-300 flex items-center gap-2 font-semibold">
              <BookOpenCheck className="w-4 h-4" />
              <span>Mode Guru Aktif: Silabus KMA 183 & Generator Bank Soal Ujian Kelas 10 MA</span>
            </span>
            <button
              onClick={() => onNavigate('teacher')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>Buka Portal Guru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Daily Mystery Gift & Interactive Quest Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mystery Gift Card */}
        <div
          onClick={handleClaimMystery}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            mysteryClaimed
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-[1.02]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                {mysteryClaimed ? 'Klaim Berhasil' : 'Kotak Misteri Harian'}
              </span>
              <Gift className={`w-5 h-5 ${mysteryClaimed ? 'text-amber-700' : 'text-slate-950 animate-bounce'}`} />
            </div>
            <h3 className="font-extrabold text-base mt-2">
              {mysteryClaimed ? 'Hadiah +15 XP Telah Masuk!' : 'Klaim Bonus Hikmah & XP'}
            </h3>
            <p className="text-xs mt-1 leading-relaxed">
              {mysteryClaimed
                ? 'Kembali besok untuk membuka kotak misteri kosakata baru berikutnya!'
                : 'Ketuk untuk membuka kata mutiara harian dan dapatkan bonus 15 XP instan!'}
            </p>
          </div>

          <div className="mt-4 pt-2 border-t border-black/10 flex items-center justify-between text-xs font-bold">
            <span>{mysteryClaimed ? 'Sudah Diklaim Hari Ini' : 'Buka Sekarang'}</span>
            {mysteryClaimed ? <Check className="w-4 h-4 text-sky-700" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </div>

        {/* Quest 1: Video Animasi */}
        <div
          onClick={() => onNavigate('videos')}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-sky-700">Misi Video Animasi</span>
              <span className="font-bold text-amber-600">+20 XP</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-2 group-hover:text-sky-800 transition-colors">
              Nonton Animasi Bab 1-6
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tonton dialog visual kartun santri dan jawab kuis pemahaman tiap bab.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-800">
            <span>Tonton Video</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Quest 2: Simulasi Chat Hiwar */}
        <div
          onClick={() => onNavigate('hiwar')}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-sky-700">Misi Simulasi Chat</span>
              <span className="font-bold text-amber-600">+25 XP</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-2 group-hover:text-sky-800 transition-colors">
              Simulasi Chat WhatsApp Santri
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Latihan roleplay percakapan dan pilih balasan yang sopan saat ta'aruf.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-800">
            <span>Mulai Roleplay</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Rotating Daily Mahfudzot / Hadits Audio Player */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/60 border border-amber-300/60 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Hikmah & Mahfudzot Hari Ini</span>
            </span>
            <span className="text-xs text-amber-900/70 hidden sm:inline">• {currentQuote.source}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={nextQuote}
              className="p-1.5 rounded-lg text-amber-900 hover:bg-amber-200/60 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold"
              title="Ganti kata mutiara lain"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Kutipan Lain</span>
            </button>

            <button
              onClick={() => speakArabic(currentQuote.arabic)}
              className="flex items-center gap-1.5 text-xs text-amber-950 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
              title="Dengarkan pelafalan bahasa Arab"
            >
              <Volume2 className="w-4 h-4 text-amber-900" />
              <span>Dengarkan</span>
            </button>
          </div>
        </div>

        <div className="text-right my-3">
          <p className="font-arabic text-2xl sm:text-3xl text-slate-900 font-bold leading-loose">
            {currentQuote.arabic}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-amber-200/60 space-y-1">
          <p className="text-xs font-semibold text-amber-900 italic font-mono">
            "{currentQuote.transliteration}"
          </p>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            {currentQuote.meaning}
          </p>
        </div>
      </div>

      {/* Target Belajar Santri (Daily Goals) & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left: Target Belajar Harian */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-base text-slate-900">
                Target Capaian Belajar Harian Santri
              </h3>
            </div>
            <span className="text-xs text-slate-400">Target Hari Ini</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Goal 1: Mufrodat */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                  Target 1
                </span>
                <p className="font-bold text-sm text-slate-900 mt-1">Hafalan Mufrodat</p>
                <p className="text-xs text-slate-600 mt-0.5">5 kata dengan mnemonic</p>
              </div>
              <div className="mt-4 pt-2 border-t border-sky-100 flex items-center justify-between text-xs">
                <span className="font-bold text-sky-800">{savedWords.length}/5 Kata</span>
                <span className="text-[11px] text-sky-600 font-semibold">{savedWords.length >= 5 ? 'Tercapai' : `${Math.round((savedWords.length / 5) * 100)}%`}</span>
              </div>
            </div>

            {/* Goal 2: Nahwu Lab */}
            <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                  Target 2
                </span>
                <p className="font-bold text-sm text-slate-900 mt-1">Eksperimen Nahwu</p>
                <p className="text-xs text-slate-600 mt-0.5">1 simulasi rumus visual</p>
              </div>
              <div className="mt-4 pt-2 border-t border-sky-100 flex items-center justify-between text-xs">
                <span className="font-bold text-sky-800">Lab Nahwu</span>
                <span className="text-[11px] text-sky-600 font-semibold">Siap Diuji</span>
              </div>
            </div>

            {/* Goal 3: Kuis & Ujian */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Target 3
                </span>
                <p className="font-bold text-sm text-slate-900 mt-1">Uji Kompetensi</p>
                <p className="text-xs text-slate-600 mt-0.5">1 evaluasi kuis harian</p>
              </div>
              <div className="mt-4 pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-800">{quizResults.length}/1 Kuis</span>
                <span className="text-[11px] text-amber-600 font-semibold">{quizResults.length > 0 ? 'Tuntas' : '0%'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Papan Peringkat Santri (Leaderboard) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base text-slate-900">
                Peringkat Santri MA
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Pekan Ini</span>
          </div>

          <div className="space-y-2.5">
            {santriLeaderboard.map((s) => (
              <div
                key={s.rank}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  s.rank === 1
                    ? 'bg-amber-50/60 border-amber-200 text-amber-950 font-bold'
                    : 'bg-slate-50/60 border-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    s.rank === 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.rank}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.madrasah}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sky-800">{s.xp} XP</span>
                  <p className="text-[9px] text-amber-700 font-semibold">{s.badge}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 text-center pt-1">
            Poin Anda saat ini: <strong className="text-sky-800">{currentXP} XP</strong>
          </p>
        </div>
      </div>

      {/* 6 Bab Kurikulum Bahasa Arab Kelas 10 MA (KMA 183) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <span>Daftar Bab Kurikulum Bahasa Arab Kelas X MA</span>
            </h2>
            <p className="text-xs text-slate-500">Materi resmi Kemenag KMA 183 Semester Ganjil & Genap</p>
          </div>
          <button
            onClick={() => onNavigate('mufrodat')}
            className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Buka Seluruh Materi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chaptersMA.map((c) => (
            <div
              key={c.num}
              onClick={() => onNavigate('mufrodat')}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-sky-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-amber-800 text-[11px]">
                    Bab {c.num} · {c.level}
                  </span>
                  <span className="font-arabic text-sky-800 text-base font-bold">
                    {c.arab}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                  {c.judul}
                </h3>

                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Fokus Kaidah: <span className="text-slate-700">{c.fokus}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">{c.totalItems}</span>
                <span className="font-bold text-sky-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Mulai Bab</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright Attribution */}
      <div className="text-center text-xs text-slate-400 pt-2">
        Al-Bayan • Media Belajar Bahasa Arab Kelas 10 Madrasah Aliyah • Hak Cipta © 2026 DikoSaputra
      </div>
    </div>
  );
};
