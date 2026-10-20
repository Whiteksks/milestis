import { auth } from "../firebase/firebase";
import { AuthError, GoogleAuthProvider, sendSignInLinkToEmail as firebaseSendSignInLinkToEmail, signOut, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirebaseAuthErrorTranslationKey } from "../firebase/firebase-errors";

export const sendSignInLinkToEmail = async (email: string) => {
  const actionCodeSettings = {
    url: window.location.origin + '/auth/finish',
    handleCodeInApp: true,
  };
  try {
    await firebaseSendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    return { success: true, error: null };
  } catch (error) {
    const authError = error as AuthError;
    const translationKey = getFirebaseAuthErrorTranslationKey(authError.code);
    return { success: false, error: translationKey };
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    await firebaseSignInWithEmailAndPassword(auth, email, password);
    return { success: true, error: null };
  } catch (error) {
    const authError = error as AuthError;
    const translationKey = getFirebaseAuthErrorTranslationKey(authError.code);
    return { success: false, error: translationKey };
  }
};

/** Signs in (or signs up, on first use) with a Google popup. Account doc self-heals via FirebaseInitializer. */
export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    return { success: true, error: null };
  } catch (error) {
    const authError = error as AuthError;
    const translationKey = getFirebaseAuthErrorTranslationKey(authError.code);
    return { success: false, error: translationKey };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { success: true, error: null }
  } catch (error) {
    const authError = error as AuthError;
    const translationKey = getFirebaseAuthErrorTranslationKey(authError.code);
    return { success: false, error: translationKey };
  }
}
