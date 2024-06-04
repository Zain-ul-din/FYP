import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);
export const fireStorage = getStorage(app);

///
/// firebase storage
///
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function uploadBlobToFirestore(
  blob: Blob,
  destinationBlobName?: string
): Promise<string> {
  // Create a reference to the destination blob
  const storageRef = ref(fireStorage, `images/${destinationBlobName || uuidv4()}`);
  // Upload the blob to Firebase Storage
  await uploadBytes(storageRef, blob);
  // Get the URL of the uploaded file
  const url = await getDownloadURL(storageRef);
  return url;
}
