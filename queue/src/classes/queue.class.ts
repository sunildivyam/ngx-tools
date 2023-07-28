import { BehaviorSubject, Observable } from "rxjs";
import { QueueItem } from "./queue-item.class";
import { QueueStatusEnum } from "../enums/queue.enums";

export class Queue {
    // Subjects
    private queue$: BehaviorSubject<Array<QueueItem>>;
    private currentBatch$: BehaviorSubject<Array<QueueItem>>;
    private status$: BehaviorSubject<QueueStatusEnum>;
    private timer$: BehaviorSubject<number>;

    private startTime: number = 0;
    private batchSize: number = 0;
    private minBatchTime: number = 0;
    private batchStartTime: number = 0;
    private interval: any = null;

    constructor() {
        // Init Subjects
        this.queue$ = new BehaviorSubject<Array<QueueItem>>([]);
        this.currentBatch$ = new BehaviorSubject<Array<QueueItem>>([]);
        this.status$ = new BehaviorSubject<QueueStatusEnum>(QueueStatusEnum.notstarted);
        this.timer$ = new BehaviorSubject<number>(0);
    }

    // Subjects public Value getters
    public get queueValue(): Array<QueueItem> {
        return this.queue$.value;
    }

    public get currentBatchValue(): Array<QueueItem> {
        return this.currentBatch$.value;
    }

    public get statusValue(): QueueStatusEnum {
        return this.status$.value;
    }

    public get timerValue(): number {
        return this.timer$.value;
    }

    // Subjects Value getters as observables

    public get queue(): Observable<Array<QueueItem>> {
        return this.queue$.asObservable();
    }

    public get currentBatch(): Observable<Array<QueueItem>> {
        return this.currentBatch$.asObservable();
    }

    public get status(): Observable<QueueStatusEnum> {
        return this.status$.asObservable();
    }

    public get timer(): Observable<number> {
        return this.timer$.asObservable();
    }

    // private methods
    private getUniqueFromString(str: string = ''): string {
        const rndStr = Math.random().toString(36).substring(2);
        const uniqueId = Date.now().toString(36) + rndStr.substring(rndStr.length / 3);

        return `${str}-${uniqueId}`;
    }

    private find(id: string): QueueItem {
        return this.queue$.value.find(item => item.id === id);
    }

    // private canMethods
    private canAdd(item: QueueItem): boolean {
        const isExist = this.find(item?.id);

        return !!(
            item &&
            item.id &&
            !isExist &&
            item.status === QueueStatusEnum.notstarted
        );
    }

    private canRemove(item: QueueItem): boolean {
        const isExist = this.find(item?.id);

        return !!(
            item &&
            item.id &&
            isExist &&
            item.status === QueueStatusEnum.notstarted
        );
    }

    private canUpdate(item: QueueItem): boolean {
        const isExist = this.find(item?.id);

        return !!(
            item &&
            item.id &&
            isExist &&      // Update is allowed on existing item only
            isExist.status !== QueueStatusEnum.completed && // if already completed, no change allowed
            item.status !== QueueStatusEnum.notstarted  // Can not reset item to notstarted, once added to queue(as notstarted already)
        );
    }

    private canClear(): boolean {
        return [
            QueueStatusEnum.notstarted,
            QueueStatusEnum.completed,
        ].includes(this.statusValue);
    }

    private canStart(): boolean {
        return this.statusValue === QueueStatusEnum.notstarted;
    }

    private canPause(): boolean {
        return this.statusValue === QueueStatusEnum.inprogress;
    }

    private canResume(): boolean {
        return [
            QueueStatusEnum.paused, // paused can be resumed
            QueueStatusEnum.completed, // completed can also be resumed, assuming some items are added later, if still empty, will be paused again.
        ].includes(this.statusValue);
    }

    private canNotifyCurrentItems(): boolean {
        return this.statusValue === QueueStatusEnum.inprogress;
    }

    // private Notify change in subjects methods.

    private notifyQueueChange(items: Array<QueueItem>): void {
        const qItems = items.map(item => new QueueItem(item));

        this.queue$.next(qItems);
    }

    private notifyBatchAndQueue(batch: Array<QueueItem>): void {
        const statusUpdatedItems = this.queueValue.map(item => {
            const match = batch.find(it => it.id === item.id);
            match && match.start();

            return match || item;
        });

        this.batchStartTime = Date.now();
        this.currentBatch$.next(batch);
        this.notifyQueueChange(statusUpdatedItems);
    }

    private notifyStatusChange(status: QueueStatusEnum): void {
        this.status$.next(status);

        if (status === QueueStatusEnum.inprogress) {
            this.notifyCurrentBatchChange();
        }
    }

    private notifyCurrentBatchChange(clear: boolean = false): void {
        if (clear) {
            this.currentBatch$.next([]);
            return;
        }

        if (this.canNotifyCurrentItems()) {
            const nextItems = this.getNextCurrentItems();

            if (!nextItems?.length) {
                // pause queue, if all items are processed.
                this.pause();
            } else if (this.batchStartTime === 0) {
                this.notifyBatchAndQueue(nextItems);
            } else {
                const batchEllapsedTime = Date.now() - this.batchStartTime;

                if (batchEllapsedTime < this.minBatchTime) {
                    setTimeout(() => this.notifyBatchAndQueue(nextItems), this.minBatchTime - batchEllapsedTime);
                } else {
                    this.notifyBatchAndQueue(nextItems);
                }
            }
        }
    }

    private getNextCurrentItems(): Array<QueueItem> {
        const failedOrNotstartedInQueue = this.queueValue
            .filter(item => [
                QueueStatusEnum.failed,
                QueueStatusEnum.notstarted,
            ].includes(item.status));

        return failedOrNotstartedInQueue.slice(0, this.batchSize);
    }

    // Public methods

    public add(items: Array<QueueItem>): void {
        const newItems = items.filter(item => this.canAdd(item));

        return this.notifyQueueChange([...this.queueValue, ...newItems]);
    }

    public remove(items: Array<QueueItem>): void {
        const itemIdsToRemove = items
            .filter(item => this.canRemove(item))
            .map(item => item.id);
        const itemsAfterRemoval = this.queueValue
            .filter(item => !itemIdsToRemove.includes(item.id));

        this.notifyQueueChange(itemsAfterRemoval);
    }

    public update(items: Array<QueueItem>): void {
        const itemIdsToUpdate = items
            .filter(item => this.canUpdate(item))
            .map(item => item.id);
        const itemsAfterUpdate = this.queueValue
            .map(item => {
                if (itemIdsToUpdate.includes(item.id)) {
                    const matchedItem = items.find(uItem => uItem.id === item.id);
                    return matchedItem || item;
                } else {
                    return item;
                }
            });

        this.notifyQueueChange(itemsAfterUpdate);
    }

    public updateQueueBatch(items: Array<QueueItem>): void {
        const itemIdsToUpdate = items.map(item => item.id);
        const currentBatchAfterUpdate = this.currentBatchValue
            .map(item => {
                if (itemIdsToUpdate.includes(item.id)) {
                    const matchedItem = items.find(uItem => uItem.id === item.id);
                    return matchedItem || item;
                } else {
                    return item;
                }
            });

        // Update and notify queue only, but not current batch
        this.update(items);

        // if currentBatch is finished with completed or failed, then get Next batch and notify currentBatch
        const isBatchFinished = !currentBatchAfterUpdate.find(item => item.status === QueueStatusEnum.inprogress);
        if (isBatchFinished) {
            // notify next batch
            this.notifyCurrentBatchChange();
        }
    }

    // public Queue interaction methods

    public start(
        batchSize: number = 1,
        minBatchTime: number = 0, // seconds
    ): void {
        if (!this.canStart()) return;

        this.interval = setInterval(() => this.timer$.next(this.startTime), 1000);
        this.startTime = Date.now();
        this.batchSize = batchSize;
        this.minBatchTime = minBatchTime * 1000; // convert to milliseconds
        this.notifyStatusChange(QueueStatusEnum.inprogress);
    }

    public pause(): void {
        if (!this.canPause()) return;

        this.notifyStatusChange(QueueStatusEnum.paused);
    }


    public resume(): void {
        if (!this.canResume()) return;

        this.notifyStatusChange(QueueStatusEnum.inprogress);
    }

    public clear(): void {
        if (!this.canClear()) return;

        this.interval && clearInterval(this.interval);
        this.interval = null;

        this.notifyQueueChange([]);
        this.notifyStatusChange(QueueStatusEnum.paused);
    }
}

