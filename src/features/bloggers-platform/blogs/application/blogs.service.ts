import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { PostUpdateSpecialModel } from '../../posts/api/models/input/update-post.special.blog.model';
import { BlogsTypeOrmRepository } from '../infrastructure/blogs.typeorm.repository';
import { async } from 'rxjs';

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
