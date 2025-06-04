import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseLikeEntity } from '../api/models/base.like-entity';
import { Post } from '../../bloggers-platform/posts/domain/post.entity';

@Entity('postsLikeStatus')
export class PostLikeStatus extends BaseLikeEntity {

  @ManyToOne(() => Post, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'postId' })
  post?: Post;

  @Column()
  postId: string;

}