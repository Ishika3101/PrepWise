import { adminAuth } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import type { Interview } from '@/types';

const db = getFirestore();

export async function createInterview(interviewData: Omit<Interview, 'id' | 'createdAt'>) {
  try {
    const interviewRef = await db.collection('interviews').add({
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

export async function getLatestInterviews(userId: string, limitCount: number = 5) {
  try {
    const querySnapshot = await db.collection('interviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();
    
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
