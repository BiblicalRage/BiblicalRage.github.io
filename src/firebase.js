import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8PtsdZGVUylp7Nw5nUImEKEBjtWSeYeU",
  authDomain: "firstkey-49e51.firebaseapp.com",
  projectId: "firstkey-49e51",
  storageBucket: "firstkey-49e51.firebasestorage.app",
  messagingSenderId: "197553791545",
  appId: "1:197553791545:web:8e6c26d9aac7788648a3e8",
  measurementId: "G-EGBXSWGHKK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };