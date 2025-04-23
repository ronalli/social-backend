import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!isValidUUID(value)) {
      throw new BadRequestException([{ message: 'Invalid id', field: 'id' }]);
    }
    return value;
  }
}
