import React, { useState } from 'react';
import { QAWAID_DATA } from '../data/learningData';
import { useAuth } from '../context/AuthContext';
import { speakArabic } from '../lib/audio';
import {
  Compass,
  CheckCircle,
  Volume2,
  Check,
  X,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const QawaidView: React.FC = () => {
  const { recordLessonProgress, progressList } = useAuth();
  const [selectedLessonId, setSelectedLessonId] = useState<string>(QAWAID_DATA[0].id);
  const [quizAnswers, setQuizAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentLesson = QAWAID_DATA.find((l) => l.id === selectedLessonId) || QAWAID_DATA[0];
  const isLessonCompleted = progressList.some((p) => p.lessonId === currentLesson.id && p.completed);

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheckQuiz = async () => {
    setQuizSubmitted(true);
    let correct = 0;
    const questions = currentLesson.practiceQuestions || [];
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const score = Math.round((correct / (questions.length || 1)) * 100);
    await recordLessonProgress({
      lessonId: currentLesson.id,
      category: 'qawaid',
      score,
      completed: true,
    });
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Qawa'id (Kaidah Tata Bahasa Arab)
          </h1>
          <span className="font-arabic text-xl text-emerald-800 font-bold">
            القَوَاعِدُ النَّحْوِيَّة
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Pelajari struktur tata bahasa Nahwu & Shorof secara sistematis dilengkapi contoh aplikatif dan latihan pemahaman.
        </p>
      </div>

      {/* Main Layout: Sidebar of Lessons + Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Lessons List */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Daftar Modul Kaidah
          </p>
          {QAWAID_DATA.map((lesson) => {
            const isSelected = lesson.id === currentLesson.id;
            const completed = progressList.some((p) => p.lessonId === lesson.id && p.completed);

            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonId(lesson.id);
                  handleResetQuiz();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-md shadow-emerald-900/10'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="pr-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lesson.level}
                    </span>
                    {completed && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-emerald-900" />
                        <span>Selesai</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm mt-1.5 leading-snug">
                    {lesson.title}
                  </h3>
                </div>
                <span className={`font-arabic text-lg font-bold shrink-0 ${isSelected ? 'text-emerald-200' : 'text-emerald-700'}`}>
                  {lesson.arabicTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Active Lesson Body */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                  {currentLesson.level}
                </span>
                <span className="font-arabic text-2xl text-emerald-800 font-bold">
                  {currentLesson.arabicTitle}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                {currentLesson.title}
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {currentLesson.summary}
              </p>
            </div>

            {/* In-depth content */}
            <div className="space-y-6">
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-xs text-slate-700 leading-relaxed">
                <p className="font-medium">{currentLesson.content}</p>
              </div>

              {/* Rules & Examples */}
              <div className="space-y-5">
                {currentLesson.rules.map((rule, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-5 bg-white">
                    <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>{rule.ruleTitle}</span>
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {rule.explanation}
                    </p>

                    {/* Example Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rule.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between">
                            <button
                              onClick={() => speakArabic(ex.arabic)}
                              title="Dengarkan pengucapan"
                              className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <p className="font-arabic text-xl font-bold text-slate-900 text-right leading-loose">
                              {ex.arabic}
                            </p>
                          </div>
                          <div className="mt-2 text-xs">
                            <p className="font-semibold text-emerald-700">
                              {ex.transliteration}
                            </p>
                            <p className="text-slate-600 font-medium">
                              {ex.meaning}
                            </p>
                            {ex.note && (
                              <span className="inline-block mt-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200/50">
                                {ex.note}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Practice Questions Check */}
              {currentLesson.practiceQuestions && currentLesson.practiceQuestions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Latihan Pemahaman Materi
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {currentLesson.practiceQuestions.map((q, qIdx) => {
                      const userChoice = quizAnswers[qIdx];
                      const isCorrect = userChoice === q.correctIndex;

                      return (
                        <div
                          key={qIdx}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
                        >
                          <p className="font-bold text-slate-800 text-sm mb-3">
                            {qIdx + 1}. {q.question}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = userChoice === optIdx;
                              let btnClass = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300';

                              if (quizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  btnClass = 'bg-rose-100 border-rose-400 text-rose-800';
                                }
                              } else if (isSelected) {
                                btnClass = 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleOptionSelect(qIdx, optIdx)}
                                  disabled={quizSubmitted}
                                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIdx === q.correctIndex && (
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                  {quizSubmitted && isSelected && !isCorrect && (
                                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600">
                              <span className="font-bold text-emerald-800">Penjelasan: </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleCheckQuiz}
                        disabled={Object.keys(quizAnswers).length === 0}
                        className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Koreksi & Simpan Progres (+XP)</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Progres berhasil disimpan ke profil Anda!</span>
                        </span>
                        <button
                          onClick={handleResetQuiz}
                          className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer"
                        >
                          Coba Ulang Latihan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
