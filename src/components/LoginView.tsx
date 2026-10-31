import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  BookOpenCheck,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  UserCheck,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const {
    signInWithGoogle,
    loginWithDemoAccount,
    loginError,
    loading,
    selectedLoginRole,
    setSelectedLoginRole,
  } = useAuth();
  const [activeTabRole, setActiveTabRole] = useState<UserRole>(selectedLoginRole || 'siswa');

  const handleRoleSelect = (role: UserRole) => {
    setActiveTabRole(role);
    setSelectedLoginRole(role);
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle(activeTabRole);
  };

  const handleDemoLogin = async (role: UserRole) => {
    await loginWithDemoAccount(role);
  };

  return (
    <div className="min-h-screen bg-[#071d18] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Refined Islamic Geometric Ambient Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(217,119,6,0.12),transparent_60%)] pointer-events-none" />
      
      {/* Decorative Golden Star Accents */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 border-b border-emerald-900/40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <span className="font-arabic text-2xl leading-none">ب</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">
                  AL-BAYAN
                </span>
                <span className="text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                  Kelas 10 MA
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 font-medium tracking-wide">
                Madrasah Aliyah • Kurikulum Bahasa Arab KMA 183
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-200/70 border border-emerald-800/60 px-3 py-1.5 rounded-full bg-emerald-950/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tahun Ajaran 2026/2027</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12 w-full flex-1 flex flex-col items-center justify-center">
        
        {/* Calligraphic Top Banner */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal Edukasi Bahasa Arab Terpadu Madrasah Aliyah</span>
          </div>

          <h1 className="font-arabic text-4xl sm:text-5xl md:text-6xl text-amber-200 font-bold mb-3 tracking-wide drop-shadow-md">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Media Pembelajaran Bahasa Arab Kelas X Aliyah
          </h2>
          <p className="mt-2.5 text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Menyelaraskan kurikulum Kemenag KMA 183 dengan teknologi cerdas: kosakata tematik, kaidah Nahwu-Shorof, dan percakapan santri Aliyah.
          </p>
        </div>

        {/* Dual Role Authentication Card */}
        <div className="w-full max-w-xl bg-slate-900/90 rounded-3xl border border-emerald-700/30 shadow-2xl shadow-black/80 backdrop-blur-xl p-6 sm:p-8">
          
          {/* Role Selector Tabs (Siswa vs Guru) */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-emerald-200/90 mb-2.5 text-center uppercase tracking-wider">
              Pilih Akses Masuk:
            </p>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/70 rounded-2xl border border-emerald-900/50">
              {/* Tab Siswa */}
              <button
                type="button"
                onClick={() => handleRoleSelect('siswa')}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  activeTabRole === 'siswa'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <GraduationCap className={`w-4 h-4 ${activeTabRole === 'siswa' ? 'text-amber-300' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="leading-tight">Akses Siswa</div>
                  <div className="text-[10px] font-normal opacity-80">طَالِبٌ / طَالِبَةٌ</div>
                </div>
              </button>

              {/* Tab Guru */}
              <button
                type="button"
                onClick={() => handleRoleSelect('guru')}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  activeTabRole === 'guru'
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 shadow-lg shadow-amber-900/50 border border-amber-300/40 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpenCheck className={`w-4 h-4 ${activeTabRole === 'guru' ? 'text-slate-950' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="leading-tight">Akses Guru</div>
                  <div className="text-[10px] font-normal opacity-85">مُعَلِّمٌ / أُسْتَاذٌ</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick 1-Click Default Demo Account Login */}
          <div className="mb-6 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent p-4 rounded-2xl border border-amber-500/30">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Akun Bawaan (Langsung Masuk 1-Klik)</span>
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                Siap Pakai
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Preset Siswa Button */}
              <button
                type="button"
                onClick={() => handleDemoLogin('siswa')}
                disabled={loading}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  activeTabRole === 'siswa'
                    ? 'bg-emerald-950/80 border-emerald-400/60 shadow-md text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Akun Bawaan Siswa</span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-1">Ahmad Fauzi</p>
                  <p className="text-[10px] text-slate-400 font-mono">siswa.aliyah@albayan.edu</p>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-300 font-bold">
                  <span>Masuk sebagai Siswa</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Preset Guru Button */}
              <button
                type="button"
                onClick={() => handleDemoLogin('guru')}
                disabled={loading}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  activeTabRole === 'guru'
                    ? 'bg-amber-950/80 border-amber-400/60 shadow-md text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Akun Bawaan Guru</span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-1">Ustadz H. Mansyur, Lc.</p>
                  <p className="text-[10px] text-slate-400 font-mono">guru.aliyah@albayan.edu</p>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-amber-300 font-bold">
                  <span>Masuk sebagai Guru</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Atau masuk dengan</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Error Message if any */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs">
              <p className="font-bold">Kendala Masuk:</p>
              <p className="text-[11px] mt-0.5">{loginError}</p>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-md hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {/* Google Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>
              Masuk Akun Google Pribadi ({activeTabRole === 'siswa' ? 'Siswa' : 'Guru'})
            </span>
          </button>

          {/* Privacy & Firestore Note */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data tersimpan per-user di Firebase Firestore aman & privat</span>
          </div>
        </div>

        {/* Kurikulum Kelas 10 MA Overview Cards */}
        <div className="mt-12 w-full max-w-5xl">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Cakupan Silabus Bahasa Arab Kelas 10 Madrasah Aliyah</span>
            </h3>
            <span className="text-[11px] text-emerald-300/80">Semester Ganjil & Genap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                bab: 'Bab 1',
                arab: 'التَّحِيَّاتُ وَالتَّعَارُفُ',
                tema: 'Sapaan & Perkenalan Siswa MA',
                tarkib: 'أَقْسَامُ الْكَلَامِ (Isim, Fi\'il, Huruf) & الضَّمَائِرُ',
              },
              {
                bab: 'Bab 2',
                arab: 'الْأُسْرَةُ وَالْبَيْتُ',
                tema: 'Keluarga & Tempat Tinggal',
                tarkib: 'الضَّمَائِرُ الْمُتَّصِلَةُ & أَدَوَاتُ الاِسْتِفْهَامِ',
              },
              {
                bab: 'Bab 3',
                arab: 'الْمَدْرَسَةُ وَمَرَافِقُهَا',
                tema: 'Fasilitas & Civitas Madrasah',
                tarkib: 'أَسْمَاءُ الْإِشَارَةِ & النَّعْتُ وَالْمَنْعُوْتُ',
              },
              {
                bab: 'Bab 4',
                arab: 'الْحَيَاةُ الْيَوْمِيَّةُ',
                tema: 'Keseharian Santri Aliyah',
                tarkib: 'الْجُمْلَةُ الْفِعْلِيَّةُ & تَصْرِيْفُ الْأَفْعَالِ',
              },
              {
                bab: 'Bab 5',
                arab: 'الْهِوَايَةُ وَالتَّرْوِيْحُ',
                tema: 'Hobi & Ekstrakurikuler MA',
                tarkib: 'أَنْ النَّاصِبَةُ + الْفِعْلُ الْمُضَارِعُ',
              },
              {
                bab: 'Bab 6',
                arab: 'الطَّعَامُ وَالشَّرَابُ',
                tema: 'Kantin & Makanan Halal Thayyib',
                tarkib: 'الْجُمْلَةُ الاِسْمِيَّةُ (الْمُبْتَدَأُ وَالْخَبَرُ)',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-900/40 backdrop-blur-xs flex flex-col justify-between hover:border-amber-500/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-amber-400 text-[11px]">{item.bab}</span>
                    <span className="font-arabic text-emerald-200 text-sm font-bold">{item.arab}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">{item.tema}</h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">Tarkib: </span>
                  {item.tarkib}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-emerald-900/30 py-4 text-center text-xs text-slate-400">
        <p>Al-Bayan • Media Belajar Bahasa Arab Kelas X Madrasah Aliyah • Siap Deploy Vercel</p>
      </footer>
    </div>
  );
};
