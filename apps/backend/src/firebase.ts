import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Lazily initializes the Firebase Admin SDK using a service account JSON
 * stored in the FIREBASE_SERVICE_ACCOUNT env var (set as a Vercel secret,
 * per CLAUDE.md's "Secrets" section). Only call getFirestoreDb() from
 * route handlers that actually touch Firestore — this keeps `pnpm test`
 * and most of local dev usable without real Firebase credentials.
 */
function getFirebaseApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0] as App;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT env var is not set. Add the Firebase service ' +
        'account JSON (as a single-line string) to your Vercel project env vars.',
    );
  }

  return initializeApp({
    credential: cert(JSON.parse(serviceAccountJson)),
  });
}

export function getFirestoreDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
