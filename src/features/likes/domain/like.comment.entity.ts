import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseLikeEntity } from '../api/models/base.like-entity';
import { Post } from '../../bloggers-platform/posts/domain/post.entity';
import { Comment } from '../../bloggers-platform/comments/domain/comment.entity';

@Entity('commentsLikeStatus')
export class CommentLikeStatus extends BaseLikeEntity {

  @ManyToOne(() => Comment, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'commentId' })
  comment?: Comment;

  @Column()
  commentId: string;

}