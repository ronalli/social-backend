import { jwtService } from './jwt.service';

export interface IDecodeRefreshToken {
  deviceId: string;
  iat: Date;
  userId: string;
  exp: Date;
}

export const decodeToken = async (
  token: string,
): Promise<IDecodeRefreshToken | null> => {
  const data = await jwtService.decodeToken(token);

  console.log('data', data);

  if (data && typeof data === 'object') {
    return {
      deviceId: data.deviceId,
      iat: new Date(data.iat! * 1000),
      userId: data.userId,
      exp: new Date(data.exp! * 1000),
    };
  }
  return null;
};
