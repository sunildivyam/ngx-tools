import { Injectable } from '@angular/core';
import { LibConfig } from '@annuadvent/ngx-core/app-config';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';

@Injectable()
export class CommonFirebaseService {

  constructor(private libConfig: LibConfig) { }

  public initOrGetFirebaseApp(): FirebaseApp {
    const firebaseApps = getApps();
    const firebaseApp = firebaseApps.length ? firebaseApps[0] : initializeApp(this.libConfig.firebase);

    return firebaseApp;
  }
}
