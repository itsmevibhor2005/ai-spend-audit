import admin from "firebase-admin";

function initFirebaseAdmin() {
  // already initialized
  if (admin.apps.length) {
    return admin.app();
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  // Build/CI safety:
  // GitHub Actions may not have env vars.
  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const app = initFirebaseAdmin();

export const adminDb = app ? admin.firestore() : null;
