import { auth } from "./firebase";
import { AuthError, sendSignInLinkToEmail as firebaseSendSignInLinkToEmail, signOut } from "firebase/auth";
import { getFirebaseAuthErrorTranslationKey } from "./firebase-errors";

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
    console.log(translationKey);
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