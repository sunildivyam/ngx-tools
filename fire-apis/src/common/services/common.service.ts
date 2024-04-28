import * as admin from 'firebase-admin';
import { credential } from 'firebase-admin';
import { env } from 'node:process';
import { AppError } from '@annuadvent/ngx-core/app-error';

export const initFireApp = (): admin.app.App => {
  let firebaseConfig = null;
  let appD: admin.app.App = null;

  try {
    appD = admin.app();
  } catch (error) {
    appD = null;
  }

  try {
    if (!appD) {
      if (env.NODE_ENV === 'development' && env.FIREBASE_SERVICE_ACCOUNT) {
        firebaseConfig = JSON.parse(env.FIREBASE_CONFIG!);
        // Initialize app in dev env only. NOTE: dev env needs service.json file to detect app
        return admin.initializeApp({
          credential: credential.cert(env.FIREBASE_SERVICE_ACCOUNT),
          storageBucket: firebaseConfig?.storageBucket || ''
        });
      } else {
        // Initialize app in firebase env, like firebase functions or google app engine
        firebaseConfig = JSON.parse(env.FIREBASE_CONFIG!);
        return admin.initializeApp({
          storageBucket: firebaseConfig?.storageBucket || ''
        });
      }
    }

    return appD;
  } catch (error) {
    throw new AppError(error);
  }
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
    updateTime: doc.updateTime.toDate()
  };
};
