import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default function initDb() {
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

  return getFirestore(app);
}
