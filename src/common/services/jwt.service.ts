import jwt from 'jsonwebtoken';

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