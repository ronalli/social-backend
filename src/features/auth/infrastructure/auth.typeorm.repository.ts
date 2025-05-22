import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../users/domain/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthTypeOrmRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

  ) {}

  public async findByLoginOrEmail(loginOrEmail: string) {
    const result = await this.userRepository.findOne({
      where:[
        {login: loginOrEmail},
        {email: loginOrEmail}
      ]
    })

    console.log(result);

    return result;

  }

}