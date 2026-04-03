import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { auth, db } from './config'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

const googleProvider = new GoogleAuthProvider()

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
  try {
    // Set persistence to local so user stays logged in
    await setPersistence(auth, browserLocalPersistence)

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user profile in Firestore
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
  try {
    // Set persistence to local so user stays logged in
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
export async function signInWithGoogle(): Promise<User> {
  try {
    await setPersistence(auth, browserLocalPersistence)
    const userCredential = await signInWithPopup(auth, googleProvider)
    const user = userCredential.user

    // Ensure Firestore user profile exists
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

    return user
  } catch (error) {
    throw error
  }
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
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
      return 'This operation is not allowed.'
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please try again later.'
    default:
      return message || 'An authentication error occurred.'
  }
}
