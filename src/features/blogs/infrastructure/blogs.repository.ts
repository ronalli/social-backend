import {ObjectId} from "mongodb";
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BlogCreateModel } from '../api/models/input/create-blog.input.model';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { ResultCode } from '../../../settings/http.status';
import { Types } from 'mongoose';
import { MappingBlogsService } from '../application/mappings/mapping.blogs';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType, private readonly mappingsBlogsService: MappingBlogsService) {
  }

  async create(blog: BlogDocument) {

    const insertResult = await this.BlogModel.insertMany([blog])

    return insertResult[0].id
  }


  async delete(blogId: string) {

    const foundBlog = await this.BlogModel.findOne({ _id: new ObjectId(blogId) });

    if (!foundBlog) throw new NotFoundException([{ message: 'Not found blog', field: 'blogId' }]);

    try {
      await this.BlogModel.deleteOne({ _id: new ObjectId(blogId) });
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}