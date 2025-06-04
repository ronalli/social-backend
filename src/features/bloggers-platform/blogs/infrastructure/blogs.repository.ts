import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Blog } from '../domain/blog.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogUpdateModel } from '../api/models/input/update-blog.input';
import { PostUpdateSpecialModel } from '../../posts/api/models/input/update-post.special.blog.model';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  // async create(blog: Blog) {
  //   const { id, name, description, websiteUrl, createdAt, isMembership } = blog;
  //
  //   const query = `INSERT INTO public."blogs" (id, "createdAt", description, name, "websiteUrl", "isMembership")
  //                  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
  //
  //   const result = await this.dataSource.query(query, [
  //     id,
  //     createdAt,
  //     description,
  //     name,
  //     websiteUrl,
  //     isMembership,
  //   ]);
  //
  //   return result[0].id;
  // }
  //
  // async updateBlog(blog: BlogUpdateModel) {
  //   const query = `UPDATE public.blogs
  //                  SET name         = $1,
  //                      description  = $2,
  //                      "websiteUrl" = $3
  //                  WHERE id = $4 RETURNING *;`;
  //
  //   const values = [blog.name, blog.description, blog.websiteUrl, blog.blogId];
  //
  //   const response = await this.dataSource.query(query, values);
  //
  //   return response.length === 1;
  // }

  // async delete(blogId: string): Promise<boolean> {
  //   const foundBlog = await this.findBlogById(blogId);
  //
  //   if (!foundBlog)
  //     throw new NotFoundException([
  //       { message: 'Not found blog', field: 'blogId' },
  //     ]);
  //
  //   const query = `DELETE FROM public.blogs WHERE id = $1 RETURNING *;`;
  //
  //   const result = await this.dataSource.query(query, [blogId]);
  //
  //   return result[1] === 1;
  // }

  // async findBlogById(blogId: string) {
  //   const query = `SELECT * FROM public."blogs" WHERE id = $1;`;
  //   const result = await this.dataSource.query(query, [blogId]);
  //   return result[0];
  // }

  // async updatePost(
  //   post: PostUpdateSpecialModel,
  //   blogId: string,
  //   postId: string,
  // ): Promise<boolean> {
  //   const { title, shortDescription, content } = post;
  //
  //   const query = `UPDATE public.posts
  //                  SET title              = $1,
  //                      "shortDescription" = $2,
  //                      content            = $3
  //                  WHERE id = $4
  //                    AND "blogId" = $5 RETURNING *;`;
  //
  //   const result = await this.dataSource.query(query, [
  //     title,
  //     shortDescription,
  //     content,
  //     postId,
  //     blogId,
  //   ]);
  //
  //   return result[1] > 0;
  // }

  /*async deletePost(blogId: string, postId: string): Promise<boolean> {
    const query = `DELETE FROM public.posts WHERE id = $1 AND "blogId" = $2 RETURNING *;`;

    const response = await this.dataSource.query(query, [postId, blogId]);

    return response[1] > 0;
  }*/
}
