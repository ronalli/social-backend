import {
  Column,
  Entity,
  JoinColumn, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConfirmationEmailEntity } from './confirmation.email.entity';
import { DeviceSessionEntity } from '../../security/domain/device.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10 })
  login: string;

  @Column({ length: 20, unique: true })
  email: string;

  @Column()
  hash: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(
    () => ConfirmationEmailEntity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  confirmation: ConfirmationEmailEntity;

  @OneToMany(() => DeviceSessionEntity, (session) => session.user)
  sessions: DeviceSessionEntity[];
}
