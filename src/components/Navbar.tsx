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
  GraduationCap,
  BookOpenCheck,
  RotateCw,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, userProfile, logout, updateUserRole } = useAuth();
  const isGuru = userProfile?.role === 'guru';

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'mufrodat', label: 'Mufrodat MA', icon: BookOpen },
    { id: 'qawaid', label: 'Qawa\'id MA', icon: Compass },
    { id: 'hiwar', label: 'Hiwar Santri', icon: MessageSquare },
    { id: 'irab', label: 'Bedah I\'rab AI', icon: Sparkles },
    { id: 'quiz', label: 'Ujian & Kuis', icon: Award },
    { id: 'tutor', label: 'Tutor Ustadz AI', icon: BotMessageSquare },
    { id: 'saved', label: 'Kamus Saya', icon: Bookmark },
    // If teacher, show Portal Guru
    ...(isGuru
      ? [{ id: 'teacher', label: 'Portal Guru (KMA 183)', icon: BookOpenCheck }]
      : []),
  ];

  const handleToggleRole = async () => {
    const nextRole = isGuru ? 'siswa' : 'guru';
    await updateUserRole(nextRole);
    if (nextRole === 'guru') {
      setActiveTab('teacher');
    } else if (activeTab === 'teacher') {
      setActiveTab('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#09231d]/95 backdrop-blur-md border-b border-amber-500/20 shadow-md shadow-black/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Class 10 Aliyah Title */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="font-arabic text-2xl leading-none font-bold">ب</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Al-Bayan
                </span>
                <span className="font-arabic text-amber-300 text-lg font-bold">
                  الْبَيَان
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 border border-emerald-500/30">
                  Kelas 10 MA
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-300/80 font-medium">
                Media Belajar Bahasa Arab Madrasah Aliyah
              </p>
            </div>
          </div>

          {/* Right Header Controls (Role switch, Streak, XP, Avatar, Logout) */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Role Toggle (Siswa <-> Guru) */}
            <button
              onClick={handleToggleRole}
              title={`Klik untuk berganti ke mode ${isGuru ? 'Siswa' : 'Guru'}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isGuru
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-emerald-800/40 border-emerald-500/30 text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              {isGuru ? (
                <>
                  <BookOpenCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Guru MA</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-[11px]">Siswa MA</span>
                </>
              )}
              <RotateCw className="w-3 h-3 text-slate-400 opacity-60" />
            </button>

            {/* User Stats Badges (Streak & XP) */}
            {userProfile && (
              <div className="hidden md:flex items-center gap-2 bg-slate-900/60 px-3 py-1 rounded-full border border-emerald-800/50 text-xs">
                {/* Streak */}
                <div className="flex items-center gap-1 text-amber-300 font-semibold" title="Hari beruntun belajar">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{userProfile.streak || 1} Hari</span>
                </div>
                <div className="w-px h-3 bg-slate-700" />
                {/* XP */}
                <div className="flex items-center gap-1 text-emerald-300 font-semibold" title="Total XP">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{userProfile.xp || 0} XP</span>
                </div>
              </div>
            )}

            {/* User Avatar */}
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Pengguna'}
                className="w-8 h-8 rounded-full ring-2 ring-amber-400/30 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/30">
                {currentUser?.displayName?.[0] || 'U'}
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Keluar dari akun (Logout)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/30 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Elegant Navigation Bar */}
        <div className="flex overflow-x-auto no-scrollbar border-t border-emerald-900/50 py-1.5 gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isSpecialGuru = item.id === 'teacher';

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium ${
                  isActive
                    ? isSpecialGuru
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-bold shadow-md shadow-amber-900/40'
                      : 'bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-950/40 border border-emerald-400/30'
                    : isSpecialGuru
                    ? 'text-amber-300 hover:bg-amber-950/40 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? (isSpecialGuru ? 'text-slate-950' : 'text-amber-300') : 'text-emerald-400/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
