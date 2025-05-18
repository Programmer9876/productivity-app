
  // src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Replace this with your actual config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD3ndau-N59glycmdC330qAVsJ0e-f1d0A",
    authDomain: "productivityapp-35445.firebaseapp.com",
    databaseURL: "https://productivityapp-35445-default-rtdb.firebaseio.com",
    projectId: "productivityapp-35445",
    storageBucket: "productivityapp-35445.firebasestorage.app",
    messagingSenderId: "715587072096",
    appId: "1:715587072096:web:a18d67b0830e637b271305",
    measurementId: "G-M5RTLVHJ13"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);