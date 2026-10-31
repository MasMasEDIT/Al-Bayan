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
import { Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f9f8f4] flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
        {activeTab === 'mufrodat' && <MufrodatView />}
        {activeTab === 'qawaid' && <QawaidView />}
        {activeTab === 'hiwar' && <HiwarView />}
        {activeTab === 'irab' && <IrabAnalyzerView />}
        {activeTab === 'quiz' && <QuizView />}
        {activeTab === 'tutor' && <TutorChatView />}
        {activeTab === 'saved' && <SavedWordsView />}
        {activeTab === 'teacher' && <TeacherPortalView />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-5 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">
          Al-Bayan (الْبَيَان) — Media Belajar Bahasa Arab Kelas 10 Madrasah Aliyah (KMA 183)
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          React + Vite + Firebase Auth & Firestore + Express + Gemini AI Server-Side • Siap Deploy Vercel
        </p>
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
