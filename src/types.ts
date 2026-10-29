export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
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
  category: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  exampleArabic?: string;
  exampleTrans?: string;
  exampleMeaning?: string;
}

export interface QawaidItem {
  id: string;
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
  title: string;
  arabicTitle: string;
  situation: string;
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
