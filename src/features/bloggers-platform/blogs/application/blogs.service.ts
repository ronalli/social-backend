import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogsTypeOrmRepository } from '../infrastructure/blogs.typeorm.repository';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsTypeOrmRepository: BlogsTypeOrmRepository,
  ) {}

  async deleteBlog(blogId: string): Promise<boolean> {
    return await this.blogsTypeOrmRepository.delete(blogId);
  }
}
