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
  BookOpen,
} from 'lucide-react';

export const MufrodatView: React.FC = () => {
  const { savedWords, saveWordToFirestore, removeWordFromFirestore, recordLessonProgress, progressList } = useAuth();
  const [selectedChapter, setSelectedChapter] = useState<string>('Semua Bab');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const chapters = [
    'Semua Bab',
    'Bab 1: التحيات والتعارف',
    'Bab 2: الأسرة والبيت',
    'Bab 3: المدرسة ومرافقها',
    'Bab 4: الحياة اليومية',
    'Bab 5: الهواية والترويح',
    'Bab 6: الطعام والشراب',
  ];

  const filteredMufrodat = MUFRODAT_DATA.filter((item) => {
    const matchChapter = selectedChapter === 'Semua Bab' || item.chapter.includes(selectedChapter.split(':')[0]);
    const matchSearch =
      item.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchChapter && matchSearch;
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
        category: `${item.chapter.split(':')[0]} - ${item.category}`,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Mufrodat Tematik Kelas 10 MA
            </h1>
            <span className="font-arabic text-xl text-emerald-800 font-bold">
              المُفْرَدَاتُ التَّعْلِيْمِيَّة
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kosakata pilihan kurikulum KMA 183 berharakat lengkap, audio pelafalan asli, jenis kata (Isim/Fi'il), dan contoh kalimat kontekstual.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata Arab, latin, atau arti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs"
          />
        </div>
      </div>

      {/* Chapter Pills (Bab 1 - 6 MA) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {chapters.map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChapter(ch)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedChapter === ch
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400'
            }`}
          >
            {ch}
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
                learned ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              {/* Top metadata & bookmark/audio actions */}
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-bold text-[10px]">
                      {item.chapter.split(':')[0]}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[10px]">
                      {item.wordType}
                    </span>
                  </div>

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
                      className="p-1.5 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Script */}
                <div className="text-center py-4 bg-gradient-to-b from-slate-50/60 to-emerald-50/30 rounded-2xl border border-emerald-50/80 my-2">
                  <p className="font-arabic text-3xl sm:text-4xl text-slate-900 font-bold tracking-normal leading-loose">
                    {item.arabic}
                  </p>
                  <p className="text-xs font-semibold text-emerald-800 mt-1">
                    {item.transliteration}
                  </p>
                </div>

                {/* Meaning */}
                <div className="mt-3">
                  <p className="text-sm font-bold text-slate-900">
                    {item.meaning}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kategori: {item.category}
                  </p>
                </div>

                {/* Example sentence */}
                {item.exampleArabic && (
                  <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-2xl text-right">
                    <p className="font-arabic text-base text-slate-800 font-medium leading-relaxed">
                      {item.exampleArabic}
                    </p>
                    <p className="text-[11px] text-slate-500 text-left mt-1.5 italic">
                      "{item.exampleMeaning}"
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Action: Mark as Learned */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {learned ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Sudah Dikuasai (+35 XP)</span>
                  </span>
                ) : (
                  <button
                    onClick={() => markLearned(item)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tandai Sudah Paham (+35 XP)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMufrodat.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Tidak ada kosakata yang cocok</p>
          <p className="text-xs text-slate-500 mt-0.5">Silakan pilih bab lain atau ubah kata kunci pencarian Anda.</p>
        </div>
      )}
    </div>
  );
};
