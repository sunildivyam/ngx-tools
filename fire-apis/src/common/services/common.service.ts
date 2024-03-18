import { getApps, initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { join } from 'node:path';
import { env } from 'node:process';

export const initFireApp = () => {
  const apps = getApps();

  if (!apps || !apps.length) {
    if (env.NODE_ENV === 'development') {
      const serviceAccount = join(
        __dirname,
        '../../../../../Annu Advent/Company Meta Info/App- documentation/annu-business-firebase-adminsdk-ae9gz-b22965e21c.json'
      );

      // Initialize app in deve env only. NOTE: dev env needs service.json file to detect app
      initializeApp({
        credential: credential.cert(serviceAccount),
      });
    } else {
      // Initialize app in firebase env, like firebase functions or google app engine
      initializeApp();
    }
  }
};
