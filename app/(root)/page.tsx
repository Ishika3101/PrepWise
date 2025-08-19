"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, User, LogOut } from 'lucide-react';
import InterviewCard from '@/components/InterviewCard';
import { dummyInterviews } from '@/constants';
import type { User as FirebaseUser } from 'firebase/auth';
import { signOut } from '@/lib/actions/auth.action';

const Page = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        const [{ onAuthStateChanged }, { auth }] = await Promise.all([
          import('firebase/auth'),
          import('@/firebase/client'),
        ]);
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
        });
      } catch (err) {
        // If Firebase isn't configured yet, just show logged-out state
        console.warn('Auth not initialized:', err);
        setCurrentUser(null);
      }
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="root-layout">
      {/* Header */}
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="PrepWise" width={40} height={40} />
          <h1 className="text-2xl font-bold text-primary-100">PrepWise</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Interview
          </button>
          
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-dark-100" />
              </div>
              <span className="text-light-100">{currentUser.displayName || currentUser.email}</span>
              <button
                className="p-2 text-light-100 hover:text-primary-200 transition-colors"
                onClick={async () => { await signOut(); }}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className="btn-secondary">Sign In</Link>
              <Link href="/sign-up" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Master Your Interviews with AI
        </h2>
        <p className="text-xl text-light-100 max-w-2xl mx-auto">
          Practice with realistic mock interviews powered by AI. Get instant feedback and improve your skills.
        </p>
      </section>

      {/* Recent Interviews */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-white">Recent Interviews</h3>
          <Link href="/sign-in" className="btn-secondary">
            View All
          </Link>
        </div>
        
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="card-cta">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Ready to ace your next interview?
          </h3>
          <p className="text-light-100">
            Start practicing with our AI-powered mock interviews today.
          </p>
        </div>
        <Link href="/sign-in" className="btn-primary">
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Page;
