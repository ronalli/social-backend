import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// @Entity()
// export class EmailConfirmation {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column({ type: String, default: null, length: 100 })
//   confirmationCode: string | null;
//
//   @Column({ type: Date, default: null, length: 50 })
//   expirationDate: Date | null;
//
//   @Column({ type: Boolean, default: false, length: 5 })
//   isConfirmed?: boolean;
// }

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, length: 10 })
  login: string;

  @Column({ type: String, length: 20 })
  email: string;

  @Column({ type: String, length: 100 })
  hash: string;

  @Column({ type: String, length: 100 })
  createdAt: string;

  // @OneToOne(() => EmailConfirmation )
  // @JoinColumn()
  // emailConfirmation: EmailConfirmation
}
