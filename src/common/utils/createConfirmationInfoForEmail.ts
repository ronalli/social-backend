import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';


export class ConfirmationInfoEmail {
  userId: string;
  expirationDate: Date;
  isConfirmed: boolean;
  confirmationCode: string;

  constructor(userId: string) {
    this.confirmationCode = randomUUID()
    this.userId = userId;
    this.expirationDate = add(new Date(), {hours: 0, minutes: 1});
    this.isConfirmed = false;
  }

}