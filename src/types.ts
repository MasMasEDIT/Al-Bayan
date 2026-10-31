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
