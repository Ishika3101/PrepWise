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
    console.log('Starting signup process for:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created with UID:', user.uid);
    
    // Update user profile with name
    await updateProfile(user, { displayName: name });
    console.log('User profile updated');
    
    // Create user document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userData = {
      id: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
    };
    console.log('Creating user document with data:', userData);
    await setDoc(userDocRef, userData);
    console.log('User document created successfully in Firestore');
    
    // Get ID token and create session cookie
    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);
    console.log('Session cookie created');
    
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
    
    // Get ID token and create session cookie
    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);
    
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
    // Clear session cookie
    await clearSessionCookie();
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sign out' 
    };
  }
}

async function createSessionCookie(idToken: string) {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
  } catch (error) {
    console.error('Session creation error:', error);
  }
}

async function clearSessionCookie() {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear session');
    }
  } catch (error) {
    console.error('Session clear error:', error);
  }
}
