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

export function useDankaUsers() {
  const [users, setUsers] = useState<DankaUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData: DankaUser[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as DankaUser);
      });
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return unsubscribe;
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
