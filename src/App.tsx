/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { MufrodatView } from './components/MufrodatView';
import { QawaidView } from './components/QawaidView';
import { HiwarView } from './components/HiwarView';
import { IrabAnalyzerView } from './components/IrabAnalyzerView';
import { QuizView } from './components/QuizView';
import { TutorChatView } from './components/TutorChatView';
import { SavedWordsView } from './components/SavedWordsView';
import { TeacherPortalView } from './components/TeacherPortalView';
import { GamesView } from './components/GamesView';
import { VideoLearningView } from './components/VideoLearningView';
import { Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071d18] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-3xl font-bold font-arabic text-slate-950 shadow-2xl shadow-amber-500/20 animate-pulse">
          ب
        </div>
        <div className="flex items-center gap-2 text-emerald-300 text-xs tracking-wide">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Memuat Al-Bayan • Bahasa Arab Kelas 10 Madrasah Aliyah...</span>
        </div>
      </div>
    );
  }

  // Wajib Login Guard: If not signed in, show Login page with Google Sign-in for Siswa & Guru
  if (!currentUser) {
    return <LoginView />;
  }

  // Main Authenticated Workspace
  return (
    <div className="min-h-screen bg-[#f8f7f2] flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
        {activeTab === 'games' && <GamesView />}
        {activeTab === 'videos' && <VideoLearningView />}
        {activeTab === 'mufrodat' && <MufrodatView />}
        {activeTab === 'qawaid' && <QawaidView />}
        {activeTab === 'hiwar' && <HiwarView />}
        {activeTab === 'irab' && <IrabAnalyzerView />}
        {activeTab === 'quiz' && <QuizView />}
        {activeTab === 'tutor' && <TutorChatView />}
        {activeTab === 'saved' && <SavedWordsView />}
        {activeTab === 'teacher' && <TeacherPortalView />}
      </main>

      {/* Luxurious Islamic Royal Footer with Copyright DikoSaputra */}
      <footer className="border-t border-amber-500/20 bg-gradient-to-b from-[#06241c] to-[#031511] text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <span className="font-arabic text-2xl font-bold">ب</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">AL-BAYAN</span>
                <span className="font-arabic text-amber-300 text-base font-bold">الْبَيَان</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-500/30">
                  Kelas 10 MA
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Media Belajar Bahasa Arab Madrasah Aliyah • Kurikulum Kemenag KMA 183
              </p>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hak Cipta © 2026 DikoSaputra</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Diciptakan dan Dikembangkan oleh <span className="font-bold text-amber-200">DikoSaputra</span> • Hak Cipta Dilindungi Undang-Undang
            </p>
            <div className="flex items-center justify-center md:justify-end gap-3 text-[10px] text-emerald-400/80 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Firebase Auth & Firestore Isolated
              </span>
              <span>•</span>
              <span>Express + Gemini AI Server-Side</span>
              <span>•</span>
              <span>Vercel Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
