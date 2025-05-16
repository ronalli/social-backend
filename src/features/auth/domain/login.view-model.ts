import { ApiProperty } from '@nestjs/swagger';

export class LoginViewModel {
  @ApiProperty()
  accessToken: string;

}
