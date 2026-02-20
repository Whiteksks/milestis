import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

// Initialize once per container.
initializeApp();

export const db = getFirestore();
