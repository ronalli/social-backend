import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../common/decorators/validate/user.decorator';
import { UserEntity } from '../../users/domain/user.entity';

@Entity('deviceSessions')
export class DeviceSessionEntity {

  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @Column('uuid')
  @IsString()
  deviceId: string;

  @Column()
  @IsString()
  deviceName: string;

  @Column({
    type: 'timestamp with time zone',
  })
  @IsString()
  exp: Date;

  @Column({
    type: 'timestamp with time zone',
  })
  @IsString()
  iat: Date;

  @Column()
  @IsString()
  ip: string;

  @Column('uuid')
  userId: string;

  @ManyToOne((type) => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
