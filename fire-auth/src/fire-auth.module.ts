
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpinnerModule } from '@annuadvent/ngx-common-ui/spinner';
import { ErrorModule } from '@annuadvent/ngx-common-ui/error';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { FireCommonModule } from '@annuadvent/ngx-tools/fire-common';




@NgModule({
  declarations: [
    LoginComponent,
    LoginStatusComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule,
    ErrorModule,
    FireCommonModule,
  ],
  exports: [
    LoginComponent,
    LoginStatusComponent,
  ],
})
export class FireAuthModule { }
