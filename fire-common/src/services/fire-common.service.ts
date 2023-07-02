import { Injectable } from '@angular/core';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { FirebaseConfig } from '../interfaces/fire-common.interface';

@Injectable()
export class FireCommonService {
  _firebaseConfig: FirebaseConfig;

  constructor() { }


  public get firebaseConfig(): FirebaseConfig {
    return this._firebaseConfig;
  }


  public set firebaseConfig(v: FirebaseConfig) {
    this._firebaseConfig = v;
  }

  public initOrGetFirebaseApp(): FirebaseApp {
    if (!this._firebaseConfig) throw new Error('Firebase config is not initialized. First set this.fireCommonService.firebaseConfig with config');
    const firebaseApps = getApps();
    const firebaseApp = firebaseApps.length ?
      firebaseApps[0] :
      initializeApp(this._firebaseConfig.app);

    return firebaseApp;
  }
}
