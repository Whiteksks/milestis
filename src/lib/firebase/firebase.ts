import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// App Check with reCAPTCHA v3 — protects Firebase AI and other backend resources.
// For local dev: set NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN to the debug token
// shown in the browser console after first run, then register it in Firebase Console → App Check → Apps → overflow menu → Manage debug tokens.
if (typeof window !== 'undefined') {
  if (process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN) {
    const raw = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN
    // boolean true → Firebase auto-generates a UUID token and prints it to console
    // @ts-expect-error — Firebase debug token global
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = raw === 'true' ? true : raw
  }
  if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    })
  }
}

// Persistent cache: data survives page refresh and works offline.
// persistentMultipleTabManager allows multiple browser tabs simultaneously.
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
