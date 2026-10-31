export type UserRole = 'siswa' | 'guru';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  kelas?: string; // default: 'Kelas 10 Madrasah Aliyah'
  schoolName?: string;
  xp: number;
  streak: number;
  level: string; // 'Pemula' | 'Menengah' | 'Mahir'
  updatedAt?: string;
  createdAt: string;
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  category: string;
  score: number;
  completed: boolean;
  completedAt: string;
}

export interface SavedWord {
  userId: string;
  wordId: string;
  arabic: string;
  transliteration?: string;
  meaning: string;
  category?: string;
  savedAt: string;
}

export interface QuizResult {
  userId: string;
  quizId: string;
  quizTitle: string;
  category?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export interface GameScore {
  userId: string;
  gameId: string;
  gameTitle: string;
  score: number;
  xpEarned: number;
  playedAt: string;
}

export interface MufrodatItem {
  id: string;
  chapter: string; // e.g. "Bab 1: التحيات والتعارف"
  category: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  wordType: 'Isim' | 'Fi\'il' | 'Huruf' | 'Ungkapan';
  exampleArabic?: string;
  exampleTrans?: string;
  exampleMeaning?: string;
  mnemonicTip?: string; // Trik jembatan keledai untuk hafalan cepat santri
  mood?: 'gaul' | 'dasar' | 'keseharian' | 'akademik';
}

export interface QawaidItem {
  id: string;
  chapter: string;
  title: string;
  arabicTitle: string;
  level: string;
  summary: string;
  content: string;
  rules: {
    ruleTitle: string;
    explanation: string;
    examples: {
      arabic: string;
      transliteration: string;
      meaning: string;
      note?: string;
    }[];
  }[];
  practiceQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface HiwarDialogue {
  speaker: string;
  arabicSpeaker: string;
  avatarSide: 'left' | 'right';
  arabic: string;
  transliteration: string;
  meaning: string;
  roleplayChoice?: {
    question: string;
    choices: {
      text: string;
      arabic: string;
      isCorrect: boolean;
      feedback: string;
    }[];
  };
}

export interface HiwarItem {
  id: string;
  chapter: string;
  title: string;
  arabicTitle: string;
  situation: string;
  contextDesc: string;
  dialogues: HiwarDialogue[];
}

export interface VideoLessonItem {
  id: string;
  bab: number;
  title: string;
  arabicTitle: string;
  description: string;
  duration: string;
  videoUrl: string; // YouTube embed URL
  thumbnailDesc: string;
  keyPoints: string[];
  transcript: {
    arabic: string;
    transliteration: string;
    indonesian: string;
  }[];
  checkpointQuiz?: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export interface SentenceAnalysis {
  original: string;
  transliteration: string;
  translation: string;
  sentenceType: string;
  words: {
    arabic: string;
    transliteration: string;
    type: string;
    meaning: string;
    irab: string;
  }[];
  grammarNotes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

export interface TeacherSilabusItem {
  bab: number;
  tema: string;
  temaArab: string;
  tarkib: string;
  alokasiWaktu: string;
  capaianPembelajaran: string[];
  materiPokok: string;
  panduanAktivitas: string;
}
