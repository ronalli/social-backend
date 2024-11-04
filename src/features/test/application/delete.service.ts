// import { InjectModel } from '@nestjs/mongoose';
// import { Injectable } from '@nestjs/common';
// import { User, UserModelType } from '../../users/domain/user.entity';
// import { Post, PostModelType } from '../../bloggers-platform/posts/domain/post.entity';
// import { Blog, BlogModelType } from '../../bloggers-platform/blogs/domain/blog.entity';
// import { Comment, CommentModelType } from '../../bloggers-platform/comments/domain/comment.entity';
//
// @Injectable()
// export class DeleteService {
//   constructor(
//     @InjectModel(User.name) private UserModel: UserModelType,
//     @InjectModel(Post.name) private PostModel: PostModelType,
//     @InjectModel(Blog.name) private BlogModel: BlogModelType,
//     @InjectModel(Comment.name) private CommentModel: CommentModelType,
//
//   ) {
//   }
//
//   async deleteAll() {
//    try {
//      await Promise.all([
//        this.UserModel.deleteMany({}),
//        this.BlogModel.deleteMany({}),
//        this.PostModel.deleteMany({}),
//        this.CommentModel.deleteMany({})
//      ])
//    } catch (e) {
//      throw new Error(`Failed to delete all data ${e}`)
//    }
//   }
// }