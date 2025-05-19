import { LikeStatus } from '../../domain/like.entity';

export class LikeInfoOutputModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
