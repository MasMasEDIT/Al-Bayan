import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Compass,
  MessageSquare,
  Sparkles,
  Award,
  Bookmark,
  LogOut,
  Flame,
  BotMessageSquare,
  LayoutDashboard,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, userProfile, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'mufrodat', label: 'Mufrodat', icon: BookOpen },
    { id: 'qawaid', label: 'Qawa\'id', icon: Compass },
    { id: 'hiwar', label: 'Hiwar', icon: MessageSquare },
    { id: 'irab', label: 'Bedah I\'rab AI', icon: Sparkles },
    { id: 'quiz', label: 'Kuis & Evaluasi', icon: Award },
    { id: 'tutor', label: 'Tutor AI Ustadz', icon: BotMessageSquare },
    { id: 'saved', label: 'Kamus Saya', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Arabic title */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <span className="font-arabic text-xl leading-none">ب</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-emerald-950 tracking-tight">
                  Al-Bayan
                </span>
                <span className="font-arabic text-emerald-700 text-lg font-bold">
                  الْبَيَان
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">
                Media Belajar Bahasa Arab
              </p>
            </div>
          </div>

          {/* User status & Logout button */}
          <div className="flex items-center gap-3">
            {userProfile && (
              <div className="hidden sm:flex items-center gap-2.5 bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-100 text-xs">
                {/* Streak */}
                <div className="flex items-center gap-1 text-amber-700 font-semibold" title="Hari beruntun">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{userProfile.streak || 1} Hari</span>
                </div>
                <div className="w-px h-3.5 bg-emerald-200" />
                {/* XP */}
                <div className="flex items-center gap-1 text-emerald-800 font-semibold" title="Poin Pengalaman">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{userProfile.xp || 0} XP</span>
                </div>
                <div className="w-px h-3.5 bg-emerald-200" />
                {/* Level badge */}
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {userProfile.level || 'Pemula'}
                </span>
              </div>
            )}

            {/* User Avatar & Logout */}
            <div className="flex items-center gap-2 pl-2">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-9 h-9 rounded-full ring-2 ring-emerald-500/20 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {currentUser?.displayName?.[0] || 'U'}
                </div>
              )}

              <button
                onClick={logout}
                title="Keluar dari akun (Logout)"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto no-scrollbar border-t border-emerald-50 py-1.5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
