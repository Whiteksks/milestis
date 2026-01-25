
export const getFirebaseAuthErrorTranslationKey = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'firebaseErrors.invalidEmail';
    case 'auth/user-disabled':
      return 'firebaseErrors.userDisabled';
    case 'auth/user-not-found':
      return 'firebaseErrors.userNotFound';
    case 'auth/wrong-password':
      return 'firebaseErrors.wrongPassword';
    case 'auth/email-already-in-use':
      return 'firebaseErrors.emailAlreadyInUse';
    case 'auth/operation-not-allowed':
      return 'firebaseErrors.operationNotAllowed';
    case 'auth/weak-password':
      return 'firebaseErrors.weakPassword';
    case 'auth/invalid-credential':
        return 'firebaseErrors.invalidCredential'
    default:
      return 'firebaseErrors.unknownError';
  }
};
