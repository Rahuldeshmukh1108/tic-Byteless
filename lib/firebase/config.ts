import { initializeApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Firebase configuration - these values should be in your .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// Check if Firebase is properly configured
const isConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
)

let app: any = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

try {
  if (isConfigured) {
    // Initialize Firebase only if properly configured
    app = initializeApp(firebaseConfig)
    
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app)
    
    // Initialize Firestore and get a reference to the service
    db = getFirestore(app)
    
    // Initialize Firebase Storage
    storage = getStorage(app)
  }
} catch (error) {
  console.error('Firebase initialization error. Make sure you have set up environment variables in .env.local', error)
}

// Export services with proper types, or null if not configured
export { auth, db, storage, isConfigured }
export default app
