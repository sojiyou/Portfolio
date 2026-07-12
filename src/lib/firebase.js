import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD_wzZ1YkpRGaXqjXWZgF84wsld9SQaKAU",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "sojodecaran-portfolio.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "sojodecaran-portfolio",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "sojodecaran-portfolio.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1096225847305",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1096225847305:web:b22732bdc1e7978bc960d8",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
