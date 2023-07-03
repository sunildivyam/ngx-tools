import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { FireAuthService } from '../services/fire-auth.service';
import { FIREBASE_AUTH_ROLES } from '../constants/fire-auth.constants';



@Injectable()
export class RoleReaderGuard {

  constructor(private fireAuthService: FireAuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.checkUserHasRole(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.checkUserHasRole(route, state);
  }

  public async checkUserHasRole(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const redirectUrl = route?.data['redirectUrl'] || '/login';
    const urlTree = this.router.parseUrl(`${redirectUrl}?returnUrl=${state.url}`);
    const isInRole = await this.fireAuthService.currentUserHasRole(FIREBASE_AUTH_ROLES.READER);

    if (!isInRole) {
      return urlTree;
    }

    return true;
  }
}
