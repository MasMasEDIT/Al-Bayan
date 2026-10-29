import React, { useState } from 'react';
import { MUFRODAT_DATA } from '../data/learningData';
import { useAuth } from '../context/AuthContext';
import { speakArabic } from '../lib/audio';
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  Search,
  CheckCircle,
  Filter,
  Sparkles,
} from 'lucide-react';

export const MufrodatView: React.FC = () => {
  const { savedWords, saveWordToFirestore, removeWordFromFirestore, recordLessonProgress, progressList } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'Semua',
    'Perkenalan & Sapaan',
    'Sekolah & Belajar',
    'Keluarga',
    'Rumah & Perlengkapan',
    'Makanan & Minuman',
  ];

  const filteredMufrodat = MUFRODAT_DATA.filter((item) => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch =
      item.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const isWordSaved = (id: string) => savedWords.some((w) => w.wordId === id);
  const isLessonDone = (id: string) => progressList.some((p) => p.lessonId === id && p.completed);

  const toggleBookmark = async (item: typeof MUFRODAT_DATA[0]) => {
    if (isWordSaved(item.id)) {
      await removeWordFromFirestore(item.id);
    } else {
      await saveWordToFirestore({
        wordId: item.id,
        arabic: item.arabic,
        transliteration: item.transliteration,
        meaning: item.meaning,
        category: item.category,
      });
    }
  };

  const markLearned = async (item: typeof MUFRODAT_DATA[0]) => {
    await recordLessonProgress({
      lessonId: item.id,
      category: 'mufrodat',
      score: 100,
      completed: true,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Mufrodat (Kosakata Pilihan)
            </h1>
            <span className="font-arabic text-xl text-emerald-800 font-bold">
              المُفْرَدَات
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dengarkan pelafalan murni dengan harakat lengkap dan simpan kata baru ke kamus pribadi Anda.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata atau arti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMufrodat.map((item) => {
          const saved = isWordSaved(item.id);
          const learned = isLessonDone(item.id);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
                learned ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/90 hover:border-emerald-300'
              }`}
            >
              {/* Top meta & action icons */}
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[11px]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleBookmark(item)}
                      title={saved ? 'Hapus dari kamus saya' : 'Simpan ke kamus saya'}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        saved
                          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {saved ? (
                        <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => speakArabic(item.arabic)}
                      title="Dengarkan suara pelafalan"
                      className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Script */}
                <div className="text-center py-4 bg-gradient-to-b from-slate-50/50 to-emerald-50/30 rounded-2xl border border-emerald-50 my-2">
                  <p className="font-arabic text-3xl sm:text-4xl text-slate-900 font-bold tracking-normal leading-loose">
                    {item.arabic}
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    {item.transliteration}
                  </p>
                </div>

                {/* Meaning */}
                <div className="mt-3">
                  <p className="text-sm font-bold text-slate-900">
                    {item.meaning}
                  </p>
                </div>

                {/* Example sentence */}
                {item.exampleArabic && (
                  <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/70 p-2.5 rounded-xl text-right">
                    <p className="font-arabic text-base text-slate-800 font-medium leading-relaxed">
                      {item.exampleArabic}
                    </p>
                    <p className="text-[11px] text-slate-500 text-left mt-1 italic">
                      "{item.exampleMeaning}"
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Action: Mark as Learned */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {learned ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Sudah Dikuasai (+30 XP)</span>
                  </span>
                ) : (
                  <button
                    onClick={() => markLearned(item)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tandai Sudah Paham (+30 XP)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMufrodat.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm text-slate-500">Tidak ada kosakata yang cocok dengan pencarian Anda.</p>
        </div>
      )}
    </div>
  );
};
