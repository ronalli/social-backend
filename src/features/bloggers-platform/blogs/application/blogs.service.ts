import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor( private readonly blogsRepository: BlogsRepository) {
  }
  async deleteBlog(blogId: string){
    // return await this.blogsRepository.delete(blogId);
  }
}
