import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2AHyyRhQy3tMmAozC8_dqIABKcumvtmo",
  authDomain: "prepwise-7d158.firebaseapp.com",
  projectId: "prepwise-7d158",
  storageBucket: "prepwise-7d158.firebasestorage.app",
  messagingSenderId: "961397210577",
  appId: "1:961397210577:web:307143ce27a48f658834f0",
  measurementId: "G-ZFE5ZKLK2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
