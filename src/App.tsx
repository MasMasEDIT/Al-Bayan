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
import { Loader2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-700/80 flex items-center justify-center text-2xl font-bold font-arabic shadow-xl animate-pulse">
          ب
        </div>
        <div className="flex items-center gap-2 text-emerald-200 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Memuat Al-Bayan Media Belajar Bahasa Arab...</span>
        </div>
      </div>
    );
  }

  // Wajib Login Guard: If not signed in, show Login page with Google Sign-in
  if (!currentUser) {
    return <LoginView />;
  }

  // Main Authenticated Workspace
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          Al-Bayan — Media Belajar Bahasa Arab • React + Vite + Firebase Auth & Firestore + Express + Gemini AI
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
