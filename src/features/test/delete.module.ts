// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from '../users/domain/user.entity';
// import { DeleteService } from './application/delete.service';
// import { Blog, BlogSchema } from '../bloggers-platform/blogs/domain/blog.entity';
// import { Comment, CommentSchema } from '../bloggers-platform/comments/domain/comment.entity';
// import { Post, PostSchema } from '../bloggers-platform/posts/domain/post.entity';
// import { Like, LikeSchema } from '../likes/domain/like.entity';
// import { DeleteAllCollectionsController } from './api/delete.all.collections.controller';
//
// @Module({
//   imports: [
//     MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
//     MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
//     MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
//     MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
//     MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}]),],
//   controllers: [DeleteAllCollectionsController],
//   providers: [DeleteService],
//   exports: [DeleteService]
// })
//
// export class DeleteModule {}