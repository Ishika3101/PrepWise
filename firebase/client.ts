import { initializeApp, getApps } from 'firebase/app';
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
} as const;
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// } as const;

if (!firebaseConfig.apiKey) {
  // Provide a clear error for misconfigured env vars
  throw new Error(
    'Missing NEXT_PUBLIC_FIREBASE_API_KEY. Add it to .env.local and restart the dev server.'
  );
}

// Initialize Firebase (avoid re-initializing in Fast Refresh)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
