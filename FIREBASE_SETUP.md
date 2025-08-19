# Firebase Setup Guide

To make authentication and database work, you need to set up Firebase and add environment variables.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication with Email/Password provider

## 2. Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 3. Set Firestore Security Rules

In Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own interviews
    match /interviews/{interviewId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Users can read/write their own feedback
    match /feedback/{feedbackId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web
4. Copy the configuration values

## 5. Create Environment File

Create a `.env.local` file in your project root with these variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 6. For Server-Side Operations (Optional)

If you need server-side authentication, also add:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## 7. Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## 8. Testing

1. Go to `/sign-up` to create a new account
2. Check Firestore Database → Data to see the `users` collection created
3. Go to `/sign-in` to sign in with existing credentials
4. Create an interview to see the `interviews` collection
5. Complete an interview to see the `feedback` collection

## Collections Created

The app will automatically create these collections:

- **`users`** - User profiles (created on sign-up)
- **`interviews`** - Interview data (created when user creates interviews)
- **`feedback`** - Interview feedback (created when interviews are completed)

## Common Issues

- **"Firebase: Error (auth/invalid-api-key)"**: Check your API key
- **"Firebase: Error (auth/user-not-found)"**: User doesn't exist, try signing up first
- **"Firebase: Error (auth/wrong-password)"**: Incorrect password
- **"Missing or insufficient permissions"**: Check Firestore security rules
- **"Collection not found"**: Collections are created automatically when users perform actions

