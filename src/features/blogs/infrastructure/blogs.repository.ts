import {ObjectId} from "mongodb";
import { Injectable } from '@nestjs/common';
import { BlogCreateModel } from '../api/models/input/create-blog.input.model';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { ResultCode } from '../../../settings/http.status';
import { Types } from 'mongoose';
import { MappingBlogsService } from '../application/mappings/mapping.blogs';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType, private readonly mappingsBlogsService: MappingBlogsService) {
  }

  async create(data: BlogCreateModel){
    try {

      const blog = new this.BlogModel({
        ...data,
        _id: new Types.ObjectId(),
        createdAt: new Date().toISOString(),
        isMembership: false
      });

      const response = await blog.save();

      const foundBlog = await this.BlogModel.findOne({_id: response._id})
      if (foundBlog) {
        return {
          status: ResultCode.Created,
          data: this.mappingsBlogsService.formatingDataForOutputBlog(foundBlog)
        }
      }
      return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
    } catch (e) {

      console.log(e);

      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
    }
  }
  async update(blogId: string, inputUpdateDataBlog: BlogCreateModel){
    const {name, websiteUrl, description} = inputUpdateDataBlog
    try {
      const findBlog = await this.BlogModel.findOne({_id: new ObjectId(blogId)});
      if (findBlog) {

        findBlog.name = name;
        findBlog.description = description;
        findBlog.websiteUrl = websiteUrl;

        await findBlog.save();

        return {status: ResultCode.NotContent, data: null}
      } else {
        return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
      }
    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
    }
  }
  async delete(blogId: string){
    try {
      const foundBlog = await this.BlogModel.findOne({_id: new ObjectId(blogId)});

      if (!foundBlog) {
        return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
      } else {
        await this.BlogModel.deleteOne({_id: new ObjectId(blogId)});
        return {status: ResultCode.NotContent, data: null}
      }
    } catch (e) {
      return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
    }
  }
}