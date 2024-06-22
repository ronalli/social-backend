import { BlogCreateModel } from '../api/models/input/create-blog.input.model';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor( private readonly blogsRepository: BlogsRepository) {
  }

  async createBlog(blog: BlogCreateModel) {
    return await this.blogsRepository.create(blog)
  }
  async updateBlog(blogId: string, inputUpdateBlog: BlogCreateModel){
    return await this.blogsRepository.update(blogId, inputUpdateBlog);
  }
  async deleteBlog(blogId: string){
    return await this.blogsRepository.delete(blogId);
  }
}
