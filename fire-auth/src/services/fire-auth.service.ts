import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import {
  getAuth,
  User,
  Auth,
  onAuthStateChanged,
  getIdTokenResult,
} from 'firebase/auth';
import {
  Observable,
  BehaviorSubject,
} from 'rxjs';
import { FireCommonService } from '@annuadvent/ngx-tools/fire-common';
import { FIREBASE_AUTH_ROLES } from '../constants/fire-auth.constants';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  auth: Auth;
  authState: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);

  constructor(
    private fireCommonService: FireCommonService,
    @Inject(PLATFORM_ID) private platformId,
  ) {
    this.auth = this.getFirebaseAuth();
    onAuthStateChanged(this.getFirebaseAuth(), (user: User) => {
      this.authState.next(user)
    });

    this.authState.subscribe(user => {
      if (typeof user !== 'undefined') {
        this.setLoggedInToLocalStorage(user);
      }
    });
  }

  private getFirebaseAuth(): Auth {
    if (this.auth) {
      return this.auth;
    }

    const app = this.fireCommonService.initOrGetFirebaseApp();
    const auth = getAuth(app);

    return auth;
  }

  public getCurrentUser(): User {
    const auth = this.getFirebaseAuth();
    const currentUser = auth.currentUser;
    return currentUser;
  }

  public getCurrentUserId(): string {
    const currentUser = this.getCurrentUser();

    return currentUser && currentUser.uid || '';
  }

  public isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  public authStateChanged(): Observable<User> {
    return this.authState.asObservable();
  }

  public async logout(): Promise<boolean> {
    const auth = this.getFirebaseAuth();
    await auth.signOut();
    this.authState.next(null);

    return true;
  }

  public isLoggedInFromLocalStorage(): User {
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = window.localStorage.getItem('currentUser');

      return currentUser ? JSON.parse(currentUser) as User : null;
    } else {
      return null;
    }
  }

  public setLoggedInToLocalStorage(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('currentUser', '' + user ? JSON.stringify(user) : '');
      if (user) {
        user.getIdToken().then(token => {
          // TODO: if cookie already exists
          if (token) {
            window.document.cookie = 'Authorization=Bearer ' + token;
          }
        })
      } else {
        window.document.cookie = '';
      }
    }
  }

  public async getCurrentUserRoles(): Promise<Array<string>> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('User is not logged in.');
    }

    const idTokenResult = await getIdTokenResult(currentUser);
    const claims = idTokenResult && idTokenResult.claims;
    const claimsArray: Array<string> = [];
    if (claims) {
      Object.keys(FIREBASE_AUTH_ROLES).forEach(key => {
        if (claims[FIREBASE_AUTH_ROLES[key]]) {
          claimsArray.push(FIREBASE_AUTH_ROLES[key]);
        }
      })
    }

    return claimsArray;
  }

  public async currentUserHasRole(role: string): Promise<boolean> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('User is not logged in.');
    }

    const idTokenResult = await getIdTokenResult(currentUser);
    const claims = idTokenResult && idTokenResult.claims;

    if (typeof claims === 'object' && claims[role]) {
      return true;
    }

    return false;
  }

  public async getAccessToken(): Promise<string> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return await currentUser.getIdToken();
    } else {
      return '';
    }
  }
}
