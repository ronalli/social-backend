import { Column, Entity } from 'typeorm';

@Entity({
  name: 'oldRefreshTokens',
})
export class OldRefreshTokenEntity {
  @Column('uuid', { primary: true, nullable: false })
  id: string;
  @Column({ nullable: false })
  refreshToken: string;
}
