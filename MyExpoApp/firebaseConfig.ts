import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
 * Firebase client configuration
 *
 * Replace the placeholder values below with your Firebase project's
 * credentials. You can find these in your Firebase console under
 * Project settings → General → Your apps → SDK setup and configuration.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDKZwgAqFQpu-crJSWkA2jsoxmYrx7eb3A",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "samaj-app-a3de3.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "samaj-app-a3de3",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "samaj-app-a3de3.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1026096219048",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:1026096219048:web:0f500daca628b1fe5d939d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
// This keeps user logged in between app sessions
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const firestore = getFirestore(app);

// Optionally export the app if needed elsewhere
export default app;