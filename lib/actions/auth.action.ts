"use client"

import { auth, db } from '@/firebase/client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function signUp(email: string, password: string, name: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with name
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create account' 
    };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sign in' 
    };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sign out' 
    };
  }
}
