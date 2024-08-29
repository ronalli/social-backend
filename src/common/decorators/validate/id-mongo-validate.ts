import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';


@ValidatorConstraint({ name: 'IdMongoValidate' })
@Injectable()
export class IdMongoValidateConstraint implements ValidatorConstraintInterface {
  constructor() {}

  async validate(value: any) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return false;
    }
    return value;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Mongo id not validate `;
  }
}

export function IdMongoValidate(
  property?: { message: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IdMongoValidateConstraint,
    });
  };
}