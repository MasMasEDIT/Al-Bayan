import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { speakArabic } from '../lib/audio';
import {
  Bookmark,
  Volume2,
  Trash2,
  Plus,
  Layers,
  RotateCw,
  Sparkles,
} from 'lucide-react';

export const SavedWordsView: React.FC = () => {
  const { savedWords, removeWordFromFirestore, saveWordToFirestore } = useAuth();

  // Mode: 'list' | 'flashcard'
  const [viewMode, setViewMode] = useState<'list' | 'flashcard'>('list');

  // Flashcard state
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Add custom word modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newArabic, setNewArabic] = useState<string>('');
  const [newTrans, setNewTrans] = useState<string>('');
  const [newMeaning, setNewMeaning] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Umum');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleAddCustomWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArabic || !newMeaning) return;

    setIsSaving(true);
    try {
      const wordId = `custom_${Date.now()}`;
      await saveWordToFirestore({
        wordId,
        arabic: newArabic.trim(),
        transliteration: newTrans.trim(),
        meaning: newMeaning.trim(),
        category: newCategory.trim() || 'Umum',
      });
      setNewArabic('');
      setNewTrans('');
      setNewMeaning('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentFlashcard = savedWords[cardIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Kamus Saya (Kosakata Tersimpan)
            </h1>
            <span className="font-arabic text-xl text-amber-800 font-bold">
              مُفْرَدَاتِي
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daftar kosakata yang Anda simpan di Firestore. Dapat dipelajari kapan saja lewat mode Flashcard.
          </p>
        </div>

        {/* Action Buttons: Add Word & Flashcard Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {savedWords.length > 0 && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setViewMode('list');
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daftar ({savedWords.length})
              </button>
              <button
                onClick={() => {
                  setViewMode('flashcard');
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'flashcard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Mode Flashcard</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kata Baru</span>
          </button>
        </div>
      </div>

      {savedWords.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Belum Ada Kosakata yang Disimpan
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Buka menu Mufrodat untuk menandai kata yang ingin Anda hafal, atau klik tombol Tambah Kata Baru di atas.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kosakata Pertama</span>
          </button>
        </div>
      ) : viewMode === 'flashcard' ? (
        /* Flashcard Revision Mode */
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>
              Kartu ke-{cardIndex + 1} dari {savedWords.length}
            </span>
            <span>Klik kartu untuk membalik</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[280px] bg-gradient-to-br from-white to-sky-50/50 rounded-3xl p-8 border-2 border-sky-200 shadow-lg cursor-pointer flex flex-col justify-between items-center text-center transition-all hover:scale-[1.01]"
          >
            <div className="w-full flex justify-between items-center text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold text-[10px]">
                {currentFlashcard.category || 'Kosakata'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakArabic(currentFlashcard.arabic);
                }}
                className="p-1.5 rounded-lg text-sky-700 hover:bg-sky-100 transition-colors"
                title="Dengarkan pengucapan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {!isFlipped ? (
              <div className="py-6">
                <p className="font-arabic text-4xl sm:text-5xl font-bold text-slate-900 leading-loose">
                  {currentFlashcard.arabic}
                </p>
                {currentFlashcard.transliteration && (
                  <p className="text-sm font-semibold text-sky-700 mt-2">
                    {currentFlashcard.transliteration}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Klik untuk melihat arti</span>
                </p>
              </div>
            ) : (
              <div className="py-6">
                <p className="text-2xl font-bold text-slate-900">
                  {currentFlashcard.meaning}
                </p>
                <p className="font-arabic text-xl text-sky-800 font-bold mt-3">
                  {currentFlashcard.arabic}
                </p>
                <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Klik untuk kembali</span>
                </p>
              </div>
            )}

            <div className="w-full text-right text-[10px] text-slate-400">
              Disimpan di Firestore
            </div>
          </div>

          {/* Flashcard Navigation */}
          <div className="flex gap-3 justify-between">
            <button
              onClick={() => {
                setCardIndex((prev) => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              disabled={cardIndex === 0}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => {
                setCardIndex((prev) => Math.min(savedWords.length - 1, prev + 1));
                setIsFlipped(false);
              }}
              disabled={cardIndex === savedWords.length - 1}
              className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
            >
              Berikutnya
            </button>
          </div>
        </div>
      ) : (
        /* Words List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedWords.map((word) => (
            <div
              key={word.wordId}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                    {word.category || 'Umum'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakArabic(word.arabic)}
                      className="p-1 rounded-md text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                      title="Dengarkan pengucapan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeWordFromFirestore(word.wordId)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus dari kamus saya"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right my-2">
                  <p className="font-arabic text-2xl font-bold text-slate-900 leading-loose">
                    {word.arabic}
                  </p>
                </div>

                {word.transliteration && (
                  <p className="text-xs font-semibold text-sky-700">
                    {word.transliteration}
                  </p>
                )}
                <p className="text-xs font-bold text-slate-800 mt-1">
                  {word.meaning}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Tersimpan di Cloud</span>
                <span>{new Date(word.savedAt).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Word Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Tambah Kosakata Kustom</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCustomWord} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Teks Arab (Berharakat):</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: مَسْجِدٌ"
                  value={newArabic}
                  onChange={(e) => setNewArabic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-lg font-arabic font-bold text-right focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Cara Baca (Transliterasi Latin):</label>
                <input
                  type="text"
                  placeholder="Contoh: Masjidun"
                  value={newTrans}
                  onChange={(e) => setNewTrans(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Arti Bahasa Indonesia:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Masjid / Tempat Ibadah"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kategori:</label>
                <input
                  type="text"
                  placeholder="Contoh: Tempat / Bangunan"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newArabic || !newMeaning}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan ke Firestore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
