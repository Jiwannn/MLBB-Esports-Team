import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcER2DhBIt8us9rNj06AjSG8Bj6OzI6Rs",
  authDomain: "rvcmanagement-dc3e2.firebaseapp.com",
  projectId: "rvcmanagement-dc3e2",
  storageBucket: "rvcmanagement-dc3e2.firebasestorage.app",
  messagingSenderId: "348371407756",
  appId: "1:348371407756:web:fdcbb8dc8667b84e68fca9",
  measurementId: "G-DCCY348R01"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);