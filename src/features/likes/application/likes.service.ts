import { Injectable } from '@nestjs/common';
import { jwtService } from '../../../common/services/jwt.service';
import { LikesQueryRepository } from '../infrastructure/likes.query-repository';

@Injectable()
export class LikesService {
  constructor(private readonly likesQueryRepository: LikesQueryRepository) {}

  async getCurrentLikeStatus(token: string, commentId: string) {
    const currentUserId = await jwtService.getUserIdByToken(token);

    if (!currentUserId) {
      return 'None';
    }
    const currentLikeStatus =
      await this.likesQueryRepository.getCurrentLikeStatusUser(
        currentUserId,
        commentId,
      );

    if (currentLikeStatus.length === 0) {
      return 'None';
    }
    return currentLikeStatus[0].likeStatus;
  }
}
