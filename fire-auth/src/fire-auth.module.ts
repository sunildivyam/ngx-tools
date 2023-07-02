
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FireAuthService } from './services/fire-auth.service';
import { FireAuthUiService } from './services/fire-auth-ui.service';



@NgModule({
  declarations: [],
  providers: [
    FireAuthService,
    FireAuthUiService,
  ],
  imports: [
    CommonModule
  ]
})
export class FireAuthModule { }
