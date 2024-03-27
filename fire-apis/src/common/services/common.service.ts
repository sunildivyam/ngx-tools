import { getApps, initializeApp, App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { join } from 'node:path';
import { env } from 'node:process';

export const initFireApp = (): App => {
  let firebaseConfig = null;

  try {
    firebaseConfig = JSON.parse(env.FIREBASE_CONFIG!);
  } catch (error) {}

  const apps = getApps();

  if (!apps || !apps.length) {
    if (env.NODE_ENV === 'development' && env.FIREBASE_SERVICE_ACCOUNT) {
      // Initialize app in dev env only. NOTE: dev env needs service.json file to detect app
      return initializeApp({
        credential: credential.cert(env.FIREBASE_SERVICE_ACCOUNT),
        storageBucket: firebaseConfig?.storageBucket || '',
      });
    } else {
      // Initialize app in firebase env, like firebase functions or google app engine
      return initializeApp();
    }
  }

  return apps[0];
};
