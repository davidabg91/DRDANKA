import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  getDoc,
  query,
  getDocs
} from 'firebase/firestore';
import { DankaUser } from '../app/profile/page';
import { Course } from './courseTypes';
import { Training, Enrollment } from './trainingTypes';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading, auth };
}

const ADMIN_EMAIL = "d.nikolova.haccp@gmail.com";

export function useDankaUsers() {
  const [users, setUsers] = useState<DankaUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dataUnsub: () => void = () => {};

    // Firestore rules let admin read the whole /users collection but a regular
    // user can only read their own doc. Listening to the wrong query throws
    // "Missing or insufficient permissions" in the console even though saves
    // work, so we pick the query based on the signed-in user's email.
    const authUnsub = onAuthStateChanged(auth, (firebaseUser) => {
      dataUnsub();
      dataUnsub = () => {};

      if (!firebaseUser?.email) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const email = firebaseUser.email.toLowerCase();
      const isAdmin = email === ADMIN_EMAIL;

      if (isAdmin) {
        const q = query(collection(db, "users"));
        dataUnsub = onSnapshot(q, (snap) => {
          const list: DankaUser[] = [];
          snap.forEach((d) => list.push(d.data() as DankaUser));
          setUsers(list);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        });
      } else {
        const docRef = doc(db, "users", email);
        dataUnsub = onSnapshot(docRef, (snap) => {
          setUsers(snap.exists() ? [snap.data() as DankaUser] : []);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching own user:", error);
          setLoading(false);
        });
      }
    });

    return () => {
      dataUnsub();
      authUnsub();
    };
  }, []);

  // Returns true if the write succeeded, false otherwise. Caller can show
  // a visible error message rather than silently swallowing failures.
  const updateUser = async (email: string, data: Partial<DankaUser>): Promise<boolean> => {
    const docId = email.trim().toLowerCase();
    try {
      const userRef = doc(db, "users", docId);
      await updateDoc(userRef, data);
      return true;
    } catch (error: any) {
      console.error("Error updating user:", docId, error);
      if (typeof window !== "undefined") {
        alert(
          `Грешка при запис в потребителския профил (${docId}):\n` +
          `${error?.code || ""} ${error?.message || error}`
        );
      }
      return false;
    }
  };

  const setFullUser = async (email: string, data: DankaUser): Promise<boolean> => {
    const docId = email.trim().toLowerCase();
    try {
      const userRef = doc(db, "users", docId);
      // SECURITY: never persist plaintext password — Firebase Auth handles it.
      const { password: _omitPassword, ...safeData } = data;
      // Also store email in lowercase form to match the doc id.
      await setDoc(userRef, { ...safeData, email: docId });
      return true;
    } catch (error: any) {
      console.error("Error setting user:", error);
      alert("Грешка при запис в базата данни (Firebase): " + error.message + "\n\nМоля, проверете вашите Firestore Security Rules в Firebase Console!");
      return false;
    }
  };

  // Send a password reset email through Firebase Auth.
  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return { users, loading, updateUser, setFullUser, sendPasswordReset };
}

/**
 * Subscribe to /trainings (specialized online/zoom courses with certificate).
 * publishedOnly=true → only published rows (for the public /training page).
 */
export function useTrainings(publishedOnly: boolean = true) {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "trainings")),
      (snap) => {
        const list: Training[] = [];
        snap.forEach((d) => list.push(d.data() as Training));
        const filtered = publishedOnly ? list.filter((t) => t.published) : list;
        filtered.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setTrainings(filtered);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching trainings:", error);
        setLoading(false);
      }
    );
    return unsub;
  }, [publishedOnly]);

  return { trainings, loading };
}

/**
 * Admin-only: subscribe to /enrollments (paid training signups).
 * Returns empty list silently for non-admin callers (rules block read).
 */
export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "enrollments")),
      (snap) => {
        const list: Enrollment[] = [];
        snap.forEach((d) => list.push(d.data() as Enrollment));
        list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setEnrollments(list);
        setLoading(false);
      },
      (error) => {
        // Non-admins get permission-denied; treat as empty.
        if (error?.code !== "permission-denied") {
          console.error("Error fetching enrollments:", error);
        }
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { enrollments, loading };
}

/**
 * Subscribe to /courses collection.
 * `publishedOnly` filters out drafts — pass false to load the admin list.
 */
export function useCourses(publishedOnly: boolean = true) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "courses"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Course[] = [];
        snap.forEach((d) => list.push(d.data() as Course));
        const filtered = publishedOnly ? list.filter((c) => c.published) : list;
        // Newest first.
        filtered.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setCourses(filtered);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    );
    return unsub;
  }, [publishedOnly]);

  return { courses, loading };
}

