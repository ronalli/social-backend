// import {
//   registerDecorator,
//   ValidationArguments,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
// import { Injectable } from '@nestjs/common';
// import mongoose from 'mongoose';
// import { BlogsQueryRepository } from '../../../features/bloggers-platform/blogs/infrastructure/blogs.query-repository';
//
// @ValidatorConstraint({ name: 'IdMongoValidate' })
// @Injectable()
// export class IdMongoValidateConstraint implements ValidatorConstraintInterface {
//   async validate(value: any) {
//     return mongoose.Types.ObjectId.isValid(value);
//   }
//
//   defaultMessage(validationArguments?: ValidationArguments): string {
//     return `Invalid MongoDB ID`;
//   }
// }
//
// @ValidatorConstraint({ name: 'BlogIsExist', async: true })
// @Injectable()
// export class BlogIsExistConstraint implements ValidatorConstraintInterface {
//   constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
//
//   async validate(value: any) {
//     return await this.blogsQueryRepository.blogIsExist(value);
//   }
//
//   defaultMessage(validationArguments?: ValidationArguments): string {
//     return `Blog with ID ${validationArguments?.value} does not exist`;
//   }
// }
//
// export function IdMongoValidate(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: IdMongoValidateConstraint,
//     });
//   };
// }
//
// export function BlogIsExist(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: BlogIsExistConstraint,
//     });
//   };
// }
