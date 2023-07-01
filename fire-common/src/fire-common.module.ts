
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFirebaseService } from './services/common-firebase.service';



@NgModule({
  declarations: [],
  providers: [CommonFirebaseService],
  imports: [
    CommonModule,
  ]
})
export class FireCommonModule { }
