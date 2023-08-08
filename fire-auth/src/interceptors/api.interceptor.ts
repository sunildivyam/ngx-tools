import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { AppConfigService } from '@annuadvent/ngx-core/app-config';
import { FireAuthService } from '../services/fire-auth.service';
import { FirebaseConfig } from '@annuadvent/ngx-tools/fire-common';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {

  constructor(private appConfigService: AppConfigService, private fireAuthService: FireAuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes(`/api/`)) {
      const apiKey = (this.appConfigService.firebase as FirebaseConfig)?.app?.apiKey;
      
      let clonedRequest = request.clone({
        setParams: { key: apiKey }
      });

      if (this.fireAuthService.getCurrentUserId()) {
        return from(this.fireAuthService.getAccessToken()).pipe(
          switchMap(token => {
            if (token) {
              clonedRequest = clonedRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
            }

            return next.handle(clonedRequest);
          })
        )
      } else {
        return next.handle(clonedRequest);
      }

    } else {
      return next.handle(request);
    }
  }
}
