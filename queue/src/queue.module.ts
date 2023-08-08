
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueStatusComponent } from './components/queue-status/queue-status.component';



@NgModule({
  declarations: [
    QueueStatusComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    QueueStatusComponent
  ],
})
export class QueueModule { }
