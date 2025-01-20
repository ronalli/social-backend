// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { ObjectId } from 'mongodb';
// import { InjectModel } from '@nestjs/mongoose';
// import { Post, PostModelType } from '../../domain/post.entity';
// import { InternalServerErrorException } from '@nestjs/common';
// import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
//
// export class UpdatePostCommand {
//   constructor(
//     public id: string,
//     public content: string,
//     public blogId: string,
//     public shortDescription: string,
//     public title: string,
//   ) {
//   }
// }
//
//
// @CommandHandler(UpdatePostCommand)
// export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
//   constructor(
//     @InjectModel(Post.name) private PostModel: PostModelType,
//     private readonly blogsQueryRepository: BlogsQueryRepository
//   ) {
//   }
//
//   async execute(command: UpdatePostCommand): Promise<boolean> {
//     const {id, content, blogId, shortDescription, title} = command;
//
//     try {
//       const findPost = await this.PostModel.findOne({_id: new ObjectId(id)});
//       const findBlog = await this.blogsQueryRepository.findBlogById(blogId)
//
//       // console.log(findBlog);
//
//       if (findPost && findBlog) {
//
//         findPost.title = title;
//         findPost.content = content;
//         findPost.shortDescription = shortDescription;
//         findPost.blogId = blogId;
//
//         await findPost.save();
//
//         return true;
//       }
//       else {
//         return false;
//       }
//     } catch (e) {
//       throw new InternalServerErrorException(e)
//     }
//   }
// }