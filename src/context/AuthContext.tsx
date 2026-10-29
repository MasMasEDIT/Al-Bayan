import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { UserProfile, SavedWord, LessonProgress, QuizResult } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  savedWords: SavedWord[];
  progressList: LessonProgress[];
  quizResults: QuizResult[];
  loading: boolean;
  loginError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  awardXP: (amount: number) => Promise<void>;
  saveWordToFirestore: (word: {
    wordId: string;
    arabic: string;
    transliteration?: string;
    meaning: string;
    category?: string;
  }) => Promise<void>;
  removeWordFromFirestore: (wordId: string) => Promise<void>;
  recordLessonProgress: (progress: {
    lessonId: string;
    category: string;
    score: number;
    completed: boolean;
  }) => Promise<void>;
  recordQuizResult: (quiz: {
    quizId: string;
    quizTitle: string;
    category?: string;
    score: number;
    totalQuestions: number;
    percentage: number;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [progressList, setProgressList] = useState<LessonProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Listen to Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      startTransition(() => {
        setCurrentUser(user);
      });

      if (user) {
        setLoginError(null);
        // Initialize or fetch user document in Firestore
        const userDocPath = `users/${user.uid}`;
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);

          if (!snap.exists()) {
            const initialProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Penuntut Ilmu',
              photoURL: user.photoURL || '',
              xp: 50, // Welcome bonus
              streak: 1,
              level: 'Pemula',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
            startTransition(() => {
              setUserProfile(initialProfile);
            });
          } else {
            startTransition(() => {
              setUserProfile(snap.data() as UserProfile);
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, userDocPath);
        }
      } else {
        startTransition(() => {
          setUserProfile(null);
          setSavedWords([]);
          setProgressList([]);
          setQuizResults([]);
        });
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Set up real-time listener for current user's profile and subcollections
  useEffect(() => {
    if (!currentUser) return;

    const userDocPath = `users/${currentUser.uid}`;
    const userDocRef = doc(db, 'users', currentUser.uid);

    // Profile listener
    const unsubProfile = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          startTransition(() => {
            setUserProfile(docSnap.data() as UserProfile);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userDocPath);
      }
    );

    // Saved words listener
    const wordsColPath = `users/${currentUser.uid}/saved_words`;
    const unsubWords = onSnapshot(
      collection(db, 'users', currentUser.uid, 'saved_words'),
      (snapshot) => {
        const words: SavedWord[] = [];
        snapshot.forEach((d) => {
          words.push(d.data() as SavedWord);
        });
        startTransition(() => {
          setSavedWords(words);
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, wordsColPath);
      }
    );

    // Progress listener
    const progressColPath = `users/${currentUser.uid}/progress`;
    const unsubProgress = onSnapshot(
      collection(db, 'users', currentUser.uid, 'progress'),
      (snapshot) => {
        const list: LessonProgress[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as LessonProgress);
        });
        startTransition(() => {
          setProgressList(list);
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, progressColPath);
      }
    );

    // Quiz results listener
    const quizColPath = `users/${currentUser.uid}/quiz_results`;
    const unsubQuiz = onSnapshot(
      collection(db, 'users', currentUser.uid, 'quiz_results'),
      (snapshot) => {
        const results: QuizResult[] = [];
        snapshot.forEach((d) => {
          results.push(d.data() as QuizResult);
        });
        startTransition(() => {
          setQuizResults(results);
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, quizColPath);
      }
    );

    return () => {
      unsubProfile();
      unsubWords();
      unsubProgress();
      unsubQuiz();
    };
  }, [currentUser]);

  const signInWithGoogle = async () => {
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setLoginError(err?.message || 'Gagal masuk dengan akun Google.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Sign Out Error:', err);
    }
  };

  const awardXP = async (amount: number) => {
    if (!currentUser || !userProfile) return;
    const userDocPath = `users/${currentUser.uid}`;
    try {
      const newXP = (userProfile.xp || 0) + amount;
      let newLevel = 'Pemula';
      if (newXP >= 400) newLevel = 'Mahir';
      else if (newXP >= 150) newLevel = 'Menengah';

      const updated = {
        ...userProfile,
        xp: newXP,
        level: newLevel,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', currentUser.uid), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, userDocPath);
    }
  };

  const saveWordToFirestore = async (word: {
    wordId: string;
    arabic: string;
    transliteration?: string;
    meaning: string;
    category?: string;
  }) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/saved_words/${word.wordId}`;
    try {
      const payload: SavedWord = {
        userId: currentUser.uid,
        wordId: word.wordId,
        arabic: word.arabic,
        transliteration: word.transliteration || '',
        meaning: word.meaning,
        category: word.category || 'Umum',
        savedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', currentUser.uid, 'saved_words', word.wordId), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const removeWordFromFirestore = async (wordId: string) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/saved_words/${wordId}`;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'saved_words', wordId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const recordLessonProgress = async (progress: {
    lessonId: string;
    category: string;
    score: number;
    completed: boolean;
  }) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/progress/${progress.lessonId}`;
    try {
      const payload: LessonProgress = {
        userId: currentUser.uid,
        lessonId: progress.lessonId,
        category: progress.category,
        score: progress.score,
        completed: progress.completed,
        completedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', currentUser.uid, 'progress', progress.lessonId), payload);
      await awardXP(30);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const recordQuizResult = async (quiz: {
    quizId: string;
    quizTitle: string;
    category?: string;
    score: number;
    totalQuestions: number;
    percentage: number;
  }) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/quiz_results/${quiz.quizId}`;
    try {
      const payload: QuizResult = {
        userId: currentUser.uid,
        quizId: quiz.quizId,
        quizTitle: quiz.quizTitle,
        category: quiz.category || 'Umum',
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        percentage: quiz.percentage,
        completedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', currentUser.uid, 'quiz_results', quiz.quizId), payload);
      // Award XP proportional to score
      const earnedXP = Math.round(quiz.percentage / 2);
      await awardXP(earnedXP);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        savedWords,
        progressList,
        quizResults,
        loading,
        loginError,
        signInWithGoogle,
        logout,
        awardXP,
        saveWordToFirestore,
        removeWordFromFirestore,
        recordLessonProgress,
        recordQuizResult,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
