import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';


export class ConfirmationInfoEmail {
  userId: string;
  expirationDate: Date | null;
  isConfirmed: boolean;
  confirmationCode: string | null;

  constructor(userId: string, isDate: boolean = true) {
    this.confirmationCode = isDate ? randomUUID() : null
    this.userId = userId;
    this.expirationDate = isDate ? add(new Date(), {hours: 0, minutes: 1}) : null;
    this.isConfirmed = !isDate;
  }

}