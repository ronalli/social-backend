// import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
// import mongoose from 'mongoose';
// import { BlogsQueryRepository } from '../../features/bloggers-platform/blogs/infrastructure/blogs.query-repository';
//
// @Injectable()
// export class BlogIdValidationPipe implements PipeTransform {
//   constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
//
//   async transform(value: any, metadata: ArgumentMetadata) {
//
//     const errors = [];
//
//     if(!mongoose.Types.ObjectId.isValid(value)) {
//       errors.push({
//         message: `Invalid blog id`,
//         field: metadata.data
//       })
//     } else {
//
//       const blogsExist = await this.blogsQueryRepository.findBlogById(value)
//
//       if(!blogsExist) {
//         errors.push({
//           message: `Blog with id ${value} not found`,
//           field: metadata.data
//         })
//       }
//     }
//
//     if(errors.length > 0) {
//       throw new BadRequestException(errors)
//     }
//
//     return value;
//
//   }
//
// }
