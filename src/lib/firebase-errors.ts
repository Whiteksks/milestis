
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
    case 'auth/provider-already-linked':
      return 'firebaseErrors.providerAlreadyLinked'
    case 'auth/credential-already-in-use':
      return 'firebaseErrors.credentialAlreadyInUse'
    case 'auth/requires-recent-login':
      return 'firebaseErrors.requiresRecentLogin'
    case 'auth/no-such-provider':
      return 'firebaseErrors.noSuchProvider'
    case 'auth/popup-closed-by-user':
      return 'firebaseErrors.popupClosedByUser'
    case 'auth/popup-blocked':
      return 'firebaseErrors.popupBlocked'
    default:
      return 'firebaseErrors.unknownError';
  }
};
