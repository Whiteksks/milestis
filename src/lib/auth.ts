import { auth } from "./firebase";
import { AuthError, sendSignInLinkToEmail as firebaseSendSignInLinkToEmail, signOut } from "firebase/auth";

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

export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: error as AuthError }
  }
}