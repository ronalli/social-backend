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

// [
//   {
//     id: '6bb3678f-2cf1-45e5-9843-2258e7caee64',
//     likeStatus: 'Like',
//     commentId: '8c185332-b8b6-46fd-ba28-8e5c1cadf65f',
//     createdAt: '2025-02-24T17:20:51.283Z',
//     userId: '6cd899be-f499-4297-91b4-8981a87f3f6d'
//   }
// ]

// []

