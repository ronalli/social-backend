import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { BlogsQueryRepository } from '../../features/bloggers-platform/blogs/infrastructure/blogs.query-repository';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(private readonly blogQueryRepository: BlogsQueryRepository) {}
  async transform(value: any) {
    const { title, shortDescription, content, blogId } = value;

    const errors = [];

    if (
      !title ||
      typeof title !== 'string' ||
      title.trim().length < 3 ||
      title.trim().length > 30
    ) {
      errors.push({
        message: `Title must be a string between 3 and 30 characters.`,
        field: 'title',
      });
    }

    if (
      !shortDescription ||
      typeof shortDescription !== 'string' ||
      shortDescription.trim().length < 5 ||
      shortDescription.trim().length > 100
    ) {
      errors.push({
        message: `Short Description must be a string between 5 and 100 characters.`,
        field: 'shortDescription',
      });
    }

    if (
      !content ||
      typeof content !== 'string' ||
      content.trim().length < 5 ||
      content.trim().length > 1000
    ) {
      errors.push({
        message: `Content must be a string between 5 and 1000 characters.`,
        field: 'content',
      });
    }

    if (!blogId || !isValidUUID(blogId)) {
      errors.push({
        message: 'Invalid blogId',
        field: 'blogId',
      });
    } else {
      const foundedBlog = await this.blogQueryRepository.blogIsExist(blogId);

      if (!foundedBlog) {
        errors.push({
          message: `Blog is don't found`,
          field: 'blogId',
        });
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException([...errors]);
    }

    return value;
  }
}
