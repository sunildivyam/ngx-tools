
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreHttpService } from './services/firestore-http.service';
import { FirestoreParserService } from './services/firestore-parser.service';
import { FirestoreQueryService } from './services/firestore-query.service';

@NgModule({
  declarations: [],
  providers: [
    FirestoreParserService,
    FirestoreQueryService,
    FirestoreHttpService,
  ],
  imports: [
    CommonModule
  ]
})
export class FireStoreModule { }
