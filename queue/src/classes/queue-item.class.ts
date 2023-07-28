import { QueueStatusEnum } from "../enums/queue.enums";

export class QueueItem {
    id: string = '';
    data: any;
    status: QueueStatusEnum = QueueStatusEnum.notstarted;
    startTime: number = 0;
    completedTime: number = 0;

    constructor(
        idOrQueueItem: string | QueueItem = '',
        data: any = null,
        status: QueueStatusEnum = QueueStatusEnum.notstarted,
        startTime: number = 0,
        completedTime: number = 0,
    ) {
        if (!idOrQueueItem) return;


        if (typeof idOrQueueItem === 'string') {
            // if id is provided, then fill oitem with rest of the params
            this.id = idOrQueueItem as string;
            this.data = data;
            this.status = status;
            this.startTime = startTime;
            this.completedTime = completedTime;
        } else {
            // if QueueItem object is provided, then ignore other params, and fill from object
            const { id, data, status, startTime, completedTime } = idOrQueueItem;

            this.id = id;
            this.data = data;
            this.status = status;
            this.startTime = startTime;
            this.completedTime = completedTime;
        }
    }


    public get timeEllapsed(): number {
        if (this.startTime === 0) return 0;

        return Math.round((this.completedTime > 0 ?
            this.completedTime - this.startTime :
            Date.now() - this.startTime) / 1000);
    }

    public start(): void {
        this.status = QueueStatusEnum.inprogress;
        this.startTime = Date.now();
    }

    public complete(): void {
        this.status = QueueStatusEnum.completed;
        this.completedTime = Date.now();
    }

    public fail(): void {
        this.status = QueueStatusEnum.failed;
        this.completedTime = Date.now();
    }
}
