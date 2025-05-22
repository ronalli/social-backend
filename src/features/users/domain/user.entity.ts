import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConfirmationEmailEntity } from './confirmation.email.entity';

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
    (type) => ConfirmationEmailEntity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  confirmation: ConfirmationEmailEntity;
}
