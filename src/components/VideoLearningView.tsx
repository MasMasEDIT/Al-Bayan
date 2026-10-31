import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { VIDEO_LESSONS_DATA } from '../data/learningData';
import { VideoLessonItem } from '../types';
import {
  Video,
  Play,
  Clock,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  BookOpen,
  Award,
  ChevronRight,
  BookmarkPlus,
  BookmarkCheck,
  Film
} from 'lucide-react';

export const VideoLearningView: React.FC = () => {
  const { awardXP, saveWordToFirestore, savedWords } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<VideoLessonItem>(VIDEO_LESSONS_DATA[0]);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'keypoints' | 'quiz'>('transcript');

  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectVideo = (item: VideoLessonItem) => {
    setSelectedVideo(item);
    setQuizAnswered(null);
    setQuizPassed(false);
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    setQuizAnswered(optionIdx);
    if (selectedVideo.checkpointQuiz && optionIdx === selectedVideo.checkpointQuiz.answerIndex) {
      setQuizPassed(true);
      awardXP(20);
    } else {
      setQuizPassed(false);
    }
  };

  const isLineSaved = (arabic: string) => {
    return savedWords.some((sw) => sw.arabic === arabic);
  };

  const handleSaveTranscriptLine = async (line: { arabic: string; transliteration: string; indonesian: string }) => {
    await saveWordToFirestore({
      wordId: `vid-${selectedVideo.id}-${Date.now()}`,
      arabic: line.arabic,
      transliteration: line.transliteration,
      meaning: line.indonesian,
      category: `Video Bab ${selectedVideo.bab}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Royal Luxury Header with Copyright DikoSaputra */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06241c] via-[#093529] to-[#041a15] p-6 sm:p-8 border border-amber-500/30 shadow-2xl shadow-emerald-950/40 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-3">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Studio Video Animasi Bahasa Arab KMA 183</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Video Animasi Pembelajaran Kelas 10
            </h1>
            <p className="text-sm text-emerald-200/80 mt-1 max-w-2xl">
              Tonton animasi visual kontekstual santri Aliyah, ikuti transkrip dialog dwibahasa interaktif, dan uji pemahamanmu dengan kuis berhadiah XP!
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-xs text-amber-300 font-semibold shadow-xs">
            Diproduksi khusus oleh: <span className="font-extrabold text-white">DikoSaputra</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Video Player + Episode Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Player & Transcript Studio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Elegant Video Player Card */}
          <div className="bg-white rounded-3xl border border-amber-500/20 shadow-xl overflow-hidden">
            {/* 16:9 Video Embed with Luxury Frame */}
            <div className="relative aspect-video w-full bg-slate-950 border-b border-amber-500/20">
              <iframe
                src={`${selectedVideo.videoUrl}?rel=0&modestbranding=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Details Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-b from-white to-slate-50/50">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Bab {selectedVideo.bab}: Madrasah Aliyah Kelas 10
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedVideo.duration}</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {selectedVideo.title}
                </h2>
                <span className="font-arabic text-xl font-bold text-amber-700">
                  {selectedVideo.arabicTitle}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>

            {/* Video Tab Selector (Transcript vs Poin Penting vs Kuis Pemahaman) */}
            <div className="flex border-t border-slate-200 bg-slate-50 px-4 pt-2 gap-2">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'transcript'
                    ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Transkrip Interaktif</span>
              </button>

              <button
                onClick={() => setActiveTab('keypoints')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'keypoints'
                    ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Poin Pembelajaran ({selectedVideo.keyPoints.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 text-purple-600" />
                <span>Kuis Pemahaman Video</span>
                {quizPassed && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              {/* TAB 1: TRANSCRIPT */}
              {activeTab === 'transcript' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 mb-2">
                    Dengarkan pelafalan tiap bait percakapan bahasa Arab dan simpan kalimat penting ke kamus pribadimu:
                  </p>
                  {selectedVideo.transcript.map((line, idx) => {
                    const isSaved = isLineSaved(line.arabic);
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/80 hover:bg-amber-50/40 border border-slate-200/80 transition-colors flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <button
                              onClick={() => handlePronounce(line.arabic)}
                              className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
                              title="Dengarkan Pelafalan Arab"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleSaveTranscriptLine(line)}
                              disabled={isSaved}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isSaved
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-300'
                              }`}
                              title={isSaved ? 'Tersimpan di Kamus' : 'Simpan ke Kamus Saya'}
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <BookmarkPlus className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="text-right dir-rtl" dir="rtl">
                            <p className="font-arabic text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                              {line.arabic}
                            </p>
                          </div>
                        </div>

                        <div className="pl-8 text-left">
                          <p className="text-xs text-slate-500 italic font-mono">
                            "{line.transliteration}"
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                            {line.indonesian}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: KEY POINTS */}
              {activeTab === 'keypoints' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Rangkuman Kaidah & Materi Pokok Bab {selectedVideo.bab}</span>
                    </h3>
                  </div>
                  {selectedVideo.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: QUIZ CHECKPOINT */}
              {activeTab === 'quiz' && selectedVideo.checkpointQuiz && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700">
                      Uji Pemahaman Video • Hadiah +20 XP
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      {selectedVideo.checkpointQuiz.question}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {selectedVideo.checkpointQuiz.options.map((opt, optIdx) => {
                      const isChosen = quizAnswered === optIdx;
                      const isCorrect = optIdx === selectedVideo.checkpointQuiz?.answerIndex;

                      let btnStyle = 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-slate-800';
                      if (quizAnswered !== null) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isChosen) {
                          btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerQuiz(optIdx)}
                          disabled={quizAnswered !== null}
                          className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizAnswered !== null && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {quizAnswered !== null && isChosen && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered !== null && (
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      quizPassed
                        ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                        : 'bg-rose-50 border border-rose-300 text-rose-950'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        {quizPassed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Mumtaz! Jawabanmu benar (+20 XP diraih)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Jawaban belum tepat. Simak kembali penjelasannya:</span>
                          </>
                        )}
                      </div>
                      <p>{selectedVideo.checkpointQuiz.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Chapter Playlist / Video Directory */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-amber-500/30 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm">Daftar Modul Video</h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">
              6 Bab Lengkap
            </span>
          </div>

          <div className="space-y-2.5">
            {VIDEO_LESSONS_DATA.map((video) => {
              const isSelected = selectedVideo.id === video.id;
              return (
                <button
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-800 to-[#07251e] text-white border-amber-400/60 shadow-lg shadow-emerald-950/40'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-500/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Bab {video.bab}
                    </span>
                    <span className={`text-[11px] flex items-center gap-1 font-semibold ${
                      isSelected ? 'text-emerald-200' : 'text-slate-400'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm mt-2 leading-snug">
                    {video.title}
                  </h4>
                  <p className={`font-arabic text-xs font-semibold mt-1 ${
                    isSelected ? 'text-amber-300' : 'text-emerald-800'
                  }`}>
                    {video.arabicTitle}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-emerald-300' : 'text-slate-500'}>
                      {video.transcript.length} Bait Dialog
                    </span>
                    <div className="flex items-center gap-1 font-bold">
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isSelected ? 'Sedang Diputar' : 'Putar Video'}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DikoSaputra Signature Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#06241c] to-[#041a15] border border-amber-500/30 text-white text-center">
            <span className="font-arabic text-amber-300 text-lg font-bold">الْبَيَان</span>
            <p className="text-xs font-bold text-white mt-1">
              Hak Cipta Terdaftar: DikoSaputra
            </p>
            <p className="text-[10px] text-emerald-300/80 mt-0.5">
              Media Belajar Bahasa Arab Terpadu Kelas 10 Madrasah Aliyah
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
