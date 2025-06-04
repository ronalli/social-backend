import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LikeStatus } from '../../domain/like.entity';
import { User } from '../../../../common/decorators/validate/user.decorator';
import { UserEntity } from '../../../users/domain/user.entity';

export abstract class BaseLikeEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: LikeStatus,
    default: LikeStatus.None,
  })
  likeStatus: LikeStatus;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

}