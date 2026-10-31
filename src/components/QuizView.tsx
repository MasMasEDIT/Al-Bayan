import React, { useState } from 'react';
import { INITIAL_QUIZ_PRESETS } from '../data/learningData';
import { useAuth } from '../context/AuthContext';
import { speakArabic } from '../lib/audio';
import {
  Award,
  Sparkles,
  Volume2,
  Check,
  X,
  RotateCcw,
  History,
  Loader2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface QuestionItem {
  id: number;
  question: string;
  arabicPhrase?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QuizView: React.FC = () => {
  const { recordQuizResult, quizResults } = useAuth();

  // Active quiz state
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // AI Quiz Generator state
  const [aiTopic, setAiTopic] = useState<string>('mufrodat');
  const [aiLevel, setAiLevel] = useState<string>('pemula');
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Tab: 'quiz' | 'history'
  const [subTab, setSubTab] = useState<'quiz' | 'history'>('quiz');

  const startPresetQuiz = (preset: typeof INITIAL_QUIZ_PRESETS[0]) => {
    setActiveQuizTitle(preset.title);
    setActiveCategory(preset.category);
    setQuestions(preset.questions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScoreCount(0);
    setQuizFinished(false);
  };

  const handleGenerateAiQuiz = async () => {
    setIsGeneratingAiQuiz(true);
    setGenError(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          level: aiLevel,
          count: 5,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi generator kuis AI.');
      }

      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error('Format kuis yang dihasilkan tidak valid.');
      }

      setActiveQuizTitle(`Kuis AI: ${aiTopic.toUpperCase()} (${aiLevel})`);
      setActiveCategory(aiTopic);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setScoreCount(0);
      setQuizFinished(false);
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || 'Gagal membuat kuis.');
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(index);
    setIsAnswerRevealed(true);

    const isCorrect = index === questions[currentIndex].correctIndex;
    if (isCorrect) {
      setScoreCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      // Quiz Finished! Save result to Firestore
      setQuizFinished(true);
      const total = questions.length;
      const finalScore = scoreCount;
      const percentage = Math.round((finalScore / total) * 100);

      const quizId = `quiz_${Date.now()}`;
      await recordQuizResult({
        quizId,
        quizTitle: activeQuizTitle || 'Kuis Bahasa Arab',
        category: activeCategory || 'Umum',
        score: finalScore,
        totalQuestions: total,
        percentage,
      });
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Kuis & Evaluasi Belajar
            </h1>
            <span className="font-arabic text-xl text-amber-800 font-bold">
              الاِخْتِبَارَات
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Uji pemahaman bahasa Arab Anda, dapatkan tambahan XP, dan pantau perkembangan skor di Firestore.
          </p>
        </div>

        {/* Sub-tabs: Quiz vs History */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSubTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'quiz' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Latihan Kuis
          </button>
          <button
            onClick={() => setSubTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat ({quizResults.length})</span>
          </button>
        </div>
      </div>

      {subTab === 'history' ? (
        /* History View */
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-sky-600" />
            <span>Catatan Hasil Kuis Anda di Firestore</span>
          </h2>

          {quizResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada riwayat kuis yang tersimpan. Mulai kuis pertama Anda sekarang!
            </div>
          ) : (
            <div className="space-y-3">
              {quizResults.map((res) => (
                <div
                  key={res.quizId}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{res.quizTitle}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kategori: <span className="capitalize font-semibold">{res.category}</span> •{' '}
                      {new Date(res.completedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-sky-700">
                        {res.percentage}%
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {res.score}/{res.totalQuestions} Benar
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold ${
                        res.percentage >= 80
                          ? 'bg-sky-100 text-sky-800'
                          : res.percentage >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {res.percentage >= 80 ? 'Mumtaz (Istimewa)' : res.percentage >= 60 ? 'Jayyid (Bagus)' : 'Perlu Latihan'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : questions.length === 0 ? (
        /* Quiz Selection & AI Generator */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preset Quizzes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-600" />
              <span>Pilihan Kuis Siap Uji</span>
            </h2>
            <p className="text-xs text-slate-500">
              Kuis yang telah dikurasi oleh kurikulum untuk menguji pemahaman dasar kosakata dan kaidah.
            </p>

            <div className="space-y-3 pt-2">
              {INITIAL_QUIZ_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-sky-500 transition-colors bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold uppercase">
                      {preset.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1.5">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {preset.questions.length} Soal Pilihan Ganda • +XP Progres
                    </p>
                  </div>

                  <button
                    onClick={() => startPresetQuiz(preset)}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Mulai Kuis Ini
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Custom Quiz Generator */}
          <div className="bg-gradient-to-br from-amber-500/10 via-white to-sky-500/10 rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-900">
                  Generator Kuis AI Gemini
                </h2>
                <p className="text-xs text-slate-500">
                  Buat soal kuis baru secara otomatis sesuai topik dan tingkat Anda.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {/* Topic Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Topik Kuis:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'Ta\'aruf & Aqsamul Kalam (Kelas 10 MA)', label: 'Bab 1: Ta\'aruf & Pembagian Kata' },
                    { id: 'Usrah & Dhomir Muttashil (Kelas 10 MA)', label: 'Bab 2: Usrah & Dhomir' },
                    { id: 'Madrasah & Na\'at Man\'ut (Kelas 10 MA)', label: 'Bab 3: Fasilitas MA & Na\'at' },
                    { id: 'Hayat Yaumiyyah & Jumlah Fi\'liyyah', label: 'Bab 4: Keseharian Santri MA' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setAiTopic(t.id)}
                      className={`py-2 px-3 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                        aiTopic === t.id
                          ? 'bg-amber-600 text-white border-amber-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tingkat Kesulitan:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['pemula', 'menengah', 'mahir'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setAiLevel(lvl)}
                      className={`py-2 px-2 text-center rounded-xl border capitalize font-medium transition-colors cursor-pointer ${
                        aiLevel === lvl
                          ? 'bg-amber-600 text-white border-amber-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {genError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {genError}
                </div>
              )}

              <button
                onClick={handleGenerateAiQuiz}
                disabled={isGeneratingAiQuiz}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-sky-600 hover:from-amber-700 hover:to-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingAiQuiz ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini Sedang Meracik Soal...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Hasilkan Kuis AI Otomatis (5 Soal)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : quizFinished ? (
        /* Quiz Finished Summary */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-xl mx-auto shadow-md space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-sky-100 text-sky-800 flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Kuis Selesai!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeQuizTitle}
            </p>
          </div>

          <div className="py-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-4xl font-extrabold text-sky-700">
              {Math.round((scoreCount / questions.length) * 100)}%
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Benar {scoreCount} dari {questions.length} Pertanyaan
            </p>
            <div className="inline-flex items-center gap-1 text-xs text-amber-700 font-bold bg-amber-100 px-3 py-1 rounded-full mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{Math.round((scoreCount / questions.length) * 50)} XP Ditambahkan ke Profil</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => setQuestions([])}
              className="py-2.5 px-5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Kembali ke Menu Kuis
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswerRevealed(false);
                setScoreCount(0);
                setQuizFinished(false);
              }}
              className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Kuis Ini</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Display */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          {/* Header Progress */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-sky-700 uppercase">
                {activeQuizTitle}
              </span>
              <p className="text-xs text-slate-500">
                Soal {currentIndex + 1} dari {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-sky-800">Skor: {scoreCount}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Optional Arabic phrase with Audio */}
            {currentQ.arabicPhrase && (
              <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 flex items-center justify-between">
                <button
                  onClick={() => speakArabic(currentQ.arabicPhrase || '')}
                  className="p-1.5 rounded-lg text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer"
                  title="Dengarkan pelafalan"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <p className="font-arabic text-2xl sm:text-3xl font-bold text-slate-900 text-right leading-loose">
                  {currentQ.arabicPhrase}
                </p>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = optIdx === currentQ.correctIndex;
              let btnClass = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

              if (isAnswerRevealed) {
                if (isCorrect) {
                  btnClass = 'bg-sky-100 border-sky-500 text-sky-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-100 border-rose-400 text-rose-800';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswerRevealed}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer text-xs sm:text-sm ${btnClass}`}
                >
                  <span className="font-medium">{opt}</span>
                  {isAnswerRevealed && isCorrect && (
                    <Check className="w-4 h-4 text-sky-700 shrink-0 ml-2" />
                  )}
                  {isAnswerRevealed && isSelected && !isCorrect && (
                    <X className="w-4 h-4 text-rose-700 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {isAnswerRevealed && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
              <p className="font-bold">Penjelasan:</p>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswerRevealed && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
