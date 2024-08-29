import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { BlogsQueryRepository } from '../../features/blogs/infrastructure/blogs.query-repository';
import mongoose from 'mongoose';
import { PostsQueryRepository } from '../../features/posts/infrastructure/posts.query-repository';

@Injectable()
export class PostIdValidationPipe implements PipeTransform {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async transform(value: any, metadata: ArgumentMetadata) {

    const errors = [];

    if(!mongoose.Types.ObjectId.isValid(value)) {
      errors.push({
        message: `Invalid post id`,
        field: metadata.data
      })
    } else {

      const postExist = await this.postsQueryRepository.getPostById(value)

      if(!postExist) {
        errors.push({
          message: `Post with id ${value} not found`,
          field: metadata.data
        })
      }
    }

    if(errors.length > 0) {
      throw new BadRequestException(errors)
    }

    return value;

  }

}
