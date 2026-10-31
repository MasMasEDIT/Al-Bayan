import React, { useState } from 'react';
import { speakArabic } from '../lib/audio';
import { SentenceAnalysis } from '../types';
import {
  Sparkles,
  Volume2,
  Send,
  Loader2,
  BookOpen,
  Info,
  Layers,
} from 'lucide-react';

export const IrabAnalyzerView: React.FC = () => {
  const [inputSentence, setInputSentence] = useState<string>('الْعِلْمُ نُوْرٌ وَالْجَهْلُ ظَلَامٌ');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<SentenceAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleSentences = [
    'الْعِلْمُ نُوْرٌ وَالْجَهْلُ ظَلَامٌ',
    'ذَهَبَ الطَّالِبُ إِلَى الْمَدْرَسَةِ',
    'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ',
    'إِنَّ اللهَ مَعَ الصَّابِرِيْنَ',
    'يَقْرَأُ زَيْدٌ كِتَابًا مُفِيْدًا',
  ];

  const handleAnalyze = async (sentenceToAnalyze?: string) => {
    const text = (sentenceToAnalyze !== undefined ? sentenceToAnalyze : inputSentence).trim();
    if (!text) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal menganalisis kalimat.');
      }

      const data: SentenceAnalysis = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error('Error analyzing sentence:', err);
      setErrorMsg(err.message || 'Terjadi gangguan saat membedah kalimat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Bedah Kalimat & I'rab AI
          </h1>
          <span className="font-arabic text-xl text-purple-800 font-bold">
            إِعْرَابُ الجُمَل
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Ditenagai oleh Gemini AI server-side untuk membedah kedudukan tata bahasa kata demi kata, harakat akhir, dan jenis susunan kalimat.
        </p>
      </div>

      {/* Input Box & Presets */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        {/* Sample preset buttons */}
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Pilih contoh kalimat cepat:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleSentences.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputSentence(sample);
                  handleAnalyze(sample);
                }}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-arabic font-bold border border-purple-100 transition-colors cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">
            Ketik atau tempel kalimat bahasa Arab:
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="Contoh: كَتَبَ عَلِيٌّ رِسَالَةً"
              className="w-full p-4 text-xl font-arabic font-bold text-right rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all leading-loose text-slate-900"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => speakArabic(inputSentence)}
            disabled={!inputSentence}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Volume2 className="w-4 h-4 text-purple-600" />
            <span>Dengarkan Suara</span>
          </button>

          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !inputSentence.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-purple-900/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Membedah Kaidah...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Bedah I'rab Kalimat</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Analysis Output Section */}
      {analysis && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
          {/* Header Summary Card */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-950 text-white rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold">
                <Layers className="w-3.5 h-3.5 text-purple-300" />
                <span>{analysis.sentenceType || 'Susunan Kalimat'}</span>
              </span>

              <button
                onClick={() => speakArabic(analysis.original)}
                className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                <span>Putar Audio</span>
              </button>
            </div>

            <div className="text-right my-2">
              <p className="font-arabic text-3xl sm:text-4xl font-bold leading-loose text-purple-100">
                {analysis.original}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-1">
              <p className="text-xs text-purple-200 font-medium">
                Cara baca: <span className="font-semibold text-white">{analysis.transliteration}</span>
              </p>
              <p className="text-sm font-semibold text-white">
                Arti: "{analysis.translation}"
              </p>
            </div>
          </div>

          {/* Word-by-Word Breakdown Cards */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Dekonstruksi Kata per Kata & I'rab</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.words?.map((w, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[11px]">
                      {w.type}
                    </span>
                    <p className="font-arabic text-2xl font-bold text-slate-900 text-right">
                      {w.arabic}
                    </p>
                  </div>

                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-sky-700 font-semibold">{w.transliteration}</p>
                    <p className="text-slate-700 font-medium">Arti: {w.meaning}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-[11px] text-purple-950 font-medium bg-purple-50 p-2 rounded-xl border border-purple-100">
                        <span className="font-bold text-purple-900">I'rab: </span>
                        {w.irab}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Notes & Insights */}
          {analysis.grammarNotes && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Catatan & Faedah Kaidah:</span>
              </div>
              <p className="text-amber-950 leading-relaxed font-medium">
                {analysis.grammarNotes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
