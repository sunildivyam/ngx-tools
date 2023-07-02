
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FireCategoriesHttpService } from './services/fire-categories-http.service';
import { FireArticlesHttpService } from './services/fire-articles-http.service';



@NgModule({
  declarations: [],
  providers: [
    FireCategoriesHttpService,
    FireArticlesHttpService,
  ],
  imports: [
    CommonModule
  ]
})
export class FireCmsModule { }
