import { LikeModelType } from '../../features/likes/domain/like.entity';
import { decodeToken } from './decode.token';
import { jwtService } from './jwt.service';

export const serviceInfoLike = {
  async getIdUserByToken(token: string | undefined): Promise<string> {
    if (!token) {
      return 'None';
    }
    return jwtService.getUserIdByToken(token);
  },

  // async initializeStatusLike(
  //   token: string,
  //   parentId: string,
  //   LikeModel: LikeModelType,
  // ) {
  //   const currentAccount = await decodeToken(token);
  //
  //   if (!currentAccount) {
  //     return 'None';
  //   }
  //
  //   const response = await LikeModel.findOne({
  //     $and: [{ userId: currentAccount.userId }, { parentId: parentId }],
  //   });
  //
  //   if (!response) {
  //     return 'None';
  //   }
  //   return response.status;
  // },
};
