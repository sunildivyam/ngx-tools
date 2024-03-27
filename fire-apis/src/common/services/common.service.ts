import { getApps, initializeApp, App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
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

export const mergeUnique = (arr1: Array<any>, arr2: Array<any>) => {
  // Combine arrays and convert to Set to remove duplicates
  const uniqueSet = new Set([...arr1, ...arr2]);
  // Spread the Set back into an array
  return [...uniqueSet];
};

/**
 * Removes id, createTime, and updateTime from the data object. As these props available outside of firebase doc.data()
 * @param data
 * @returns
 */
export const toDbFormat = (data: any): any => {
  const dbFormat = JSON.parse(JSON.stringify({ ...data }));
  delete dbFormat.id;
  delete dbFormat.createTime;
  delete dbFormat.updateTime;

  return dbFormat;
};

/**
 * Adds id, createTime, and updateTime to the data object. As these props available outside of firebase doc.data()
 * @param doc firebase document snapshot
 * @returns
 */
export const fromDbFormat = (doc: any): any => {
  return {
    ...doc.data(),
    id: doc.id,
    createTime: doc.createTime.toDate(),
    updateTime: doc.updateTime.toDate(),
  };
};
