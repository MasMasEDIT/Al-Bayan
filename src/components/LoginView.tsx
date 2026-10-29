import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Compass,
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { signInWithGoogle, loginError, loading } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Mufrodat Tematik',
      desc: 'Kosakata lengkap dengan harakat, audio pelafalan, dan kalimat contoh.',
    },
    {
      icon: Compass,
      title: 'Tata Bahasa Qawa\'id',
      desc: 'Penjelasan Nahwu & Shorof dari dasar hingga mudah dipahami.',
    },
    {
      icon: MessageSquare,
      title: 'Percakapan Hiwar',
      desc: 'Latihan dialog interaktif situasi nyata (sekolah, pasar, perkenalan).',
    },
    {
      icon: Sparkles,
      title: 'Bedah I\'rab Cerdas AI',
      desc: 'Analisis kedudukan kata, harakat, dan kaidah kalimat seketika dengan AI.',
    },
    {
      icon: Award,
      title: 'Kuis & Gamifikasi XP',
      desc: 'Uji kemampuan, kumpulkan XP, pertahankan streak harian belajar.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 flex flex-col justify-between text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Decorative Arabic calligraphic motifs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 w-full flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aplikasi Media Belajar Bahasa Arab Terpadu</span>
        </div>

        {/* Hero Title with Arabic Script */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-arabic text-4xl sm:text-5xl md:text-6xl text-emerald-200 mb-3 tracking-wide drop-shadow-sm font-bold">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </h1>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Belajar Bahasa Arab Jadi Lebih Mudah & Menyenangkan
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Platform interaktif untuk memperdalam kosakata (mufrodat), kaidah tata bahasa (nahwu-shorof), percakapan, dan konsultasi dengan Tutor AI Ustadz Al-Bayan.
          </p>
        </div>

        {/* Login Card & Auth Action */}
        <div className="w-full max-w-md bg-white/95 text-slate-900 rounded-3xl p-8 shadow-2xl shadow-emerald-950/50 border border-emerald-100/50 backdrop-blur-lg">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-600/30 mb-3">
              <span className="font-arabic text-3xl leading-none">ب</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Masuk ke Akun Anda
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Data progres belajar, riwayat kuis, dan kosakata Anda disimpan aman per user di Firestore.
            </p>
          </div>

          {/* Error notice if any */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <p className="font-medium">Gagal masuk:</p>
              <p className="text-[11px] mt-0.5">{loginError}</p>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {/* Google G SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Wajib login untuk mengakses materi dan menyimpan progres</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-emerald-900/30 border border-emerald-700/30 rounded-2xl p-4 backdrop-blur-xs flex items-start gap-3"
              >
                <div className="p-2.5 rounded-xl bg-emerald-800/50 text-emerald-300 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
                    {feat.title}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-emerald-900/40 py-6 text-center text-xs text-slate-400 relative z-10">
        <p>Al-Bayan — Aplikasi Media Belajar Bahasa Arab Mandiri</p>
      </footer>
    </div>
  );
};
