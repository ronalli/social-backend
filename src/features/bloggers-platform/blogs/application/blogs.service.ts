import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { PostUpdateSpecialModel } from '../../posts/api/models/input/update-post.special.blog.model';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async deleteBlog(blogId: string) {
    return await this.blogsRepository.delete(blogId);
  }

  async updatePostBySpecialBlog(
    post: PostUpdateSpecialModel,
    blogId: string,
    postId: string,
  ) {
    return await this.blogsRepository.updatePost(post, blogId, postId);
  }

  async deletePostBySpecialBlog(blogId: string, postId: string) {
    return await this.blogsRepository.deletePost(blogId, postId);
  }
}
