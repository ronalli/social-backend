import { Injectable } from '@nestjs/common';
import { jwtService } from '../../../common/services/jwt.service';
import { LikesQueryRepository } from '../infrastructure/likes.query-repository';
import { LikesTypeOrmQueryRepository } from '../infrastructure/likes.typeorm.query-repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly likesTypeOrmQueryRepository: LikesTypeOrmQueryRepository,
  ) {}

  async getCurrentLikeStatus(token: string, commentId: string) {
    const currentUserId = await jwtService.getUserIdByToken(token);

    if (!currentUserId) {
      return 'None';
    }
    const currentLikeStatus =
      await this.likesTypeOrmQueryRepository.getCurrentLikeStatusUser(
        currentUserId,
        commentId,
      );

    if (!!currentLikeStatus) {
      return 'None';
    }
    return currentLikeStatus[0].likeStatus;
  }
}
