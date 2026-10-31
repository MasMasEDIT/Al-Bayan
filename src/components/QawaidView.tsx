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
  FlaskConical,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const QawaidView: React.FC = () => {
  const { recordLessonProgress, progressList, awardXP } = useAuth();
  const [selectedLessonId, setSelectedLessonId] = useState<string>(QAWAID_DATA[0].id);
  const [activeTab, setActiveTab] = useState<'modul' | 'lab'>('lab');
  const [quizAnswers, setQuizAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Interactive Nahwu Lab Simulator State
  const [labGender, setLabGender] = useState<'mudzakkar' | 'muannats'>('mudzakkar');
  const [labAmilAn, setLabAmilAn] = useState<boolean>(false);
  const [labNaatDefinite, setLabNaatDefinite] = useState<boolean>(true);

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
    if (score >= 50) {
      await awardXP(25);
    }
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
      {/* Title Header with Clean Typography */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Qawa'id Nahwu & Shorof Kelas 10 MA
            </h1>
            <span className="font-arabic text-2xl text-sky-700 font-bold">
              القَوَاعِدُ النَّحْوِيَّة
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
            <span>Kaidah Baku KMA 183</span>
            <span aria-hidden="true">·</span>
            <span>Laboratorium Rumus Interaktif</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-700 font-semibold">Karya DikoSaputra</span>
          </div>
        </div>

        {/* View Switcher: Interactive Lab vs Modul Teori */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl border border-slate-300/80">
          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'lab'
                ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
            <span>Lab Rumus Visual</span>
          </button>

          <button
            onClick={() => setActiveTab('modul')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'modul'
                ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Modul Nahwu & Latihan</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: INTERACTIVE NAHWU FORMULA LAB */}
      {/* ========================================================= */}
      {activeTab === 'lab' && (
        <div className="space-y-6">
          {/* Lab Intro */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#071a2e] via-[#0c2a4a] to-[#061526] text-white border border-amber-500/30 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Eksperimen Kaidah Visual
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-0.5">
                  Laboratorium Transformasi Kalimat Nahwu
                </h2>
                <p className="text-xs text-sky-200/80 mt-1 max-w-2xl leading-relaxed">
                  Sentuh tombol pengubah di bawah untuk melihat bagaimana perubahan gender, huruf amil, dan kata sifat secara otomatis mengubah i'rab dan harakat akhir kata bahasa Arab!
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 hidden sm:block">
                <FlaskConical className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* SIMULATOR 1: JUMLAH ISMIYYAH HARMONIZER */}
            <div className="bg-white rounded-3xl p-6 border border-amber-500/20 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Simulator 1</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Keselarasan Jumlah Ismiyyah</h3>
                </div>
                <button
                  onClick={() => speakArabic(labGender === 'mudzakkar' ? 'الطَّالِبُ نَشِيْطٌ فِي الْمَدْرَسَةِ' : 'الطَّالِبَةُ نَشِيْطَةٌ فِي الْمَدْرَسَةِ')}
                  className="p-1.5 rounded-xl bg-sky-50 text-sky-800 hover:bg-sky-100 transition-colors cursor-pointer"
                  title="Dengarkan Suara"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Controls */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setLabGender('mudzakkar')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    labGender === 'mudzakkar'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🧑 Mudzakkar (Laki-laki)
                </button>
                <button
                  onClick={() => setLabGender('muannats')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    labGender === 'muannats'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🧕 Muannats (Perempuan)
                </button>
              </div>

              {/* Dynamic Sentence Display */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-3">
                <div className="flex items-center justify-center gap-3 dir-rtl text-2xl sm:text-3xl font-arabic font-bold" dir="rtl">
                  <span className="px-3 py-1 rounded-xl bg-sky-800 text-sky-200 border border-sky-400/40">
                    {labGender === 'mudzakkar' ? 'الطَّالِبُ' : 'الطَّالِبَةُ'}
                  </span>
                  <span className="text-slate-400 font-sans text-xl">+</span>
                  <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950">
                    {labGender === 'mudzakkar' ? 'نَشِيْطٌ' : 'نَشِيْطَةٌ'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {labGender === 'mudzakkar'
                    ? 'Siswa (lk) itu rajin aktif di madrasah.'
                    : 'Siswi (pr) itu rajin aktif di madrasah.'}
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold">Bedah Rumus: </span>
                <p>
                  {labGender === 'mudzakkar'
                    ? 'Mubtada\' mudzakkar (الطَّالِبُ) berharakat dhammah, diikuti Khabar mudzakkar (نَشِيْطٌ) bertanwin dhammah.'
                    : 'Ketika Mubtada\' berubah muannats (الطَّالِبَةُ berakhiran ة), Khabar WAJIB menambahkan Ta Marbuthah menjadi (نَشِيْطَةٌ)!'}
                </p>
              </div>
            </div>

            {/* SIMULATOR 2: AMIL NAWASHIB (HURUF أَنْ) */}
            <div className="bg-white rounded-3xl p-6 border border-amber-500/20 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Simulator 2</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Amil Nawashib: Efek Huruf "أَنْ"</h3>
                </div>
                <button
                  onClick={() => speakArabic(labAmilAn ? 'أُحِبُّ أَنْ أَقْرَأَ الْكُتُبَ' : 'أَقْرَأُ الْكُتُبَ كُلَّ يَوْمٍ')}
                  className="p-1.5 rounded-xl bg-sky-50 text-sky-800 hover:bg-sky-100 transition-colors cursor-pointer"
                  title="Dengarkan Suara"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Controls */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setLabAmilAn(false)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !labAmilAn
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tanpa Amil (Asli Marfu')
                </button>
                <button
                  onClick={() => setLabAmilAn(true)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    labAmilAn
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ Masukkan Huruf "أَنْ"
                </button>
              </div>

              {/* Dynamic Sentence Display */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-3">
                <div className="flex items-center justify-center gap-3 dir-rtl text-2xl sm:text-3xl font-arabic font-bold" dir="rtl">
                  {labAmilAn ? (
                    <>
                      <span className="text-sky-300">أُحِبُّ</span>
                      <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-bold">أَنْ</span>
                      <span className="px-3 py-1 rounded-xl bg-rose-600 text-white">أَقْرَأَ</span>
                    </>
                  ) : (
                    <>
                      <span className="px-3 py-1 rounded-xl bg-blue-600 text-white">أَقْرَأُ</span>
                      <span className="text-slate-300">الْكُتُبَ</span>
                    </>
                  )}
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {labAmilAn
                    ? 'Saya suka (untuk) membaca buku-buku referensi.'
                    : 'Saya membaca buku-buku referensi setiap hari.'}
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
                <span className="font-bold">Bedah Kaidah: </span>
                <p>
                  {labAmilAn
                    ? 'Huruf "أَنْ" adalah amil nawashib (penashab). Harakat akhir kata kerja "أَقْرَأُ" langsung berganti menjadi fathah manshub "أَقْرَأَ"!'
                    : 'Fi\'il mudhari\' asli selalu berharakat akhir dhammah (marfu\'): "أَقْرَأُ".'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Quiz Shortcut */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Ingin Menguji Pemahaman Kaidahmu?</h4>
              <p className="text-xs text-slate-500">Buka modul nahwu lengkap dengan evaluasi kuis berhadiah +25 XP.</p>
            </div>
            <button
              onClick={() => setActiveTab('modul')}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Buka Modul & Kuis Nahwu</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: FULL NAHWU MODULES & QUIZ EVALUATION */}
      {/* ========================================================= */}
      {activeTab === 'modul' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Lessons List */}
          <div className="lg:col-span-4 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
              Modul Kaidah Pokok Kelas 10 MA
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
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-900 text-white border-sky-900 shadow-md shadow-sky-950/20'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="pr-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-50 text-amber-800 border border-amber-200/50'
                        }`}
                      >
                        {lesson.chapter.split(':')[0]}
                      </span>
                      {completed && (
                        <span className="flex items-center gap-1 text-[10px] text-sky-400 font-bold">
                          <CheckCircle className="w-3 h-3 text-sky-400" />
                          Lulus
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm mt-1">{lesson.title}</h3>
                    <p
                      className={`text-[11px] mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-sky-200' : 'text-slate-500'
                      }`}
                    >
                      {lesson.summary}
                    </p>
                  </div>
                  <span className="font-arabic text-xl font-bold opacity-80 shrink-0">
                    {lesson.arabicTitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Lesson Details & Practice Questions */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {currentLesson.chapter}
                </span>
                <span className="text-slate-400">{currentLesson.level}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                {currentLesson.title}
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {currentLesson.content}
              </p>
            </div>

            {/* Rules list */}
            <div className="space-y-5">
              {currentLesson.rules.map((rule, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-800 text-white text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{rule.ruleTitle}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {rule.explanation}
                  </p>

                  {/* Examples */}
                  <div className="pl-8 space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Contoh Kalimat Sesuai Kaidah:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rule.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between text-right">
                            <button
                              onClick={() => speakArabic(ex.arabic)}
                              className="p-1 rounded-lg text-sky-800 hover:bg-sky-50 transition-colors cursor-pointer"
                              title="Dengarkan Contoh"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-arabic text-lg font-bold text-sky-950 dir-rtl" dir="rtl">
                              {ex.arabic}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 font-medium">{ex.meaning}</p>
                          {ex.note && (
                            <span className="text-[10px] text-amber-700 font-semibold mt-1">
                              Catatan: {ex.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Practice Questions (Evaluasi Mandiri) */}
            {currentLesson.practiceQuestions && currentLesson.practiceQuestions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-sky-700" />
                      <span>Uji Pemahaman Kaidah ({currentLesson.practiceQuestions.length} Soal)</span>
                    </h3>
                    <p className="text-xs text-slate-500">Pilih jawaban yang paling tepat sesuai kaidah nahwu MA</p>
                  </div>

                  {quizSubmitted && (
                    <button
                      onClick={handleResetQuiz}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulangi Kuis</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {currentLesson.practiceQuestions.map((q, qIdx) => {
                    const selected = quizAnswers[qIdx];
                    const isCorrect = selected === q.correctIndex;

                    return (
                      <div
                        key={qIdx}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                      >
                        <p className="font-bold text-xs sm:text-sm text-slate-900">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isThisOptionSelected = selected === optIdx;
                            let style = 'bg-white border-slate-200 text-slate-700 hover:border-sky-300';

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                style = 'bg-sky-100 border-sky-400 text-sky-950 font-bold';
                              } else if (isThisOptionSelected) {
                                style = 'bg-rose-100 border-rose-400 text-rose-950 font-semibold';
                              }
                            } else if (isThisOptionSelected) {
                              style = 'bg-sky-700 text-white font-bold border-sky-700';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleOptionSelect(qIdx, optIdx)}
                                disabled={quizSubmitted}
                                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${style}`}
                              >
                                <span className="font-arabic text-sm">{opt}</span>
                                {quizSubmitted && optIdx === q.correctIndex && (
                                  <Check className="w-4 h-4 text-sky-700 shrink-0" />
                                )}
                                {quizSubmitted && isThisOptionSelected && !isCorrect && (
                                  <X className="w-4 h-4 text-rose-700 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                            isCorrect ? 'bg-sky-50 text-sky-900 border border-sky-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                          }`}>
                            <span className="font-bold">{isCorrect ? 'Benar!' : 'Kurang tepat.'} </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!quizSubmitted && (
                  <button
                    onClick={handleCheckQuiz}
                    disabled={Object.keys(quizAnswers).length < currentLesson.practiceQuestions.length}
                    className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Periksa Jawaban Saya & Simpan Skor (+25 XP)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Copyright Note */}
      <div className="text-center text-xs text-slate-400 pt-2">
        Al-Bayan • Laboratorium Qawa'id Nahwu Interaktif • Hak Cipta © 2026 DikoSaputra
      </div>
    </div>
  );
};
