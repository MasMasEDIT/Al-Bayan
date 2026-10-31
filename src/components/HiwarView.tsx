import React, { useState } from 'react';
import { HIWAR_DATA } from '../data/learningData';
import { useAuth } from '../context/AuthContext';
import { speakArabic } from '../lib/audio';
import {
  MessageSquare,
  Volume2,
  Eye,
  EyeOff,
  CheckCircle,
  Play,
  Sparkles,
  Smartphone,
  BookOpen,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Send,
  User,
  GraduationCap
} from 'lucide-react';

export const HiwarView: React.FC = () => {
  const { recordLessonProgress, progressList, awardXP } = useAuth();
  const [selectedHiwarId, setSelectedHiwarId] = useState<string>(HIWAR_DATA[0].id);
  const [activeMode, setActiveMode] = useState<'roleplay' | 'comic'>('roleplay');
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

  // Roleplay Simulator State
  const [chatStep, setChatStep] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [roleplayScore, setRoleplayScore] = useState<number>(0);
  const [roleplayDone, setRoleplayDone] = useState<boolean>(false);

  const currentHiwar = HIWAR_DATA.find((h) => h.id === selectedHiwarId) || HIWAR_DATA[0];
  const isCompleted = progressList.some((p) => p.lessonId === currentHiwar.id && p.completed);

  const handleSelectHiwar = (id: string) => {
    setSelectedHiwarId(id);
    setChatStep(0);
    setSelectedChoice(null);
    setRoleplayDone(false);
  };

  const handleChoiceSelect = async (choiceIdx: number, isCorrect: boolean) => {
    setSelectedChoice(choiceIdx);
    if (isCorrect) {
      setRoleplayScore((prev) => prev + 25);
      await awardXP(15);
    }
  };

  const handleNextDialogueStep = () => {
    setSelectedChoice(null);
    if (chatStep < currentHiwar.dialogues.length - 1) {
      setChatStep((prev) => prev + 1);
    } else {
      setRoleplayDone(true);
      recordLessonProgress({
        lessonId: currentHiwar.id,
        category: 'hiwar',
        score: 100,
        completed: true,
      });
    }
  };

  const resetRoleplay = () => {
    setChatStep(0);
    setSelectedChoice(null);
    setRoleplayScore(0);
    setRoleplayDone(false);
  };

  const playEntireDialogue = () => {
    let delay = 0;
    currentHiwar.dialogues.forEach((d) => {
      setTimeout(() => {
        speakArabic(d.arabic);
      }, delay);
      delay += 3500;
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hiwar Santri (Simulasi Percakapan Lisan)
            </h1>
            <span className="font-arabic text-2xl text-sky-700 font-bold">
              الحِوَارَاتُ التَّفَاعُلِيَّة
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
            <span>Kelas 10 MA (KMA 183)</span>
            <span aria-hidden="true">·</span>
            <span>Maharah Kalam & Istima'</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-700 font-semibold">Karya DikoSaputra</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl border border-slate-300/80">
          <button
            onClick={() => setActiveMode('roleplay')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeMode === 'roleplay'
                ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span>Simulasi Chat Santri</span>
          </button>

          <button
            onClick={() => setActiveMode('comic')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeMode === 'comic'
                ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Naskah & Audio Komplit</span>
          </button>
        </div>
      </div>

      {/* Hiwar Scenario Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {HIWAR_DATA.map((h, idx) => (
          <button
            key={h.id}
            onClick={() => handleSelectHiwar(h.id)}
            className={`px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium ${
              selectedHiwarId === h.id
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Skenario {idx + 1}: {h.title}
          </button>
        ))}
      </div>

      {/* Selected Scenario Context Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            {currentHiwar.chapter} • {currentHiwar.contextDesc}
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">
            {currentHiwar.title}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {currentHiwar.situation}
          </p>
        </div>

        {activeMode === 'comic' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {showTransliteration ? <Eye className="w-3.5 h-3.5 text-sky-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              <span>Latin</span>
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {showTranslation ? <Eye className="w-3.5 h-3.5 text-sky-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              <span>Arti</span>
            </button>

            <button
              onClick={playEntireDialogue}
              className="px-3.5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Putar Naskah</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODE 1: INTERACTIVE CHAT ROLEPLAY SIMULATOR */}
      {/* ========================================================= */}
      {activeMode === 'roleplay' && (
        <div className="bg-white rounded-3xl border border-amber-500/20 shadow-xl overflow-hidden max-w-2xl mx-auto">
          {/* Mock Smartphone Header */}
          <div className="bg-gradient-to-r from-[#071a2e] via-[#0c2a4a] to-[#061526] p-4 text-white flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center font-arabic text-xl shadow-md">
                ف
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Farhan (Teman Santri Aliyah)</h3>
                <p className="text-[10px] text-sky-300/80">Online di Pelataran Madrasah</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Skor Obrolan</span>
              <div className="text-base font-extrabold text-white">{roleplayScore} XP</div>
            </div>
          </div>

          {/* Chat Flow Container */}
          <div className="p-5 sm:p-6 bg-slate-50 min-h-[380px] space-y-4">
            {!roleplayDone ? (
              <>
                {/* Previous Dialogue Bubbles up to current step */}
                {currentHiwar.dialogues.slice(0, chatStep + 1).map((d, idx) => {
                  const isUser = d.avatarSide === 'right';
                  const isCurrent = idx === chatStep;

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                        <span className="font-bold text-slate-600">{d.speaker}</span>
                        <span>({d.arabicSpeaker})</span>
                      </div>

                      <div
                        className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-xs ${
                          isUser
                            ? 'bg-sky-600 text-white rounded-tr-xs'
                            : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            onClick={() => speakArabic(d.arabic)}
                            className={`p-1 rounded-lg ${isUser ? 'hover:bg-white/10 text-sky-200' : 'hover:bg-slate-100 text-sky-700'} transition-colors cursor-pointer shrink-0`}
                            title="Dengarkan Suara"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <p className="font-arabic text-xl font-bold leading-relaxed text-right dir-rtl" dir="rtl">
                            {d.arabic}
                          </p>
                        </div>

                        <p className={`text-xs mt-1 italic font-mono ${isUser ? 'text-sky-200' : 'text-slate-500'}`}>
                          "{d.transliteration}"
                        </p>
                        <p className={`text-xs font-semibold mt-0.5 ${isUser ? 'text-white' : 'text-slate-700'}`}>
                          {d.meaning}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* If current step has roleplayChoice, show interactive options */}
                {currentHiwar.dialogues[chatStep]?.roleplayChoice && selectedChoice === null && (
                  <div className="mt-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-md space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{currentHiwar.dialogues[chatStep].roleplayChoice?.question}</span>
                    </div>

                    <div className="space-y-2">
                      {currentHiwar.dialogues[chatStep].roleplayChoice?.choices.map((c, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleChoiceSelect(cIdx, c.isCorrect)}
                          className="w-full p-3.5 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-200 text-left transition-all cursor-pointer transform hover:scale-[1.01] active:scale-98 shadow-xs flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{c.text}</span>
                            <span className="text-[10px] text-amber-700 font-bold uppercase bg-amber-100 px-2 py-0.5 rounded-md">
                              Pilihan {cIdx + 1}
                            </span>
                          </div>
                          <p className="font-arabic text-lg font-bold text-sky-950 text-right dir-rtl" dir="rtl">
                            {c.arabic}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Choice Feedback & Next Button */}
                {selectedChoice !== null && currentHiwar.dialogues[chatStep]?.roleplayChoice && (
                  <div className={`mt-4 p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                    currentHiwar.dialogues[chatStep].roleplayChoice?.choices[selectedChoice].isCorrect
                      ? 'bg-sky-50 border-sky-300 text-sky-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {currentHiwar.dialogues[chatStep].roleplayChoice?.choices[selectedChoice].isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-sky-600" />
                          <span>Jawaban Tepat! (+15 XP Diraih)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Kurang Tepat dalam Adab Percakapan</span>
                        </>
                      )}
                    </div>
                    <p>{currentHiwar.dialogues[chatStep].roleplayChoice?.choices[selectedChoice].feedback}</p>

                    <button
                      onClick={handleNextDialogueStep}
                      className="mt-2 px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Lanjutkan Obrolan</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                )}

                {/* If no roleplayChoice on this step, show simple next step button */}
                {!currentHiwar.dialogues[chatStep]?.roleplayChoice && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleNextDialogueStep}
                      className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Lanjut Kalimat Berikutnya</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Roleplay Completed Screen */
              <div className="text-center py-10 max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Ta'aruf Santri Berhasil!</h3>
                <p className="text-xs text-slate-600">
                  Kamu telah menyelesaikan seluruh percakapan interaktif ini dengan baik dan memperluas kefasihan lisanmu.
                </p>
                <div className="p-4 rounded-2xl bg-slate-900 text-white border border-amber-500/30 flex items-center justify-around">
                  <div>
                    <div className="text-[10px] text-slate-400">Total Poin</div>
                    <div className="text-xl font-extrabold text-amber-300">+{roleplayScore} XP</div>
                  </div>
                  <div className="w-px h-8 bg-slate-700" />
                  <div>
                    <div className="text-[10px] text-slate-400">Status</div>
                    <div className="text-sm font-bold text-sky-400">Tuntas Dihafal</div>
                  </div>
                </div>

                <button
                  onClick={resetRoleplay}
                  className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Simulasi Chat Ini</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: COMIC & FULL SCRIPT AUDIO */}
      {/* ========================================================= */}
      {activeMode === 'comic' && (
        <div className="space-y-4">
          {currentHiwar.dialogues.map((d, idx) => {
            const isLeft = d.avatarSide === 'left';
            return (
              <div
                key={idx}
                className={`flex gap-3 sm:gap-4 items-start ${
                  isLeft ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Speaker Avatar */}
                <div className="w-10 h-10 rounded-2xl bg-sky-700 text-amber-300 font-bold flex items-center justify-center font-arabic text-xl shrink-0 shadow-md">
                  {d.arabicSpeaker[0]}
                </div>

                {/* Speech Bubble */}
                <div
                  className={`max-w-2xl rounded-3xl p-5 border shadow-xs space-y-2 ${
                    isLeft
                      ? 'bg-white border-slate-200 rounded-tl-xs'
                      : 'bg-sky-900 text-white border-sky-700 rounded-tr-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-black/5">
                    <span className={`font-bold ${isLeft ? 'text-slate-800' : 'text-amber-300'}`}>
                      {d.speaker} ({d.arabicSpeaker})
                    </span>
                    <button
                      onClick={() => speakArabic(d.arabic)}
                      className={`p-1 rounded-lg ${isLeft ? 'hover:bg-slate-100 text-sky-700' : 'hover:bg-white/10 text-white'} transition-colors cursor-pointer`}
                      title="Dengarkan Suara"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p
                    className={`font-arabic text-2xl font-bold leading-relaxed text-right dir-rtl ${
                      isLeft ? 'text-slate-900' : 'text-amber-100'
                    }`}
                    dir="rtl"
                  >
                    {d.arabic}
                  </p>

                  {showTransliteration && (
                    <p className={`text-xs italic font-mono ${isLeft ? 'text-slate-500' : 'text-sky-200'}`}>
                      "{d.transliteration}"
                    </p>
                  )}

                  {showTranslation && (
                    <p className={`text-xs font-semibold ${isLeft ? 'text-slate-700' : 'text-white'}`}>
                      {d.meaning}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Copyright Attribution */}
      <div className="text-center text-xs text-slate-400 pt-2">
        Al-Bayan • Hiwar Interaktif & Simulasi Chat Santri • Hak Cipta © 2026 DikoSaputra
      </div>
    </div>
  );
};
