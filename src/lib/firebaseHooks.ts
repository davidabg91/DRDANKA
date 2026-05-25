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

  const updateUser = async (email: string, data: Partial<DankaUser>) => {
    try {
      const userRef = doc(db, "users", email);
      await updateDoc(userRef, data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const setFullUser = async (email: string, data: DankaUser) => {
    try {
      const userRef = doc(db, "users", email);
      // SECURITY: never persist plaintext password — Firebase Auth handles it.
      const { password: _omitPassword, ...safeData } = data;
      await setDoc(userRef, safeData);
    } catch (error: any) {
      console.error("Error setting user:", error);
      alert("Грешка при запис в базата данни (Firebase): " + error.message + "\n\nМоля, проверете вашите Firestore Security Rules в Firebase Console!");
    }
  };

  // Send a password reset email through Firebase Auth.
  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return { users, loading, updateUser, setFullUser, sendPasswordReset };
}
