import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFpwB8QkazPXBeHaS8mAyyijFGtX2VzVI",
  authDomain: "fiszki-f877a.firebaseapp.com",
  projectId: "fiszki-f877a",
  storageBucket: "fiszki-f877a.appspot.com",
  messagingSenderId: "801499863191",
  appId: "1:801499863191:web:dcae09440a79721fca31d2",
  measurementId: "G-6E8BJ2M3YM",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
