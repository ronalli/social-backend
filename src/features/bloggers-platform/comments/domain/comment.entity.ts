import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/domain/post.entity';
import { UserEntity } from '../../../users/domain/user.entity';

@Entity('commentsPosts')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({length: 300})
  content: string

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post?: Post;

  @Column('uuid')
  postId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

}