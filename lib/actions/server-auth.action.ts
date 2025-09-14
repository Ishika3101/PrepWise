import { adminAuth } from '@/firebase/admin';
import { cookies } from 'next/headers';

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return false;
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return !!decodedClaims;
  } catch (error) {
    // Avoid noisy errors in dev overlay; this often occurs for missing/expired cookies
    const message = (error as any)?.message ?? 'Unknown error';
    console.warn('Authentication check warning:', message);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return null;
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
