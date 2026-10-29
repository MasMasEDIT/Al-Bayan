import React from 'react';
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
  TrendingUp,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { userProfile, savedWords, progressList, quizResults } = useAuth();

  const wisdom = {
    arabic: 'مَنْ جَدَّ وَجَدَ، وَمَنْ سَارَ عَلَى الدَّرْبِ وَصَلَ',
    transliteration: 'Man jadda wajada, wa man saaro \'alad-darbi washola',
    meaning: 'Barangsiapa bersungguh-sungguh niscaya ia akan berhasil, dan barangsiapa berjalan di jalurnya niscaya ia akan sampai.',
    source: 'Mahfudzot (Kata Mutiara Arab)',
  };

  const completedLessonsCount = progressList.filter((p) => p.completed).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/50 text-emerald-200 text-xs font-medium border border-emerald-500/20">
              <span className="font-arabic">أَهْلًا وَسَهْلًا</span>
              <span>• Selamat Datang</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ahlan wa Sahlan, {userProfile?.displayName || 'Penuntut Ilmu'}!
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-xl leading-relaxed">
              Lanjutkan perjalanan mempelajari bahasa Al-Qur'an dan bahasa peradaban Islam hari ini. Setiap kata yang Anda pelajari bernilai pahala dan kebaikan.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-xl">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{userProfile?.streak || 1}</span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium">Streak Hari</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-yellow-300 font-bold text-xl">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>{userProfile?.xp || 0}</span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium">Total XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Arabic Wisdom / Mahfudzot Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
              Hikmah Hari Ini
            </span>
            <span className="text-xs text-amber-700/80">{wisdom.source}</span>
          </div>
          <button
            onClick={() => speakArabic(wisdom.arabic)}
            className="flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            title="Dengarkan pelafalan Arab"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Dengarkan</span>
          </button>
        </div>
        <div className="text-right my-3">
          <p className="font-arabic text-2xl sm:text-3xl text-amber-950 font-bold leading-loose">
            {wisdom.arabic}
          </p>
        </div>
        <p className="text-xs font-medium text-amber-800 italic">
          "{wisdom.transliteration}"
        </p>
        <p className="text-sm text-amber-950 font-semibold mt-1">
          {wisdom.meaning}
        </p>
      </div>

      {/* Learning Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Kamus Saya</p>
            <p className="text-lg font-bold text-slate-900">{savedWords.length} Kata</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Modul Selesai</p>
            <p className="text-lg font-bold text-slate-900">{completedLessonsCount} Materi</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Kuis Diikuti</p>
            <p className="text-lg font-bold text-slate-900">{quizResults.length} Kali</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tingkat Belajar</p>
            <p className="text-lg font-bold text-purple-900">{userProfile?.level || 'Pemula'}</p>
          </div>
        </div>
      </div>

      {/* Main Learning Hub Navigator Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Pilihan Modul Belajar
          </h2>
          <span className="text-xs text-slate-500">Pilih materi untuk memulai</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Mufrodat */}
          <div
            onClick={() => onNavigate('mufrodat')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Mufrodat (Kosakata)
                </h3>
                <span className="font-arabic text-emerald-800 text-lg font-bold">المُفْرَدَات</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pelajari kosakata tematik harian (keluarga, sekolah, rumah) berharakat dengan audio pelafalan asli.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Buka Kosakata</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Qawa'id */}
          <div
            onClick={() => onNavigate('qawaid')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-900/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                  Qawa'id (Tata Bahasa)
                </h3>
                <span className="font-arabic text-teal-800 text-lg font-bold">القَوَاعِد</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pelajari kaidah Nahwu & Shorof dari dasar: Isim-Fi'il-Huruf, kata tunjuk, dhomir, dan struktur kalimat.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>Pelajari Kaidah</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Hiwar */}
          <div
            onClick={() => onNavigate('hiwar')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                  Hiwar (Percakapan)
                </h3>
                <span className="font-arabic text-blue-800 text-lg font-bold">الحِوَار</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Latih kelancaran berbicara lewat simulasi dialog dua arah dalam konteks kehidupan sehari-hari.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
              <span>Mulai Percakapan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Bedah I'rab AI */}
          <div
            onClick={() => onNavigate('irab')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-700 transition-colors">
                  Bedah I'rab AI
                </h3>
                <span className="font-arabic text-purple-800 text-lg font-bold">إِعْرَاب الجُمَل</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Ketik atau pilih kalimat bahasa Arab apa pun, AI akan membedah kedudukan tata bahasa kata per kata seketika.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
              <span>Analisis Kalimat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Kuis & Latihan */}
          <div
            onClick={() => onNavigate('quiz')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-900/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                  Kuis & Evaluasi
                </h3>
                <span className="font-arabic text-amber-800 text-lg font-bold">الاِخْتِبَارَات</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Uji pemahaman kosakata dan kaidah Anda. Dapatkan tambahan XP dan simpan riwayat kuis di Firestore.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Ikuti Kuis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Tutor AI Ustadz */}
          <div
            onClick={() => onNavigate('tutor')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <BotMessageSquare className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Tutor AI Ustadz
                </h3>
                <span className="font-arabic text-emerald-800 text-lg font-bold">المُعَلِّمُ الذَّكِيّ</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Konsultasikan kesulitan belajar bahasa Arab dengan Ustadz AI yang siap menjawab 24/7 dengan harakat lengkap.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Tanya Ustadz AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
