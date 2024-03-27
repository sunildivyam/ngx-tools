import { WeekDaysEnum } from '../enums/week-days.enum';

export class DeliveryInstruction {
  id: string;
  offDays: Array<WeekDaysEnum>;
  instructionText: string;

  constructor(data: any = null) {
    this.id = data?.id || '';
    this.offDays = data?.offDays || [];
    this.instructionText = data?.instructionText || '';
  }
}
