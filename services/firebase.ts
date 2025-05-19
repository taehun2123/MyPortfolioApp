// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase 구성
const firebaseConfig = {
  apiKey: "AIzaSyAUReMXhzKcj5l0BdpeJ73CouzBA25ctik",
  authDomain: "myportfolio-73d76.firebaseapp.com",
  projectId: "myportfolio-73d76",
  storageBucket: "myportfolio-73d76.firebasestorage.app",
  messagingSenderId: "989965598621",
  appId: "1:989965598621:web:70f1ccf8c60d8a59d97974",
  measurementId: "G-2LL5PKHDWC"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };