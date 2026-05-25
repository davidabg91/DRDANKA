import { initializeApp, getApps, cert, App, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";

/**
 * Firebase Admin SDK initialization (server-side only).
 *
 * Reads credentials from one of:
 *   - FIREBASE_SERVICE_ACCOUNT_BASE64  (base64-encoded JSON of the service account)
 *   - FIREBASE_SERVICE_ACCOUNT         (raw JSON string of the service account)
 *
 * To get this: Firebase Console → Project settings → Service accounts →
 * "Generate new private key". Then base64-encode the JSON file and put it
 * in .env.local. Never commit this value.
 */

let app: App | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;
let _storage: Storage | null = null;

function loadServiceAccount(): ServiceAccount {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  let json: string | undefined;
  if (b64) {
    json = Buffer.from(b64, "base64").toString("utf8");
  } else if (raw) {
    json = raw;
  }
  if (!json) {
    throw new Error(
      "Firebase Admin: missing FIREBASE_SERVICE_ACCOUNT_BASE64 (preferred) " +
        "or FIREBASE_SERVICE_ACCOUNT env var. See STRIPE_SETUP.md."
    );
  }
  const parsed = JSON.parse(json);
  // Private key newlines are sometimes escaped when stored as env strings.
  if (typeof parsed.private_key === "string") {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }
  return parsed as ServiceAccount;
}

function ensureApp(): App {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }
  const sa = loadServiceAccount();
  const bucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET;
  app = initializeApp({
    credential: cert(sa),
    storageBucket: bucket,
  });
  return app;
}

export function adminDb(): Firestore {
  if (!_db) _db = getFirestore(ensureApp());
  return _db;
}

export function adminAuth(): Auth {
  if (!_auth) _auth = getAuth(ensureApp());
  return _auth;
}

export function adminStorage(): Storage {
  if (!_storage) _storage = getStorage(ensureApp());
  return _storage;
}
