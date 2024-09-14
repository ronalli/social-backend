import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsQueryRepository } from './infrastructure/comments.query-repository';
import { PostsModule } from '../posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from '../likes/domain/like.entity';
import { MappingsCommentsService } from './application/mappings/mapping.comments';
import { QueryParamsService } from '../../common/utils/create.default.values';
import { Comment, CommentSchema } from './domain/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentHandler } from './application/usecases/create-comment.usecase';
import { UpdateCommentHandler } from './application/usecases/update-comment.usecase';
import { DeleteCommentHandler } from './application/usecases/delete-comment.usecase';
import { UpdateLikeStatusPostHandler } from '../posts/application/usecases/update-likeStatus.post.usecase';
import { UpdateLikeStatusHandler } from './application/usecases/update-likeStatus.usecase';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CqrsModule, forwardRef( () => PostsModule), MongooseModule.forFeature([{name: Like.name, schema: LikeSchema}]), MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]), AuthModule, UsersModule ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository, MappingsCommentsService, QueryParamsService, CreateCommentHandler, UpdateCommentHandler, DeleteCommentHandler, UpdateLikeStatusPostHandler, UpdateLikeStatusHandler],
  exports: [CommentsService, CommentsRepository]
})

export class CommentsModule {}
