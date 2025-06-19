
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('blogs')
export class Blog {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 15, collation: 'C'})
  name: string;

  @Column({ length: 500})
  description: string;

  @Column({ length: 100})
  websiteUrl: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column()
  isMembership: boolean;

}