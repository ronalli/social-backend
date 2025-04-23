import { jwtService } from './jwt.service';

export interface IDecodeRefreshToken {
  deviceId: string;
  iat: string;
  userId: string;
  exp: string;
}

export const decodeToken = async (
  token: string,
): Promise<IDecodeRefreshToken | null> => {
  const data = await jwtService.decodeToken(token);

  if (data && typeof data === 'object') {
    return {
      deviceId: data.deviceId,
      iat: new Date(data.iat! * 1000).toISOString(),
      userId: data.userId,
      exp: new Date(data.exp! * 1000).toISOString(),
    };
  }
  return null;
};
