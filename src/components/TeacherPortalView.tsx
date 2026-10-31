import React, { useState } from 'react';
import { TEACHER_SILABUS_DATA } from '../data/learningData';
import { useAuth } from '../context/AuthContext';
import {
  BookOpenCheck,
  Sparkles,
  ScrollText,
  Clock,
  Layers,
  GraduationCap,
  Copy,
  Check,
  Loader2,
  FileText,
  Printer,
  Compass,
} from 'lucide-react';

export const TeacherPortalView: React.FC = () => {
  const { userProfile, updateUserRole } = useAuth();
  const [selectedBab, setSelectedBab] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Exam Generator State for Teachers
  const [examTopic, setExamTopic] = useState<string>('Bab 1: التحيات والتعارف');
  const [examType, setExamType] = useState<string>('Penilaian Harian (PH)');
  const [examCount, setExamCount] = useState<number>(5);
  const [generatingExam, setGeneratingExam] = useState<boolean>(false);
  const [generatedExam, setGeneratedExam] = useState<any | null>(null);
  const [examError, setExamError] = useState<string | null>(null);

  const activeSilabus = TEACHER_SILABUS_DATA.find((s) => s.bab === selectedBab) || TEACHER_SILABUS_DATA[0];

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleGenerateExamQuestions = async () => {
    setGeneratingExam(true);
    setExamError(null);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${examTopic} - ${examType} Kelas 10 Madrasah Aliyah`,
          level: 'menengah',
          count: examCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal meracik soal ujian dengan AI.');
      }

      const data = await response.json();
      setGeneratedExam(data);
    } catch (err: any) {
      console.error(err);
      setExamError(err.message || 'Terjadi gangguan saat membuat soal ujian.');
    } finally {
      setGeneratingExam(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Teacher Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-amber-500/30 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Portal Pendidik Bahasa Arab MA • KMA 183</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ruang Guru & Asatidz: {userProfile?.displayName || 'Ustadz Pengampu'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Panduan perangkat ajar, silabus Capaian Pembelajaran (CP), rencana alokasi jam pelajaran, serta generator instrumen evaluasi otomatis untuk siswa Kelas 10 Madrasah Aliyah.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => updateUserRole('siswa')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Beralih ke tampilan belajar siswa"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Pratinjau Mode Siswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Silabus & ATP Selector Bar */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-emerald-700" />
            <span>Alur Tujuan Pembelajaran & Silabus per Bab (KMA 183)</span>
          </h2>
          <span className="text-xs text-slate-500">Kelas X Madrasah Aliyah</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEACHER_SILABUS_DATA.map((s) => {
            const isSelected = s.bab === selectedBab;
            return (
              <button
                key={s.bab}
                onClick={() => setSelectedBab(s.bab)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                    Bab {s.bab}
                  </span>
                  <span className="font-arabic font-bold text-sm">{s.temaArab}</span>
                </div>
                <h4 className="font-semibold text-xs leading-snug line-clamp-2 mt-1">
                  {s.tema}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Silabus Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
              Rencana Perangkat Ajar Bab {activeSilabus.bab}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              {activeSilabus.tema}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Alokasi Waktu: <strong className="text-slate-800">{activeSilabus.alokasiWaktu}</strong></span>
            </p>
          </div>

          <button
            onClick={() => handleCopyText(
              `Perangkat Ajar Bahasa Arab Kelas 10 MA\nTema: ${activeSilabus.tema}\nTarkib: ${activeSilabus.tarkib}\nAlokasi: ${activeSilabus.alokasiWaktu}\nCapaian Pembelajaran:\n${activeSilabus.capaianPembelajaran.map((c, i) => `${i+1}. ${c}`).join('\n')}\nPanduan: ${activeSilabus.panduanAktivitas}`,
              `silabus-${activeSilabus.bab}`
            )}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copiedId === `silabus-${activeSilabus.bab}` ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin Ringkasan RPP</span>
              </>
            )}
          </button>
        </div>

        {/* Content Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Capaian Pembelajaran */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Capaian Pembelajaran (CP) & Indikator</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {activeSilabus.capaianPembelajaran.map((cp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{cp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Materi Pokok & Kaidah Tarkib */}
          <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-100 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Fokus Kaidah & Materi Pokok</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-semibold text-slate-500 text-[11px]">Kaidah Tarkib / Nahwu:</p>
                <p className="font-bold text-emerald-950 font-arabic text-sm mt-0.5">
                  {activeSilabus.tarkib}
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-100">
                <p className="font-semibold text-slate-500 text-[11px]">Materi Kosakata & Teks:</p>
                <p className="text-slate-800 leading-relaxed mt-0.5">
                  {activeSilabus.materiPokok}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panduan Pembelajaran 4 Kemahiran (Istima', Kalam, Qira'ah, Kitabah) */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-2">
            <FileText className="w-4 h-4 text-amber-700" />
            <span>Rekomendasi Aktivitas Kelas & Penguatan 4 Kemahiran Bahasa</span>
          </h4>
          <p className="text-xs text-amber-950 leading-relaxed font-medium">
            {activeSilabus.panduanAktivitas}
          </p>
        </div>
      </div>

      {/* AI Exam & Quiz Generator for Teachers */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              Generator Bank Soal & Ujian Otomatis (Gemini AI)
            </h3>
            <p className="text-xs text-slate-300">
              Rancang butir soal Penilaian Harian (PH), PTS, atau PAS Kelas 10 MA secara instan dilengkapi kunci jawaban dan pembahasan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Topic Select */}
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-200">Pilih Materi Soal:</label>
            <select
              value={examTopic}
              onChange={(e) => setExamTopic(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-700/50 text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Bab 1: التحيات والتعارف (Sapaan, Perkenalan & Isim-Fi'il-Huruf)">Bab 1: Ta'aruf & Pembagian Kata</option>
              <option value="Bab 2: الأسرة والبيت (Keluarga & Dhomir Muttashil)">Bab 2: Usrah & Dhomir</option>
              <option value="Bab 3: المدرسة ومرافقها (Fasilitas & Na'at Man'ut)">Bab 3: Fasilitas Madrasah & Na'at</option>
              <option value="Bab 4: الحياة اليومية (Jumlah Fi'liyyah & Keseharian Santri)">Bab 4: Keseharian Santri & Jumlah Fi'liyyah</option>
            </select>
          </div>

          {/* Exam Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-200">Jenis Evaluasi:</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-700/50 text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Penilaian Harian (PH)">Penilaian Harian (PH)</option>
              <option value="Penilaian Tengah Semester (PTS)">Penilaian Tengah Semester (PTS)</option>
              <option value="Penilaian Akhir Semester (PAS)">Penilaian Akhir Semester (PAS)</option>
              <option value="Kuis Cepat Apersepsi">Kuis Cepat Apersepsi</option>
            </select>
          </div>

          {/* Count */}
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-200">Jumlah Butir Soal:</label>
            <div className="flex gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setExamCount(num)}
                  className={`flex-1 py-2.5 rounded-xl border font-bold transition-colors cursor-pointer ${
                    examCount === num
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {num} Soal
                </button>
              ))}
            </div>
          </div>
        </div>

        {examError && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs">
            {examError}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleGenerateExamQuestions}
            disabled={generatingExam}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {generatingExam ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Sedang Meracik Butir Soal MA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Hasilkan Bank Soal Sekarang</span>
              </>
            )}
          </button>
        </div>

        {/* Display Generated Questions */}
        {generatedExam && generatedExam.questions && generatedExam.questions.length > 0 && (
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-emerald-500/40 text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">
                  Hasil Bank Soal ({generatedExam.questions.length} Butir)
                </h4>
                <p className="text-[11px] text-emerald-300">{examTopic} • {examType}</p>
              </div>

              <button
                onClick={() => handleCopyText(
                  generatedExam.questions.map((q: any, i: number) => 
                    `${i+1}. ${q.question}\n${q.arabicPhrase ? `(${q.arabicPhrase})\n` : ''}${q.options.map((o: string, oi: number) => `   [${String.fromCharCode(65+oi)}] ${o}`).join('\n')}\nKunci: [${String.fromCharCode(65+q.correctIndex)}]\nPembahasan: ${q.explanation}\n`
                  ).join('\n---\n\n'),
                  'all-generated-exam'
                )}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-amber-300 cursor-pointer"
              >
                {copiedId === 'all-generated-exam' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Semua Soal</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {generatedExam.questions.map((q: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="font-bold text-white text-sm">
                    {idx + 1}. {q.question}
                  </p>
                  {q.arabicPhrase && (
                    <p className="font-arabic text-xl text-amber-300 text-right leading-loose">
                      {q.arabicPhrase}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options?.map((opt: string, optIdx: number) => (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border text-xs ${
                          optIdx === q.correctIndex
                            ? 'bg-emerald-950/80 border-emerald-400/80 text-emerald-200 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold mr-1.5">[{String.fromCharCode(65 + optIdx)}]</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 text-[11px] text-amber-200/90 bg-amber-950/30 p-2.5 rounded-lg border border-amber-900/40">
                    <span className="font-bold text-amber-400">Kunci & Pembahasan: </span>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
