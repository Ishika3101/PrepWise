"use client"

import { db } from '@/firebase/client';
import { doc, setDoc, collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import type { Interview, Feedback, CreateFeedbackParams } from '@/types';

export async function createInterview(interviewData: Omit<Interview, 'id' | 'createdAt'>) {
  try {
    const interviewRef = await addDoc(collection(db, 'interviews'), {
      ...interviewData,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, interviewId: interviewRef.id };
  } catch (error: any) {
    console.error('Create interview error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create interview' 
    };
  }
}

export async function createFeedback(feedbackData: CreateFeedbackParams) {
  try {
    const feedbackRef = await addDoc(collection(db, 'feedback'), {
      interviewId: feedbackData.interviewId,
      userId: feedbackData.userId,
      transcript: feedbackData.transcript,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, feedbackId: feedbackRef.id };
  } catch (error: any) {
    console.error('Create feedback error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create feedback' 
    };
  }
}

export async function getLatestInterviews(userId: string, limitCount: number = 5) {
  try {
    const q = query(
      collection(db, 'interviews'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const interviews: Interview[] = [];
    
    querySnapshot.forEach((doc) => {
      interviews.push({ id: doc.id, ...doc.data() } as Interview);
    });
    
    return { success: true, interviews };
  } catch (error: any) {
    console.error('Get interviews error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to get interviews' 
    };
  }
}

export async function getFeedbackByInterviewId(interviewId: string, userId: string) {
  try {
    const q = query(
      collection(db, 'feedback'),
      where('interviewId', '==', interviewId),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const feedback: Feedback[] = [];
    
    querySnapshot.forEach((doc) => {
      feedback.push({ id: doc.id, ...doc.data() } as Feedback);
    });
    
    return { success: true, feedback: feedback[0] || null };
  } catch (error: any) {
    console.error('Get feedback error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to get feedback' 
    };
  }
}
