import jwt from "jsonwebtoken";
import { LikeModelType } from '../features/likes/domain/like.entity';

export const serviceInfo = {

  async initializeStatusLike(token: string, parentId: string, LikeModel: LikeModelType) {
    const currentAccount = await decodeToken(token)

    if(!currentAccount) {
      return 'None'
    }

    const response = await LikeModel.findOne(({
      $and: [{userId: currentAccount.userId}, {parentId:  parentId}]
    }))

    if(!response) {
      return 'None'
    }

    return response.status
  },

  async getIdUserByToken(token: string | undefined): Promise<string> {
    if(!token) {
      return 'None'
    }
    return jwtService.getUserIdByToken(token)
  }
}


interface IJWTToken {
  userId: string,
  deviceId: string
}



export const jwtService = {
  createdJWT: async (data: IJWTToken, time: string) => {
    return jwt.sign({...data}, process.env.SECRET_PASSWORD!, {expiresIn: time})
  },
  getUserIdByToken: async (token: string) => {
    try {
      const result: any = jwt.verify(token, process.env.SECRET_PASSWORD!);
      return result.userId
    } catch (e) {
      return null
    }
  },
  decodeToken: async (token: string) => {
    return jwt.decode(token)
  },

  createdRecoveryCode: async (email: string, time: string) => {
    return jwt.sign({email}, process.env.SECRET_PASSWORD!, {expiresIn: time})
  },

  getEmailByToken: async (token: string) => {
    try {
      const result: any = jwt.verify(token, process.env.SECRET_PASSWORD!);
      return result.email

    } catch (e) {
      return null
    }
  }
}

export interface IDecodeRefreshToken {
  deviceId: string,
  iat: string,
  userId: string,
  exp: string,
}

export const decodeToken = async (token: string): Promise<IDecodeRefreshToken | null> => {
  const data = await jwtService.decodeToken(token);

  if(data && typeof data === 'object') {
    return {
      deviceId: data.deviceId,
      iat: new Date(data.iat! * 1000).toISOString(),
      userId: data.userId,
      exp: new Date(data.exp! * 1000).toISOString(),
    }
  }
  return null;
}