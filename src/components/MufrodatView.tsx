import React, { useState } from 'react';
import { MUFRODAT_DATA, MODERN_SANTRI_PHRASES } from '../data/learningData';
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
  Rotate3d,
  Layers,
  ChevronLeft,
  ChevronRight,
  Flame,
  Lightbulb,
  CheckCircle2,
  ThumbsUp,
  RotateCcw
} from 'lucide-react';

export const MufrodatView: React.FC = () => {
  const { savedWords, saveWordToFirestore, removeWordFromFirestore, recordLessonProgress, progressList, awardXP } = useAuth();
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');
  const [selectedChapter, setSelectedChapter] = useState<string>('Semua Bab');
  const [selectedMood, setSelectedMood] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Flashcard Mode State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [showModernPhrases, setShowModernPhrases] = useState<boolean>(false);

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
    const matchMood = selectedMood === 'semua' || item.mood === selectedMood;
    return matchChapter && matchSearch && matchMood;
  });

  const activeCard = filteredMufrodat[currentCardIndex] || filteredMufrodat[0];

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

  const handleCustomAudio = (text: string, rate: number = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } else {
      speakArabic(text);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < filteredMufrodat.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    } else {
      setCurrentCardIndex(filteredMufrodat.length - 1);
    }
  };

  const handleMasteryRating = async (status: 'bingung' | 'cukup' | 'hafal') => {
    if (status === 'hafal') {
      await awardXP(5);
      await recordLessonProgress({
        lessonId: activeCard.id,
        category: 'mufrodat',
        score: 100,
        completed: true,
      });
    }
    handleNextCard();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner with Clean Luxury Typography */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mufrodat Tematik Kelas 10 MA
            </h1>
            <span className="font-arabic text-2xl text-sky-700 font-bold">
              المُفْرَدَاتُ التَّعْلِيْمِيَّة
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
            <span>Kurikulum KMA 183</span>
            <span aria-hidden="true">·</span>
            <span>Metode Mnemonic 3D</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-700 font-semibold">Karya DikoSaputra</span>
          </div>
        </div>

        {/* Mode Selector: 3D Flashcard vs Full Catalog */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl border border-slate-300/80">
          <button
            onClick={() => setViewMode('flashcard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              viewMode === 'flashcard'
                ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5 text-amber-300" />
            <span>Kartu Flashcard 3D</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>Daftar Lengkap ({filteredMufrodat.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata Arab, latin, arti, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentCardIndex(0);
            }}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300/80 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-xs"
          />
        </div>

        {/* Mood/Category Segmented Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'semua', label: 'Semua Mood' },
            { id: 'gaul', label: '🔥 Ungkapan Keren' },
            { id: 'dasar', label: '✨ Dasar Ta\'aruf' },
            { id: 'keseharian', label: '🏠 Keseharian' },
            { id: 'akademik', label: '📚 Akademik MA' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMood(m.id);
                setCurrentCardIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedMood === m.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {chapters.map((ch) => (
          <button
            key={ch}
            onClick={() => {
              setSelectedChapter(ch);
              setCurrentCardIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium ${
              selectedChapter === ch
                ? 'bg-sky-700 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* MODE 1: 3D FLASHCARD STUDIO FOR STUDENTS */}
      {/* ========================================================= */}
      {viewMode === 'flashcard' && activeCard && (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Progress Header & Speed Controller */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-2">
            <span className="font-semibold">
              Kartu {currentCardIndex + 1} dari {filteredMufrodat.length}
            </span>

            {/* Audio Speed Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Kecepatan Suara:</span>
              <button
                onClick={() => setAudioSpeed(0.75)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                  audioSpeed === 0.75
                    ? 'bg-amber-400 text-slate-950 border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                0.75x (Lambat)
              </button>
              <button
                onClick={() => setAudioSpeed(1.0)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                  audioSpeed === 1.0
                    ? 'bg-amber-400 text-slate-950 border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                1.0x (Normal)
              </button>
            </div>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none perspective-[1000px] min-h-[360px]"
          >
            <div
              className={`relative w-full min-h-[360px] rounded-3xl p-8 transition-all duration-500 transform shadow-2xl border-2 ${
                isFlipped
                  ? 'bg-white border-amber-400 text-slate-900'
                  : 'bg-gradient-to-br from-[#071a2e] via-[#0c2a4a] to-[#061526] border-amber-400/40 text-white'
              } flex flex-col justify-between`}
            >
              {/* Card Top Metadata */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isFlipped ? 'bg-sky-100 text-sky-800' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  }`}>
                    {activeCard.wordType}
                  </span>
                  <span className={isFlipped ? 'text-slate-500' : 'text-sky-200/80'}>
                    {activeCard.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] italic ${isFlipped ? 'text-slate-400' : 'text-slate-300'}`}>
                    Klik kartu untuk membalik
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(activeCard);
                    }}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {isWordSaved(activeCard.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* CARD FRONT: Large Arabic Word & Audio */}
              {!isFlipped ? (
                <div className="text-center py-6 space-y-4">
                  <h2 className="font-arabic text-5xl sm:text-6xl font-bold text-amber-300 leading-tight drop-shadow-md">
                    {activeCard.arabic}
                  </h2>
                  <p className="text-sm text-slate-300 font-mono italic">
                    "{activeCard.transliteration}"
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomAudio(activeCard.arabic, audioSpeed);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Dengarkan Pengucapan ({audioSpeed}x)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* CARD BACK: Meaning, Mnemonic Hook, Example */
                <div className="text-center py-4 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Arti Kosakata:</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                      {activeCard.meaning}
                    </h3>
                  </div>

                  {/* Student Mnemonic Memory Hook */}
                  {activeCard.mnemonicTip && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-950 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-amber-900">Trik Ingat Santri (Mnemonic): </span>
                        <span>{activeCard.mnemonicTip}</span>
                      </div>
                    </div>
                  )}

                  {/* Example in Sentence */}
                  {activeCard.exampleArabic && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Contoh Kalimat:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomAudio(activeCard.exampleArabic!, audioSpeed);
                          }}
                          className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Dengar</span>
                        </button>
                      </div>
                      <p className="font-arabic text-lg font-bold text-sky-950 text-right dir-rtl" dir="rtl">
                        {activeCard.exampleArabic}
                      </p>
                      <p className="text-xs text-slate-600">
                        {activeCard.exampleMeaning}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer: Chapter Title & Flip Indicator */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className={isFlipped ? 'text-slate-500 font-medium' : 'text-sky-300/80 font-medium'}>
                  {activeCard.chapter}
                </span>
                <span className={isFlipped ? 'text-amber-700 font-bold' : 'text-amber-300 font-bold'}>
                  {isFlipped ? 'Tampak Belakang' : 'Tampak Depan'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation & Self-Assessment Action Bar */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleMasteryRating('bingung')}
                className="py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <span>🔴 Masih Ragu</span>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">Ulangi Nanti</span>
              </button>

              <button
                onClick={() => handleMasteryRating('cukup')}
                className="py-2.5 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <span>🟡 Cukup Paham</span>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">Lanjut</span>
              </button>

              <button
                onClick={() => handleMasteryRating('hafal')}
                className="py-2.5 px-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 font-extrabold text-xs transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-xs"
              >
                <span>🟢 Luar Kepala!</span>
                <span className="text-[10px] text-sky-700 font-semibold mt-0.5">+5 XP Diraih</span>
              </button>
            </div>

            {/* Previous / Next Arrow Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrevCard}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kartu Sebelumnya</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Balik Kartu</span>
              </button>

              <button
                onClick={handleNextCard}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Kartu Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: FULL CATALOG LIST VIEW */}
      {/* ========================================================= */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMufrodat.map((item) => {
            const isSaved = isWordSaved(item.id);
            const isDone = isLessonDone(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-amber-400/80 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200/60">
                      {item.wordType}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleBookmark(item)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                        title={isSaved ? 'Hapus dari Simpanan' : 'Simpan ke Kamus'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-sky-600 fill-sky-100" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCustomAudio(item.arabic, 1.0)}
                        className="p-1 rounded-lg hover:bg-sky-50 text-sky-700 transition-colors cursor-pointer"
                        title="Dengarkan Suara"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right my-2">
                    <h3 className="font-arabic text-2xl font-bold text-slate-900 group-hover:text-sky-900 transition-colors leading-relaxed">
                      {item.arabic}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono italic">
                      {item.transliteration}
                    </p>
                  </div>

                  <p className="text-xs font-bold text-slate-800 mt-2">
                    {item.meaning}
                  </p>

                  {item.mnemonicTip && (
                    <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-xl mt-2 border border-amber-200/60 leading-relaxed">
                      💡 <strong>Mnemonic:</strong> {item.mnemonicTip}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.category}</span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-sky-700 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Telah Dihafal
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern Youth Santri Slang Phrases Showcase */}
      <div className="rounded-3xl bg-gradient-to-br from-[#071a2e] to-[#061526] p-6 text-white border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">
              Ungkapan Santun & Gaul Santri Aliyah (Tren Arab Modern)
            </h3>
          </div>
          <button
            onClick={() => setShowModernPhrases(!showModernPhrases)}
            className="text-xs font-bold text-amber-300 hover:underline cursor-pointer"
          >
            {showModernPhrases ? 'Sembunyikan' : 'Buka Koleksi Ungkapan'}
          </button>
        </div>

        {showModernPhrases && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {MODERN_SANTRI_PHRASES.map((phrase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                    Frasa {idx + 1}
                  </span>
                  <button
                    onClick={() => handleCustomAudio(phrase.arabic, 1.0)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer"
                    title="Dengarkan Suara"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="font-arabic text-xl font-bold text-amber-200 text-right mt-1 dir-rtl" dir="rtl">
                  {phrase.arabic}
                </p>
                <p className="text-xs text-slate-300 font-mono italic mt-1">
                  "{phrase.transliteration}"
                </p>
                <p className="text-xs font-bold text-white mt-1">
                  {phrase.meaning}
                </p>
                <p className="text-[11px] text-sky-300/80 mt-1">
                  {phrase.context}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Copyright Note */}
      <div className="text-center text-xs text-slate-400 pt-2">
        Al-Bayan • Mufrodat Mnemonic Interaktif • Hak Cipta © 2026 DikoSaputra
      </div>
    </div>
  );
};
