// import {
//   registerDecorator,
//   ValidationArguments,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
// import { Injectable } from '@nestjs/common';
// import { BlogsQueryRepository } from '../../../features/bloggers-platform/blogs/infrastructure/blogs.query-repository';
//
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
//     return `Blog with id ${validationArguments?.value} don't exist`;
//   }
// }
//
// export function BlogIsExist(
//   property?: { message: string },
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [property],
//       validator: BlogIsExistConstraint,
//     });
//   };
// }
