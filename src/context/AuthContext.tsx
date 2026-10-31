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
import { UserProfile, UserRole, SavedWord, LessonProgress, QuizResult } from '../types';

interface AuthContextType {
  currentUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null } | null;
  userProfile: UserProfile | null;
  selectedLoginRole: UserRole;
  setSelectedLoginRole: (role: UserRole) => void;
  savedWords: SavedWord[];
  progressList: LessonProgress[];
  quizResults: QuizResult[];
  loading: boolean;
  loginError: string | null;
  signInWithGoogle: (preferredRole?: UserRole) => Promise<void>;
  loginWithDemoAccount: (role: UserRole) => Promise<void>;
  updateUserRole: (newRole: UserRole) => Promise<void>;
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

const DEMO_USERS = {
  siswa: {
    uid: 'demo_siswa_aliyah_10',
    email: 'siswa.aliyah@albayan.edu',
    displayName: 'Ahmad Fauzi (Siswa Kelas 10-A)',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: 'siswa' as UserRole,
    kelas: 'Kelas 10-A Madrasah Aliyah',
    schoolName: 'MAN 1 Model (Madrasah Aliyah Negeri)',
    xp: 280,
    streak: 6,
    level: 'Menengah',
    createdAt: '2026-07-15T08:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  guru: {
    uid: 'demo_guru_aliyah_ustadz',
    email: 'guru.aliyah@albayan.edu',
    displayName: 'Ustadz H. Mansyur, Lc., M.Pd.',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    role: 'guru' as UserRole,
    kelas: 'Guru Pengampu Kelas 10 MA',
    schoolName: 'MAN 1 Model (Madrasah Aliyah Negeri)',
    xp: 850,
    streak: 15,
    level: 'Mahir',
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null; displayName: string | null; photoURL: string | null } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedLoginRole, setSelectedLoginRole] = useState<UserRole>('siswa');
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [progressList, setProgressList] = useState<LessonProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Check for saved demo session in localStorage or Firebase Auth
  useEffect(() => {
    const savedDemoKey = localStorage.getItem('albayan_demo_user_role');
    if (savedDemoKey && (savedDemoKey === 'siswa' || savedDemoKey === 'guru')) {
      const demoData = DEMO_USERS[savedDemoKey as UserRole];
      setCurrentUser({
        uid: demoData.uid,
        email: demoData.email,
        displayName: demoData.displayName,
        photoURL: demoData.photoURL,
      });
      setUserProfile(demoData);
      setSelectedLoginRole(savedDemoKey as UserRole);

      // Seed initial demo data in Firestore if not exists
      const initDemoInFirestore = async () => {
        try {
          const userDocRef = doc(db, 'users', demoData.uid);
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) {
            await setDoc(userDocRef, demoData);
          } else {
            setUserProfile(snap.data() as UserProfile);
          }
        } catch (e) {
          console.warn('Demo init sync:', e);
        }
      };
      initDemoInFirestore();
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      startTransition(() => {
        setCurrentUser(user);
      });

      if (user) {
        setLoginError(null);
        localStorage.removeItem('albayan_demo_user_role');
        const userDocPath = `users/${user.uid}`;
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);

          if (!snap.exists()) {
            const initialProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || (selectedLoginRole === 'guru' ? 'Ustadz Pengampu' : 'Santri Aliyah'),
              photoURL: user.photoURL || '',
              role: selectedLoginRole,
              kelas: 'Kelas 10 Madrasah Aliyah',
              schoolName: 'Madrasah Aliyah',
              xp: selectedLoginRole === 'guru' ? 200 : 50,
              streak: 1,
              level: selectedLoginRole === 'guru' ? 'Mahir' : 'Pemula',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
            startTransition(() => {
              setUserProfile(initialProfile);
            });
          } else {
            const data = snap.data() as UserProfile;
            startTransition(() => {
              setUserProfile(data);
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
  }, [selectedLoginRole]);

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

  // Demo / Bawaan Account login function
  const loginWithDemoAccount = async (role: UserRole) => {
    setLoginError(null);
    setLoading(true);
    const demo = DEMO_USERS[role];

    try {
      localStorage.setItem('albayan_demo_user_role', role);
      setCurrentUser({
        uid: demo.uid,
        email: demo.email,
        displayName: demo.displayName,
        photoURL: demo.photoURL,
      });
      setSelectedLoginRole(role);

      // Save/sync into Firestore
      const userDocRef = doc(db, 'users', demo.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        await setDoc(userDocRef, demo);
        setUserProfile(demo);
        // Seed default words and quiz for demo account
        await setDoc(doc(db, 'users', demo.uid, 'saved_words', 'muf-ma-1'), {
          userId: demo.uid,
          wordId: 'muf-ma-1',
          arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ',
          transliteration: 'Assalaamu \'alaikum wa rahmatullaahi wa barakaatuh',
          meaning: 'Semoga keselamatan, rahmat Allah, dan berkah-Nya tercurah untuk kalian (Salam Pembuka)',
          category: 'Bab 1 - Sapaan & Ungkapan',
          savedAt: new Date().toISOString(),
        });
        await setDoc(doc(db, 'users', demo.uid, 'saved_words', 'muf-ma-2'), {
          userId: demo.uid,
          wordId: 'muf-ma-2',
          arabic: 'بِطَاقَةٌ شَخْصِيَّةٌ',
          transliteration: 'Bithaaqotun syakhshiyyah',
          meaning: 'Kartu identitas siswa / Kartu pelajar (KTS)',
          category: 'Bab 1 - Identitas Santri / Siswa',
          savedAt: new Date().toISOString(),
        });
      } else {
        setUserProfile(snap.data() as UserProfile);
      }
    } catch (err: any) {
      console.warn('Error during demo login:', err);
      // Fallback state
      setUserProfile(demo);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (preferredRole?: UserRole) => {
    setLoginError(null);
    const chosenRole = preferredRole || selectedLoginRole;
    setSelectedLoginRole(chosenRole);

    try {
      localStorage.removeItem('albayan_demo_user_role');
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        const userDocRef = doc(db, 'users', cred.user.uid);
        const snap = await getDoc(userDocRef);
        if (!snap.exists()) {
          const newProf: UserProfile = {
            uid: cred.user.uid,
            email: cred.user.email || '',
            displayName: cred.user.displayName || (chosenRole === 'guru' ? 'Ustadz Pengampu' : 'Santri Aliyah'),
            photoURL: cred.user.photoURL || '',
            role: chosenRole,
            kelas: 'Kelas 10 Madrasah Aliyah',
            schoolName: 'Madrasah Aliyah',
            xp: chosenRole === 'guru' ? 200 : 50,
            streak: 1,
            level: chosenRole === 'guru' ? 'Mahir' : 'Pemula',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newProf);
          setUserProfile(newProf);
        } else {
          const existing = snap.data() as UserProfile;
          if (existing.role !== chosenRole && preferredRole) {
            const updated = {
              ...existing,
              role: chosenRole,
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, updated);
            setUserProfile(updated);
          }
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setLoginError(err?.message || 'Gagal masuk dengan akun Google.');
    }
  };

  const updateUserRole = async (newRole: UserRole) => {
    if (!currentUser || !userProfile) return;
    const userDocPath = `users/${currentUser.uid}`;
    try {
      const updated: UserProfile = {
        ...userProfile,
        role: newRole,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', currentUser.uid), updated);
      setUserProfile(updated);
      setSelectedLoginRole(newRole);
      if (localStorage.getItem('albayan_demo_user_role')) {
        localStorage.setItem('albayan_demo_user_role', newRole);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, userDocPath);
    }
  };

  const logout = async () => {
    localStorage.removeItem('albayan_demo_user_role');
    setCurrentUser(null);
    setUserProfile(null);
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
      let newLevel = userProfile.level || 'Pemula';
      if (newXP >= 500) newLevel = 'Mahir';
      else if (newXP >= 200) newLevel = 'Menengah';

      const updated = {
        ...userProfile,
        xp: newXP,
        level: newLevel,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', currentUser.uid), updated);
      setUserProfile(updated);
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
        category: word.category || 'Mufrodat MA',
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
      await awardXP(35);
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
        category: quiz.category || 'Kuis Kelas 10 MA',
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        percentage: quiz.percentage,
        completedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', currentUser.uid, 'quiz_results', quiz.quizId), payload);
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
        selectedLoginRole,
        setSelectedLoginRole,
        savedWords,
        progressList,
        quizResults,
        loading,
        loginError,
        signInWithGoogle,
        loginWithDemoAccount,
        updateUserRole,
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
