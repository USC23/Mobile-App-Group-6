// src/services/firebase.ts
// Initialize Firebase here. Replace the firebaseConfig values with your
// project's configuration from the Firebase console.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: '<YOUR_API_KEY>',
  authDomain: '<YOUR_AUTH_DOMAIN>',
  projectId: '<YOUR_PROJECT_ID>',
  storageBucket: '<YOUR_STORAGE_BUCKET>',
  messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>',
  appId: '<YOUR_APP_ID>',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Note: It's fine to keep Firebase config in client apps for web/native.
// Replace the placeholder values above with real values from your Firebase project.
