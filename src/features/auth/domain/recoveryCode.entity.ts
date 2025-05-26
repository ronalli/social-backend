import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/domain/user.entity';

@Entity('recoveryCodes')
export class RecoveryCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column('uuid')
  userId: string;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

}