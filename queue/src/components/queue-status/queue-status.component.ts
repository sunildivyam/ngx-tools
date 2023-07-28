import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Queue } from '../../classes/queue.class';
import { QueueItem } from '../../classes/queue-item.class';
import { QueueStatusEnum } from '../../enums/queue.enums';
import { Subscription } from 'rxjs';
/**
 * Visualizes the Queue running status, with counts and status for inprogress, paused, notstarted, failed and completeed.
 */
@Component({
  selector: 'anu-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.scss']
})
export class QueueStatusComponent implements OnInit, OnChanges, OnDestroy {
  @Input() queue: Queue = null;
  @Output() startClick = new EventEmitter<void>();

  qItems: Array<QueueItem> = [];
  qStatus: QueueStatusEnum = QueueStatusEnum.notstarted;
  totalCount: number = 0;
  completedCount: number = 0;
  notstartedCount: number = 0;
  failedCount: number = 0;
  inprogressCount: number = 0;
  queueSubscription: Subscription = null;
  statusSubscription: Subscription = null;

  constructor() {

  }

  ngOnInit(): void {
    this.subscribeQueue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscribeQueue();
  }

  ngOnDestroy(): void {
    // Unsubscribe if already subscribed
    this.queueSubscription && this.queueSubscription.unsubscribe();
    this.statusSubscription && this.statusSubscription.unsubscribe();
  }

  private subscribeQueue(): void {
    if (!this.queue) return;
    // Unsubscribe if already subscribed
    this.queueSubscription && this.queueSubscription.unsubscribe();
    this.statusSubscription && this.statusSubscription.unsubscribe();

    // Subscribe queue items change
    this.queue.queue.subscribe((qItems: Array<QueueItem>) => {
      this.qItems = qItems;
      this.refreshQueueCounters();
    });

    // Subscribe queue status change
    this.queue.status.subscribe((status: QueueStatusEnum) => this.qStatus = status);
  }

  private refreshQueueCounters(): void {
    this.totalCount = 0;
    this.completedCount = 0;
    this.notstartedCount = 0;
    this.failedCount = 0;
    this.inprogressCount = 0;

    // Calculate counters by cheching all items
    this.qItems.map(qItem => {
      switch (qItem.status) {
        case QueueStatusEnum.notstarted:
          this.notstartedCount++;
          break;
        case QueueStatusEnum.inprogress:
          this.inprogressCount++;
          break;
        case QueueStatusEnum.completed:
          this.completedCount++;
          break;
        case QueueStatusEnum.failed:
          this.failedCount++;
          break;
      }
    });
  }

  public startClicked(event: any): void {
    switch (this.qStatus) {
      case QueueStatusEnum.notstarted:
        this.startClick.emit();
        break;
      case QueueStatusEnum.inprogress:
        this.queue?.pause();
        break;
      case QueueStatusEnum.paused:
        this.queue?.resume();
        break;
      default:
        console.log('Queue is complted or stopped already Or may be not initialized yet.');
    }
  }
}

