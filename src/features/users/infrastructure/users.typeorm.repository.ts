import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { ConfirmationEmailEntity } from '../domain/confirmation.email.entity';
import { ConfirmationInfoEmail } from '../../../common/utils/createConfirmationInfoForEmail';

@Injectable()
export class UsersTypeOrmRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ConfirmationEmailEntity)
    private readonly confirmationEmailRepository: Repository<ConfirmationEmailEntity>,
  ) {}

  public async create(
    id: string,
    login: string,
    email: string,
    hash: string,
    createdAt: Date,
    confirmation: ConfirmationInfoEmail,
  ) {
    const user = this.userRepository.create({
      id,
      login,
      email,
      hash,
      createdAt,
    });

    await this.userRepository.save(user);

    const emailConfirmation = this.confirmationEmailRepository.create({
      userId: confirmation.userId,
      isConfirmed: confirmation.isConfirmed,
      expirationDate: confirmation.expirationDate,
      confirmationCode: confirmation.confirmationCode,
    });

    await this.confirmationEmailRepository.save(emailConfirmation);

    return user.id;
  }

  public async delete(id: string) {
    const user = await this.findUserById(id);

    const deletedUser = await this.userRepository.remove(user);

    return !!deletedUser;
  }

  public async findUserById(id: string) {
    // const user = await this.userRepository.findOne({
    //   where: { id },
    //   // relations: ['confirmation'],
    // });

    const user = await this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.login', 'u.email', 'u.createdAt'])
      .where('u.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
