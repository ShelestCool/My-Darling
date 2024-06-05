import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA3h4Qd052AX7T8b-jhaCnwSf_bCioWyEs",
  authDomain: "my-darling-5ed96.firebaseapp.com",
  projectId: "my-darling-5ed96",
  storageBucket: "my-darling-5ed96.appspot.com",
  messagingSenderId: "946078297455",
  appId: "1:946078297455:web:fddedda82f55a502828c9a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// Custom Hook
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = user.uid === 'kC0Bs7wxAac1LAP5XC4rOCu3HyX2'; // Проверяем конкретный UID
        setCurrentUser({ ...user, isAdmin });
      } else {
        setCurrentUser(null);
      }
    });

    return unsub;
  }, []);

  return currentUser;
}

export { sendPasswordResetEmail };