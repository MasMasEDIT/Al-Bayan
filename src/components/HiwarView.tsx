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
} from 'lucide-react';

export const HiwarView: React.FC = () => {
  const { recordLessonProgress, progressList } = useAuth();
  const [selectedHiwarId, setSelectedHiwarId] = useState<string>(HIWAR_DATA[0].id);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

  const currentHiwar = HIWAR_DATA.find((h) => h.id === selectedHiwarId) || HIWAR_DATA[0];
  const isCompleted = progressList.some((p) => p.lessonId === currentHiwar.id && p.completed);

  const playEntireDialogue = () => {
    let delay = 0;
    currentHiwar.dialogues.forEach((d) => {
      setTimeout(() => {
        speakArabic(d.arabic);
      }, delay);
      delay += 3500;
    });
  };

  const handleMarkComplete = async () => {
    await recordLessonProgress({
      lessonId: currentHiwar.id,
      category: 'hiwar',
      score: 100,
      completed: true,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Hiwar (Percakapan Sehari-hari)
          </h1>
          <span className="font-arabic text-xl text-emerald-800 font-bold">
            الحِوَارَاتُ اليَوْمِيَّة
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Dengarkan dan tirukan percakapan bahasa Arab interaktif antar penutur asli untuk melatih kefasihan lisan (Maharah Kalam).
        </p>
      </div>

      {/* Hiwar Scenario Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {HIWAR_DATA.map((hiwar) => {
          const isSelected = hiwar.id === currentHiwar.id;
          return (
            <button
              key={hiwar.id}
              onClick={() => setSelectedHiwarId(hiwar.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{hiwar.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Dialogue Canvas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        {/* Scenario Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {currentHiwar.title}
              </h2>
              <span className="font-arabic text-lg text-emerald-800 font-bold">
                {currentHiwar.arabicTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentHiwar.situation}
            </p>
          </div>

          {/* Controls: Play All, Toggles */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={playEntireDialogue}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Putar Seluruh Dialog</span>
            </button>

            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                showTransliteration
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
              title="Tampilkan/Sembunyikan Cara Baca"
            >
              {showTransliteration ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Latin</span>
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                showTranslation
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
              title="Tampilkan/Sembunyikan Terjemahan"
            >
              {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Arti</span>
            </button>
          </div>
        </div>

        {/* Dialog Chat Bubbles */}
        <div className="py-6 space-y-6">
          {currentHiwar.dialogues.map((item, idx) => {
            const isLeft = item.avatarSide === 'left';

            return (
              <div
                key={idx}
                className={`flex gap-3 items-start ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                {/* Left Speaker Avatar */}
                {isLeft && (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {item.speaker[0]}
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={`max-w-xl rounded-3xl p-5 border shadow-xs ${
                    isLeft
                      ? 'bg-emerald-50/40 border-emerald-100 text-slate-900 rounded-tl-xs'
                      : 'bg-teal-50/40 border-teal-100 text-slate-900 rounded-tr-xs'
                  }`}
                >
                  {/* Speaker Label & Audio button */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{item.speaker}</span>
                      <span className="font-arabic text-emerald-800 font-bold">({item.arabicSpeaker})</span>
                    </div>

                    <button
                      onClick={() => speakArabic(item.arabic)}
                      className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                      title="Dengarkan pengucapan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="text-right my-2">
                    <p className="font-arabic text-2xl sm:text-3xl text-slate-900 font-bold leading-loose">
                      {item.arabic}
                    </p>
                  </div>

                  {/* Transliteration */}
                  {showTransliteration && (
                    <p className="text-xs text-emerald-800 font-semibold mt-1">
                      {item.transliteration}
                    </p>
                  )}

                  {/* Translation */}
                  {showTranslation && (
                    <p className="text-xs text-slate-600 mt-1 italic">
                      "{item.meaning}"
                    </p>
                  )}
                </div>

                {/* Right Speaker Avatar */}
                {!isLeft && (
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {item.speaker[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Action: Complete Hiwar Session */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Latihlah dengan mengulang setiap kalimat dengan keras agar lidah terbiasa melafalkan makhraj Arab yang tepat.
          </p>

          {isCompleted ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Selesai Dilatih (+30 XP)</span>
            </span>
          ) : (
            <button
              onClick={handleMarkComplete}
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tandai Selesai Latihan (+30 XP)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
