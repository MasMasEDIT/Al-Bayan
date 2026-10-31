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
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { userProfile, savedWords, progressList, quizResults } = useAuth();
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

  const nextQuote = () => {
    setActiveQuoteIdx((prev) => (prev + 1) % quotesList.length);
  };

  const completedLessonsCount = progressList.filter((p) => p.completed).length;

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
      
      {/* Royal Forest Emerald Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06211a] via-[#0b3328] to-[#071c16] text-white p-6 sm:p-8 border border-amber-500/25 shadow-xl shadow-emerald-950/20">
        {/* Islamic Subtle Star Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-amber-400/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 text-amber-300 text-xs font-bold border border-amber-500/30 backdrop-blur-md">
              <span className="font-arabic text-sm">صَبَاحُ الْخَيْرِ وَالسُّرُوْرِ</span>
              <span>•</span>
              <span>{isGuru ? 'Portal Pendidik Bahasa Arab MA' : 'Ruang Belajar Santri Kelas 10 MA'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Ahlan wa Sahlan, {userProfile?.displayName || 'Penuntut Ilmu'}!
            </h1>

            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Selamat datang di media pembelajaran interaktif Bahasa Arab Kelas X Madrasah Aliyah berdasar kurikulum Kemenag KMA 183.
              {isGuru 
                ? ' Akses perangkat pembelajaran terstruktur, capaian pembelajaran (CP), serta generator instrumen bank soal ujian.'
                : ' Tingkatkan kefasihan lisan (Kalam), hafalan kosakata (Mufrodat), kaidah Nahwu-Shorof, dan kumpulkan skor XP harian Anda.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('mufrodat')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>Mulai Belajar Bab 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('tutor')}
                className="px-4 py-2 bg-emerald-900/60 hover:bg-emerald-800/70 text-emerald-200 border border-emerald-500/30 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <BotMessageSquare className="w-4 h-4 text-amber-400" />
                <span>Tanya Ustadz AI</span>
              </button>
            </div>
          </div>

          {/* User Status Card */}
          <div className="bg-slate-950/70 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between shrink-0 min-w-[220px]">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName || 'User'}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg ring-2 ring-emerald-500/30">
                  {userProfile?.displayName?.[0] || 'A'}
                </div>
              )}
              <div>
                <p className="font-bold text-xs text-white line-clamp-1">{userProfile?.displayName}</p>
                <p className="text-[10px] text-amber-400 font-medium">{userProfile?.schoolName || 'Madrasah Aliyah'}</p>
                <span className="inline-block mt-0.5 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200">
                  {userProfile?.role === 'guru' ? 'Guru MA' : 'Siswa Kelas 10'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-lg">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{userProfile?.streak || 1} Hari</span>
                </div>
                <p className="text-[10px] text-slate-400">Streak Belajar</p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-lg">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{userProfile?.xp || 0} XP</span>
                </div>
                <p className="text-[10px] text-slate-400">Total Poin</p>
              </div>
            </div>
          </div>
        </div>

        {isGuru && (
          <div className="mt-6 pt-4 border-t border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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

      {/* Rotating Daily Mahfudzot / Hadits Audio Player */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/60 border border-amber-300/60 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-200/90 text-amber-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-800" />
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
          <p className="text-xs font-semibold text-amber-900 italic">
            "{currentQuote.transliteration}"
          </p>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            {currentQuote.meaning}
          </p>
        </div>
      </div>

      {/* Target Belajar Santri (Daily Goals) & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left: Target Belajar Harian */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-slate-900">
                Target Capaian Belajar Harian Santri
              </h3>
            </div>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
              Kelas 10 MA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Goal 1: Mufrodat */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Target 1
                </span>
                <p className="font-bold text-sm text-slate-900 mt-1">Hafalan Mufrodat</p>
                <p className="text-xs text-slate-600 mt-0.5">5 kata tematik baru</p>
              </div>
              <div className="mt-4 pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800">{savedWords.length}/5 Kata</span>
                <span className="text-[11px] text-emerald-600 font-semibold">{Math.min(100, Math.round((savedWords.length / 5) * 100))}%</span>
              </div>
            </div>

            {/* Goal 2: Qawa'id */}
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  Target 2
                </span>
                <p className="font-bold text-sm text-slate-900 mt-1">Pemahaman Nahwu</p>
                <p className="text-xs text-slate-600 mt-0.5">1 modul kaidah pokok</p>
              </div>
              <div className="mt-4 pt-2 border-t border-teal-100 flex items-center justify-between text-xs">
                <span className="font-bold text-teal-800">{completedLessonsCount}/1 Modul</span>
                <span className="text-[11px] text-teal-600 font-semibold">{completedLessonsCount > 0 ? 'Tuntas' : '0%'}</span>
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

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Selesaikan target harian untuk meraih bonus <strong>+50 XP</strong> dan pertahankan <strong>Streak Belajar</strong>.
            </span>
            <button
              onClick={() => onNavigate('mufrodat')}
              className="text-emerald-800 font-bold hover:underline shrink-0 ml-2 cursor-pointer"
            >
              Lanjutkan
            </button>
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
                  <span className="font-extrabold text-emerald-800">{s.xp} XP</span>
                  <p className="text-[9px] text-amber-700 font-semibold">{s.badge}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 text-center pt-1">
            Poin Anda saat ini: <strong className="text-emerald-800">{userProfile?.xp || 0} XP</strong>
          </p>
        </div>
      </div>

      {/* 6 Bab Kurikulum Bahasa Arab Kelas 10 MA (KMA 183) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Daftar Bab Kurikulum Bahasa Arab Kelas X MA</span>
            </h2>
            <p className="text-xs text-slate-500">Materi resmi Kemenag KMA 183 Semester Ganjil & Genap</p>
          </div>
          <button
            onClick={() => onNavigate('mufrodat')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
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
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60 text-[11px]">
                      Bab {c.num}
                    </span>
                    <span className="text-[10px] text-slate-500">{c.level}</span>
                  </div>
                  <span className="font-arabic font-bold text-emerald-900 text-base">
                    {c.arab}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors mt-1">
                  {c.judul}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {c.totalItems} • Harakat Lengkap & Audio
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-600 line-clamp-1">
                  <strong>Tarkib: </strong>{c.fokus}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Tools Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3 px-1">
          Menu Pembelajaran Cepat
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={() => onNavigate('mufrodat')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 w-fit mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-900">Mufrodat</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Kosakata & Audio</p>
          </button>

          <button
            onClick={() => onNavigate('qawaid')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 w-fit mb-3 group-hover:bg-teal-800 group-hover:text-white transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-900">Qawa'id</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Nahwu & Shorof</p>
          </button>

          <button
            onClick={() => onNavigate('irab')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 w-fit mb-3 group-hover:bg-purple-800 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-900">Bedah I'rab</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Analisis Kalimat AI</p>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 w-fit mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-900">Ujian & Kuis</p>
            <p className="text-[11px] text-slate-500 mt-0.5">PH, PTS & Kuis AI</p>
          </button>
        </div>
      </div>
    </div>
  );
};
