import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'confirmationEmailUsers',
})
export class ConfirmationEmailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  expirationDate: Date | null;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  confirmationCode: string | null;

  @Column('uuid')
  userId: string;
}
