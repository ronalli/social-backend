import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../users/domain/user.entity';
import { Repository } from 'typeorm';
import { RecoveryCodeEntity } from '../domain/recoveryCode.entity';
import { OldRefreshTokenEntity } from '../domain/refreshToken.entity';
import { randomUUID } from 'node:crypto';
import { ConfirmationEmailEntity } from '../../users/domain/confirmation.email.entity';

@Injectable()
export class AuthTypeOrmRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RecoveryCodeEntity)
    private readonly recoveryCodeRepository: Repository<RecoveryCodeEntity>,
    @InjectRepository(OldRefreshTokenEntity)
    private readonly oldRefreshTokenRepository: Repository<OldRefreshTokenEntity>,
    @InjectRepository(ConfirmationEmailEntity)
    private readonly confirmationEmailRepository: Repository<ConfirmationEmailEntity>,
  ) {}

  public async findByLoginOrEmail(loginOrEmail: string) {
    return await this.userRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  public async createRecoveryCode(userId: string, code: string) {
    const recoveryCode = this.recoveryCodeRepository.create({
      userId,
      code,
    });

    await this.recoveryCodeRepository.save(recoveryCode);
  }

  public async updatePasswordByUserEmail(email: string, hash: string) {
    return await this.userRepository.update({ email: email }, { hash: hash });
  }

  public async addOverdueRefreshToken(refreshToken: string) {
    const id = randomUUID();

    const tokenEntity = this.oldRefreshTokenRepository.create({
      id,
      refreshToken,
    });

    await this.oldRefreshTokenRepository.save(tokenEntity);

    return;
  }

  public async updateConfirmationInfo(
    isConfirmed: boolean,
    expirationDate: null,
    confirmationCode: null,
    userId: string,
  ) {
    const result = await this.confirmationEmailRepository.update(
      {
        userId: userId,
      },
      {
        isConfirmed: isConfirmed,
        expirationDate: expirationDate,
        confirmationCode: confirmationCode,
      },
    );

    if (result.affected === 1) {
      return true;
    }

    throw new BadRequestException([
      { message: 'Something went wrong', field: 'code/email' },
    ]);
  }
}
