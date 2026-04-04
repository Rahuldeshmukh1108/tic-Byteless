import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  User,
} from 'firebase/auth'
import { auth, db } from './config'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export interface UserProfile {
  uid: string
  name: string
  email: string
  language: string
  theme: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Sign up a new user with email and password
 * Creates a user document in Firestore after successful authentication
 */
export async function signup(
  email: string,
  password: string,
  name: string
): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase auth is not initialized. Verify your .env.local configuration.')
  }
  if (!db) {
    throw new Error('Firestore is not initialized. Verify your Firebase configuration.')
  }

  try {
    await setPersistence(auth, browserLocalPersistence)

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user) {
      throw new Error('Failed to create user account. Please try again.')
    }

    await user.reload()
    await user.getIdToken(true)

    const userProfile: UserProfile = {
      uid: user.uid,
      name,
      email,
      language: 'en',
      theme: 'dark',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, 'users', user.uid), userProfile)

    return userProfile
  } catch (error) {
    throw error
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function login(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase auth is not initialized. Verify your .env.local configuration.')
  }

  try {
    await setPersistence(auth, browserLocalPersistence)

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

/**
 * Sign in with Google
 */
async function ensureUserProfile(user: User): Promise<void> {
  if (!db) {
    throw new Error('Firestore database is not initialized.')
  }

  const userRef = doc(db, 'users', user.uid)
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || 'Google User',
      email: user.email || '',
      language: 'en',
      theme: 'dark',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

export async function signInWithGoogle(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase auth is not initialized. Verify your .env.local configuration.')
  }

  console.log('Starting Google sign-in redirect...')
  await setPersistence(auth, browserLocalPersistence)
  return signInWithRedirect(auth, googleProvider)
}

export async function completeGoogleRedirectSignIn(): Promise<boolean> {
  if (!auth) {
    throw new Error('Firebase auth is not initialized.')
  }

  const result = await getRedirectResult(auth)
  if (!result?.user) {
    return false
  }

  await ensureUserProfile(result.user)
  return true
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase auth is not initialized. Verify your .env.local configuration.')
  }

  try {
    await signOut(auth)
  } catch (error) {
    throw error
  }
}

/**
 * Get the current user's profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    }
    return null
  } catch (error) {
    throw error
  }
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    throw error
  }
}

/**
 * Subscribe to authentication state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get Firebase error message in user-friendly format
 */
export function getAuthErrorMessage(error: any): string {
  const code = error.code
  const message = error.message

  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is invalid.'
    case 'auth/user-disabled':
      return 'This user account has been disabled.'
    case 'auth/user-not-found':
      return 'No user found with this email.'
    case 'auth/wrong-password':
      return 'The password is incorrect.'
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.'
    case 'auth/weak-password':
      return 'The password is too weak. Use at least 8 characters with an uppercase letter and number.'
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please enable Email/Password or Google sign-in in Firebase Auth settings.'
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please try again later.'
    case 'auth/missing-or-insufficient-credential':
      return 'Missing or insufficient credentials. Verify your Firebase configuration and try again.'
    case 'auth/permission-denied':
      return 'Firebase permission denied. Ensure your security rules allow the authenticated user to create and read their profile.'
    case 'auth/auth-domain-config-required':
      return 'Firebase Auth requires an authDomain. Check your NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN value in .env.local.'
    case 'auth/invalid-api-key':
      return 'Invalid Firebase API key. Check your NEXT_PUBLIC_FIREBASE_API_KEY value in .env.local.'
    default:
      return message || 'An authentication error occurred.'
  }
}
