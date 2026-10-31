import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MUFRODAT_DATA } from '../data/learningData';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  Timer,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Shuffle,
  Layers,
  HelpCircle
} from 'lucide-react';

// Sound generator using Web Audio API
const playTone = (type: 'correct' | 'wrong' | 'win' | 'click', soundEnabled: boolean) => {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(164.81, now + 0.25); // E3
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'win') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Audio context may be restricted by autoplay policy
  }
};

// Sentence Scramble Levels based on KMA 183
const SCRAMBLE_QUESTIONS = [
  {
    id: 'scramble-1',
    bab: 'Bab 1: التحيات والتعارف',
    type: 'Jumlah Ismiyyah & Dhomir',
    translation: 'Saya adalah siswa baru di kelas sepuluh Madrasah Aliyah.',
    correctTokens: ['أَنَا', 'طَالِبٌ', 'جَدِيْدٌ', 'فِي', 'الصَّفِّ', 'الْعَاشِرِ'],
    scrambledTokens: ['جَدِيْدٌ', 'فِي', 'أَنَا', 'الْعَاشِرِ', 'طَالِبٌ', 'الصَّفِّ'],
    grammarNote: 'Kalimat diawali Dhomir Munfashil "أَنَا" sebagai Mubtada\', diikuti Khabar "طَالِبٌ", dan Na\'at "جَدِيْدٌ".'
  },
  {
    id: 'scramble-2',
    bab: 'Bab 2: الأسرة والبيت',
    type: 'Jumlah Fi\'liyyah',
    translation: 'Ayahku membaca koran pagi di ruang tamu.',
    correctTokens: ['يَقْرَأُ', 'أَبِي', 'الْجَرِيْدَةَ', 'فِي', 'غُرْفَةِ', 'الْجُلُوْسِ'],
    scrambledTokens: ['الْجُلُوْسِ', 'يَقْرَأُ', 'فِي', 'الْجَرِيْدَةَ', 'غُرْفَةِ', 'أَبِي'],
    grammarNote: 'Pola Jumlah Fi\'liyyah: Fi\'il "يَقْرَأُ" + Faa\'il "أَبِي" + Maf\'ul Bih "الْجَرِيْدَةَ" + Jar Majrur.'
  },
  {
    id: 'scramble-3',
    bab: 'Bab 3: المدرسة ومرافقها',
    type: 'Na\'at & Man\'ut',
    translation: 'Di madrasah kami ada perpustakaan yang besar dan lengkap.',
    correctTokens: ['فِي', 'مَدْرَسَتِنَا', 'مَكْتَبَةٌ', 'كَبِيْرَةٌ', 'وَشَامِلَةٌ'],
    scrambledTokens: ['مَكْتَبَةٌ', 'وَشَامِلَةٌ', 'فِي', 'كَبِيْرَةٌ', 'مَدْرَسَتِنَا'],
    grammarNote: '"مَكْتَبَةٌ كَبِيْرَةٌ" adalah susunan Na\'at Man\'ut yang selaras dalam i\'rab marfu\' dan muannats (ta\' marbuthah).'
  },
  {
    id: 'scramble-4',
    bab: 'Bab 4: الحياة اليومية',
    type: 'Jumlah Fi\'liyyah & Waktu',
    translation: 'Para siswa bangun dari tidur sebelum fajar.',
    correctTokens: ['يَسْتَيْقِظُ', 'الطُّلَّابُ', 'مِنَ', 'النَّوْمِ', 'قَبْلَ', 'الْفَجْرِ'],
    scrambledTokens: ['مِنَ', 'الطُّلَّابُ', 'الْفَجْرِ', 'يَسْتَيْقِظُ', 'قَبْلَ', 'النَّوْمِ'],
    grammarNote: 'Kaidah: Jika Fi\'il mendahului Faa\'il jamak mudzakkar, Fi\'il tetap berbentuk mufrad ("يَسْتَيْقِظُ").'
  },
  {
    id: 'scramble-5',
    bab: 'Bab 5: الهواية والترويح',
    type: 'Amil Nawashib (أَنْ)',
    translation: 'Saya suka belajar seni kaligrafi Arab.',
    correctTokens: ['أُحِبُّ', 'أَنْ', 'أَتَعَلَّمَ', 'فَنَّ', 'الْخَطِّ', 'الْعَرَبِيِّ'],
    scrambledTokens: ['أَتَعَلَّمَ', 'الْعَرَبِيِّ', 'أُحِبُّ', 'فَنَّ', 'أَنْ', 'الْخَطِّ'],
    grammarNote: 'Huruf "أَنْ" menashobkan fi\'il mudhari\' menjadi "أَتَعَلَّمَ" dengan harakat fathah.'
  }
];

// Word Sorting items for Aqsamul Kalam (Isim, Fi'il, Huruf)
const SORTING_WORDS = [
  { word: 'كِتَابٌ', meaning: 'Buku', type: 'Isim', hint: 'Tanda Isim: memiliki tanwin di akhir kata' },
  { word: 'يَكْتُبُ', meaning: 'Sedang menulis', type: 'Fi\'il', hint: 'Tanda Fi\'il: diawali huruf mudhara\'ah (ya) & bermakna perbuatan' },
  { word: 'فِيْ', meaning: 'Di dalam', type: 'Huruf', hint: 'Tanda Huruf: huruf jar, tidak dapat berdiri sendiri tanpa isim' },
  { word: 'الْمَدْرَسَةُ', meaning: 'Madrasah / Sekolah', type: 'Isim', hint: 'Tanda Isim: diawali alif lam (ال)' },
  { word: 'قَرَأَ', meaning: 'Telah membaca', type: 'Fi\'il', hint: 'Tanda Fi\'il: kata kerja lampau (Fi\'il Madhi)' },
  { word: 'عَلَى', meaning: 'Di atas', type: 'Huruf', hint: 'Tanda Huruf: huruf jar penghubung' },
  { word: 'مُعَلِّمٌ', meaning: 'Guru / Ustadz', type: 'Isim', hint: 'Tanda Isim: nama profesi dengan tanwin' },
  { word: 'سَافَرَ', meaning: 'Telah bepergian', type: 'Fi\'il', hint: 'Tanda Fi\'il: kata kerja lampau wazan faa\'ala' },
  { word: 'إِلَى', meaning: 'Ke arah / Menuju', type: 'Huruf', hint: 'Tanda Huruf: huruf jar tujuan' },
  { word: 'طَالِبَةٌ', meaning: 'Siswi', type: 'Isim', hint: 'Tanda Isim: berakhiran Ta Marbuthah & tanwin' },
  { word: 'يَتَوَضَّأُ', meaning: 'Sedang berwudhu', type: 'Fi\'il', hint: 'Tanda Fi\'il: kata kerja perbuatan ibadah' },
  { word: 'مِنْ', meaning: 'Dari', type: 'Huruf', hint: 'Tanda Huruf: huruf jar asal mula' },
  { word: 'مَكْتَبَةٌ', meaning: 'Perpustakaan', type: 'Isim', hint: 'Tanda Isim: nama tempat (Isim Makan)' },
  { word: 'اسْتَمِعْ', meaning: 'Dengarkanlah!', type: 'Fi\'il', hint: 'Tanda Fi\'il: kata kerja perintah (Fi\'il Amr)' },
  { word: 'ثُمَّ', meaning: 'Kemudian', type: 'Huruf', hint: 'Tanda Huruf: huruf \'athaf perangkai' }
];

export const GamesView: React.FC = () => {
  const { awardXP } = useAuth();
  const [activeGame, setActiveGame] = useState<'tebak' | 'susun' | 'sortir'>('tebak');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // ================= GAME 1: TEBAK CEPAT STATE =================
  const [tebakTimeLeft, setTebakTimeLeft] = useState<number>(30);
  const [tebakIsRunning, setTebakIsRunning] = useState<boolean>(false);
  const [tebakScore, setTebakScore] = useState<number>(0);
  const [tebakCombo, setTebakCombo] = useState<number>(0);
  const [tebakCurrentQ, setTebakCurrentQ] = useState<{
    arabic: string;
    transliteration: string;
    correctMeaning: string;
    options: string[];
  } | null>(null);
  const [tebakFeedback, setTebakFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [tebakGameOver, setTebakGameOver] = useState<boolean>(false);
  const [tebakHighScore, setTebakHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('albayan_tebak_highscore') || '0');
  });

  // ================= GAME 2: SUSUN KALIMAT STATE =================
  const [scrambleIndex, setScrambleIndex] = useState<number>(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [scrambleStatus, setScrambleStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [scrambleScore, setScrambleScore] = useState<number>(0);

  // ================= GAME 3: SORTIR AQSAMUL KALAM STATE =================
  const [sortIndex, setSortIndex] = useState<number>(0);
  const [sortScore, setSortScore] = useState<number>(0);
  const [sortStatus, setSortStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [sortGameOver, setSortGameOver] = useState<boolean>(false);

  // TTS pronounce helper
  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ---------------- GAME 1: GENERATE QUESTION ----------------
  const generateTebakQuestion = () => {
    const randomIdx = Math.floor(Math.random() * MUFRODAT_DATA.length);
    const target = MUFRODAT_DATA[randomIdx];

    // Pick 3 distractor meanings
    const distractors: string[] = [];
    while (distractors.length < 3) {
      const distIdx = Math.floor(Math.random() * MUFRODAT_DATA.length);
      const distMeaning = MUFRODAT_DATA[distIdx].meaning;
      if (distMeaning !== target.meaning && !distractors.includes(distMeaning)) {
        distractors.push(distMeaning);
      }
    }

    const options = [target.meaning, ...distractors].sort(() => Math.random() - 0.5);

    setTebakCurrentQ({
      arabic: target.arabic,
      transliteration: target.transliteration,
      correctMeaning: target.meaning,
      options
    });
    setTebakFeedback(null);
  };

  const startTebakGame = () => {
    playTone('click', soundEnabled);
    setTebakScore(0);
    setTebakCombo(0);
    setTebakTimeLeft(30);
    setTebakGameOver(false);
    setTebakIsRunning(true);
    generateTebakQuestion();
  };

  // Timer for Tebak Cepat
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tebakIsRunning && tebakTimeLeft > 0) {
      timer = setInterval(() => {
        setTebakTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (tebakIsRunning && tebakTimeLeft === 0) {
      setTebakIsRunning(false);
      setTebakGameOver(true);
      playTone('win', soundEnabled);
      // Award XP based on score
      const earnedXP = Math.max(10, Math.floor(tebakScore / 5));
      awardXP(earnedXP);

      if (tebakScore > tebakHighScore) {
        setTebakHighScore(tebakScore);
        localStorage.setItem('albayan_tebak_highscore', tebakScore.toString());
      }
    }
    return () => clearInterval(timer);
  }, [tebakIsRunning, tebakTimeLeft, tebakScore, tebakHighScore, soundEnabled, awardXP]);

  const handleTebakAnswer = (selectedMeaning: string) => {
    if (!tebakIsRunning || !tebakCurrentQ) return;

    if (selectedMeaning === tebakCurrentQ.correctMeaning) {
      playTone('correct', soundEnabled);
      const comboBonus = Math.min(tebakCombo * 10, 50);
      const points = 100 + comboBonus;
      setTebakScore((prev) => prev + points);
      setTebakCombo((prev) => prev + 1);
      setTebakFeedback('correct');
      setTimeout(() => {
        generateTebakQuestion();
      }, 400);
    } else {
      playTone('wrong', soundEnabled);
      setTebakCombo(0);
      setTebakFeedback('wrong');
      setTimeout(() => {
        generateTebakQuestion();
      }, 600);
    }
  };

  // ---------------- GAME 2: SUSUN KALIMAT LOGIC ----------------
  const currentScramble = SCRAMBLE_QUESTIONS[scrambleIndex];

  useEffect(() => {
    if (currentScramble) {
      // Shuffle tokens for fresh view
      const shuffled = [...currentScramble.scrambledTokens].sort(() => Math.random() - 0.5);
      setAvailableTokens(shuffled);
      setSelectedTokens([]);
      setScrambleStatus('idle');
    }
  }, [scrambleIndex, currentScramble]);

  const handleSelectToken = (token: string, tokenIndex: number) => {
    playTone('click', soundEnabled);
    setSelectedTokens([...selectedTokens, token]);
    setAvailableTokens(availableTokens.filter((_, idx) => idx !== tokenIndex));
    setScrambleStatus('idle');
  };

  const handleDeselectToken = (token: string, tokenIndex: number) => {
    playTone('click', soundEnabled);
    setSelectedTokens(selectedTokens.filter((_, idx) => idx !== tokenIndex));
    setAvailableTokens([...availableTokens, token]);
    setScrambleStatus('idle');
  };

  const checkScrambleSentence = () => {
    const isCorrect =
      selectedTokens.length === currentScramble.correctTokens.length &&
      selectedTokens.every((token, idx) => token === currentScramble.correctTokens[idx]);

    if (isCorrect) {
      playTone('win', soundEnabled);
      setScrambleStatus('correct');
      setScrambleScore((prev) => prev + 50);
      awardXP(25);
    } else {
      playTone('wrong', soundEnabled);
      setScrambleStatus('wrong');
    }
  };

  const nextScrambleQuestion = () => {
    playTone('click', soundEnabled);
    if (scrambleIndex < SCRAMBLE_QUESTIONS.length - 1) {
      setScrambleIndex((prev) => prev + 1);
    } else {
      // restart loop
      setScrambleIndex(0);
    }
  };

  // ---------------- GAME 3: SORTIR LOGIC ----------------
  const currentSortWord = SORTING_WORDS[sortIndex];

  const handleSortChoice = (choice: 'Isim' | 'Fi\'il' | 'Huruf') => {
    if (sortGameOver || !currentSortWord) return;

    if (choice === currentSortWord.type) {
      playTone('correct', soundEnabled);
      setSortStatus('correct');
      setSortScore((prev) => prev + 30);
      awardXP(15);
    } else {
      playTone('wrong', soundEnabled);
      setSortStatus('wrong');
    }

    setTimeout(() => {
      if (sortIndex < SORTING_WORDS.length - 1) {
        setSortIndex((prev) => prev + 1);
        setSortStatus('idle');
      } else {
        setSortGameOver(true);
        playTone('win', soundEnabled);
        awardXP(50);
      }
    }, 900);
  };

  const restartSortGame = () => {
    playTone('click', soundEnabled);
    setSortIndex(0);
    setSortScore(0);
    setSortStatus('idle');
    setSortGameOver(false);
  };

  return (
    <div className="space-y-6">
      {/* Royal Header with Copyright DikoSaputra */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06241c] via-[#093529] to-[#041a15] p-6 sm:p-8 border border-amber-500/30 shadow-2xl shadow-emerald-950/40 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-3">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Wahana Game Interaktif Bahasa Arab Al-Bayan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Arena Permainan Edukasi Santri
            </h1>
            <p className="text-sm text-emerald-200/80 mt-1 max-w-2xl">
              Asah kecepatan kosakata, rakit susunan nahwu-shorof, dan tantang dirimu untuk meraih skor tertinggi serta mengumpulkan bonus XP!
            </p>
          </div>

          {/* Sound Toggle & Copyright Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-emerald-700/50 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
              title="Efek Suara Audio"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Suara: Aktif</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Suara: Senyap</span>
                </>
              )}
            </button>

            <div className="px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-[11px] text-amber-300 font-semibold shadow-xs">
              Edisi Spesial Karya: <span className="font-extrabold text-white">DikoSaputra</span>
            </div>
          </div>
        </div>

        {/* Game Mode Selector Buttons */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Game 1 Selector */}
          <button
            onClick={() => {
              playTone('click', soundEnabled);
              setActiveGame('tebak');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeGame === 'tebak'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-900/40 border-amber-300'
                : 'bg-emerald-950/60 border-emerald-800/60 text-slate-200 hover:bg-emerald-900/40'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${activeGame === 'tebak' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider">Game 1</div>
              <div className="text-sm font-bold">Tebak Cepat Mufrodat</div>
            </div>
          </button>

          {/* Game 2 Selector */}
          <button
            onClick={() => {
              playTone('click', soundEnabled);
              setActiveGame('susun');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeGame === 'susun'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-900/40 border-amber-300'
                : 'bg-emerald-950/60 border-emerald-800/60 text-slate-200 hover:bg-emerald-900/40'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${activeGame === 'susun' ? 'bg-slate-950 text-amber-400' : 'bg-emerald-500/20 text-emerald-300'}`}>
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider">Game 2</div>
              <div className="text-sm font-bold">Susun Kalimat (Tarkib)</div>
            </div>
          </button>

          {/* Game 3 Selector */}
          <button
            onClick={() => {
              playTone('click', soundEnabled);
              setActiveGame('sortir');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeGame === 'sortir'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-900/40 border-amber-300'
                : 'bg-emerald-950/60 border-emerald-800/60 text-slate-200 hover:bg-emerald-900/40'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${activeGame === 'sortir' ? 'bg-slate-950 text-amber-400' : 'bg-teal-500/20 text-teal-300'}`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider">Game 3</div>
              <div className="text-sm font-bold">Sortir Aqsamul Kalam</div>
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* GAME 1: TEBAK CEPAT MUFRODAT (Speed Vocab Match) */}
      {/* ============================================================== */}
      {activeGame === 'tebak' && (
        <div className="bg-white rounded-3xl border border-amber-500/20 shadow-xl overflow-hidden p-6 sm:p-8">
          {/* Header Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              {/* Score Display */}
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
                <Trophy className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase">Skor Permainan</div>
                  <div className="text-lg font-extrabold text-slate-900">{tebakScore} Poin</div>
                </div>
              </div>

              {/* Highscore */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 text-xs">
                <Award className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">Rekor Tertinggi</div>
                  <div className="font-bold text-slate-800">{tebakHighScore} Poin</div>
                </div>
              </div>

              {/* Combo Multiplier */}
              {tebakCombo > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold animate-bounce">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span>Combo x{tebakCombo}!</span>
                </div>
              )}
            </div>

            {/* Timer Counter */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-sm ${
              tebakTimeLeft <= 10
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <Timer className="w-4 h-4" />
              <span>Sisa Waktu: {tebakTimeLeft} Detik</span>
            </div>
          </div>

          {/* Not running state */}
          {!tebakIsRunning && !tebakGameOver && (
            <div className="text-center py-12 max-w-lg mx-auto">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 mb-5">
                <Zap className="w-10 h-10 fill-slate-950" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Tebak Cepat Kosakata Arab Kelas 10</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Kamu memiliki waktu 30 detik untuk mencocokkan kosakata bahasa Arab dengan artinya secepat mungkin. Semakin panjang combo benar, semakin banyak poin bonus & XP yang kamu raih!
              </p>
              <button
                onClick={startTebakGame}
                className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              >
                Mulai Tantangan Sekarang 🚀
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {tebakGameOver && (
            <div className="text-center py-10 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner mb-4">
                <Trophy className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                Waktu Habis!
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">Permainan Selesai!</h3>
              <p className="text-slate-600 text-sm mt-1">
                Luar biasa! Kamu berhasil mengumpulkan:
              </p>
              <div className="my-5 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-around border border-amber-500/30">
                <div>
                  <div className="text-xs text-slate-400">Total Skor</div>
                  <div className="text-2xl font-extrabold text-amber-400">{tebakScore}</div>
                </div>
                <div className="w-px h-8 bg-slate-700" />
                <div>
                  <div className="text-xs text-slate-400">Hadiah Belajar</div>
                  <div className="text-2xl font-extrabold text-emerald-400">+{Math.max(10, Math.floor(tebakScore / 5))} XP</div>
                </div>
              </div>
              <button
                onClick={startTebakGame}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mainkan Lagi</span>
              </button>
            </div>
          )}

          {/* Active Question Screen */}
          {tebakIsRunning && tebakCurrentQ && (
            <div className="py-6 max-w-2xl mx-auto space-y-6">
              {/* Question Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#07251e] to-[#041a15] text-white text-center border-2 border-amber-400/40 shadow-xl relative">
                <button
                  onClick={() => handlePronounce(tebakCurrentQ.arabic)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer"
                  title="Dengarkan Pelafalan"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                  Pilih Arti yang Tepat:
                </p>
                <h3 className="font-arabic text-4xl sm:text-5xl font-bold my-4 text-amber-300 leading-relaxed">
                  {tebakCurrentQ.arabic}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 italic font-mono">
                  "{tebakCurrentQ.transliteration}"
                </p>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {tebakCurrentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTebakAnswer(option)}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-slate-800 font-bold text-sm sm:text-base text-left transition-all cursor-pointer transform active:scale-98 shadow-xs flex items-center justify-between"
                  >
                    <span>{option}</span>
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* Visual Feedback Flash */}
              {tebakFeedback && (
                <div className={`p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 ${
                  tebakFeedback === 'correct'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {tebakFeedback === 'correct' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Mumtaz! Jawaban Benar (+100 Poin)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Kurang Tepat, coba fokus lagi!</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* GAME 2: SUSUN KALIMAT SEMPURNA (Tarkib Scramble) */}
      {/* ============================================================== */}
      {activeGame === 'susun' && currentScramble && (
        <div className="bg-white rounded-3xl border border-amber-500/20 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                {currentScramble.bab}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Tantangan Susun Kalimat: {currentScramble.type}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Soal {scrambleIndex + 1} dari {SCRAMBLE_QUESTIONS.length}</span>
              <div className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                Skor: {scrambleScore}
              </div>
            </div>
          </div>

          {/* Translation Goal Prompt */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Susun menjadi kalimat bahasa Arab dengan arti:</span>
            <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              "{currentScramble.translation}"
            </p>
          </div>

          {/* Sentence Drop Zone (Selected Word Chips) */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white min-h-[120px] flex flex-col justify-center items-center border-2 border-dashed border-emerald-500/40 relative">
            {selectedTokens.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-400 italic">
                Klik kartu kata di bawah untuk merangkai kalimat sempurna dari kanan ke kiri
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 dir-rtl" dir="rtl">
                {selectedTokens.map((token, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDeselectToken(token, idx)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-arabic text-xl font-bold shadow-md hover:scale-105 transition-transform cursor-pointer border border-amber-300"
                    title="Klik untuk menghapus kembali"
                  >
                    {token}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Available Word Pool */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2.5">
              Pilihan Kata yang Tersedia (Klik untuk Memilih):
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              {availableTokens.map((token, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectToken(token, idx)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-600/30 text-emerald-950 font-arabic text-xl font-bold shadow-xs hover:border-emerald-600 transition-all cursor-pointer"
                >
                  {token}
                </button>
              ))}
              {availableTokens.length === 0 && (
                <p className="text-xs text-slate-400 italic">Semua kata sudah terpasang di atas</p>
              )}
            </div>
          </div>

          {/* Action & Feedback Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setSelectedTokens([]);
                setAvailableTokens([...currentScramble.scrambledTokens]);
                setScrambleStatus('idle');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pilihan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={checkScrambleSentence}
                disabled={selectedTokens.length === 0}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Periksa Kalimat</span>
              </button>

              {scrambleStatus === 'correct' && (
                <button
                  onClick={nextScrambleQuestion}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                >
                  <span>Lanjut Soal Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Grammar Explanation Result */}
          {scrambleStatus === 'correct' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Sahih! Kalimatmu tersusun rapi sesuai kaidah nahwu (+25 XP)</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold">Bedah Kaidah: </span>
                {currentScramble.grammarNote}
              </p>
              <button
                onClick={() => handlePronounce(currentScramble.correctTokens.join(' '))}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-white px-3 py-1 rounded-lg border border-emerald-200 mt-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dengarkan Pengucapan Lengkap</span>
              </button>
            </div>
          )}

          {scrambleStatus === 'wrong' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex items-start gap-2 text-xs">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Susunan belum tepat.</span> Perhatikan posisi Fi'il / Mubtada' dan kata sifat yang mengikuti bendanya. Kamu bisa mereset atau menukar urutan kata!
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* GAME 3: SORTIR AQSAMUL KALAM (Isim, Fi'il, Huruf) */}
      {/* ============================================================== */}
      {activeGame === 'sortir' && currentSortWord && (
        <div className="bg-white rounded-3xl border border-amber-500/20 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                Bab 1 Kelas 10 MA: أَقْسَامُ الْكَلَامِ
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Klasifikasi Cepat: Isim, Fi'il, atau Huruf?
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Kata {sortIndex + 1} / {SORTING_WORDS.length}</span>
              <div className="bg-teal-100 text-teal-900 font-bold px-3 py-1 rounded-full text-xs">
                Skor: {sortScore}
              </div>
            </div>
          </div>

          {/* Not Game Over View */}
          {!sortGameOver ? (
            <div className="max-w-xl mx-auto space-y-8 py-4">
              {/* Target Word Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#051e18] via-[#093529] to-[#041a15] text-white text-center border-2 border-teal-500/40 shadow-2xl relative">
                <button
                  onClick={() => handlePronounce(currentSortWord.word)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer"
                  title="Dengarkan Suara"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                  Klasifikasikan Jenis Kata Ini:
                </p>
                <h3 className="font-arabic text-5xl font-bold my-4 text-amber-300 drop-shadow-sm">
                  {currentSortWord.word}
                </h3>
                <p className="text-sm text-slate-200">
                  Arti: <span className="font-bold text-white">"{currentSortWord.meaning}"</span>
                </p>
              </div>

              {/* 3 Classification Sorting Bins */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* ISIM */}
                <button
                  onClick={() => handleSortChoice('Isim')}
                  className="p-5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border-2 border-blue-400/50 text-blue-950 font-bold transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0 shadow-sm flex flex-col items-center justify-center text-center"
                >
                  <span className="font-arabic text-2xl font-bold text-blue-700">اسْمٌ</span>
                  <span className="text-sm font-extrabold mt-1">ISIM</span>
                  <span className="text-[10px] text-blue-600 font-normal mt-0.5">Kata Benda / Nama</span>
                </button>

                {/* FI'IL */}
                <button
                  onClick={() => handleSortChoice('Fi\'il')}
                  className="p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-400/50 text-emerald-950 font-bold transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0 shadow-sm flex flex-col items-center justify-center text-center"
                >
                  <span className="font-arabic text-2xl font-bold text-emerald-700">فِعْلٌ</span>
                  <span className="text-sm font-extrabold mt-1">FI'IL</span>
                  <span className="text-[10px] text-emerald-600 font-normal mt-0.5">Kata Kerja Perbuatan</span>
                </button>

                {/* HURUF */}
                <button
                  onClick={() => handleSortChoice('Huruf')}
                  className="p-5 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border-2 border-purple-400/50 text-purple-950 font-bold transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0 shadow-sm flex flex-col items-center justify-center text-center"
                >
                  <span className="font-arabic text-2xl font-bold text-purple-700">حَرْفٌ</span>
                  <span className="text-sm font-extrabold mt-1">HURUF</span>
                  <span className="text-[10px] text-purple-600 font-normal mt-0.5">Kata Tugas / Penghubung</span>
                </button>
              </div>

              {/* Instant feedback card */}
              {sortStatus !== 'idle' && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  sortStatus === 'correct'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}>
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {sortStatus === 'correct' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Jawaban Tepat! Kata ini adalah {currentSortWord.type}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Jawaban Kurang Tepat! Seharusnya {currentSortWord.type}</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-700">{currentSortWord.hint}</p>
                </div>
              )}
            </div>
          ) : (
            /* Game Over Screen */
            <div className="text-center py-10 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Klasifikasi Selesai!</h3>
              <p className="text-slate-600 text-sm mt-1">
                Kamu telah menyelesaikan semua kata pembagian kalam Kelas 10 Madrasah Aliyah.
              </p>
              <div className="my-5 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-around border border-teal-500/30">
                <div>
                  <div className="text-xs text-slate-400">Total Skor</div>
                  <div className="text-2xl font-extrabold text-teal-300">{sortScore}</div>
                </div>
                <div className="w-px h-8 bg-slate-700" />
                <div>
                  <div className="text-xs text-slate-400">Bonus XP</div>
                  <div className="text-2xl font-extrabold text-amber-400">+50 XP</div>
                </div>
              </div>
              <button
                onClick={restartSortGame}
                className="w-full py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mainkan Ulang</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Copyright Card */}
      <div className="rounded-2xl bg-emerald-950/40 border border-emerald-900/60 p-4 text-center text-xs text-emerald-300/80">
        <p className="font-semibold text-white">
          Game Edukasi Bahasa Arab Al-Bayan — Kurikulum KMA 183 Kelas 10 MA
        </p>
        <p className="text-[11px] text-amber-300/80 mt-0.5">
          Hak Cipta © 2026 DikoSaputra • Seluruh Hak Cipta Dilindungi
        </p>
      </div>
    </div>
  );
};
