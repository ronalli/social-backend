import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  transform(value: string): string {

    if(!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestException([{message: 'Invalid id', field: 'id'}])
    }
    return value;
  }
}