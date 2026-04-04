import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBatHAE6-KqFil5Otl0UHJRuXZEE0hAz7U",
  authDomain: "optimetry-67d51.firebaseapp.com",
  projectId: "optimetry-67d51",
  storageBucket: "optimetry-67d51.firebasestorage.app",
  messagingSenderId: "151605706866",
  appId: "1:151605706866:web:0312e0dcee87c0635042eb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);