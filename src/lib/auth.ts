import { auth } from "./firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, AuthError, sendSignInLinkToEmail as firebaseSendSignInLinkToEmail } from "firebase/auth";

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
}

export const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error as AuthError };
    }
}

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
    return { success: false, error: error as AuthError };
  }
};
