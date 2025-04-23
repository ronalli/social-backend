import { jwtService } from '../services/jwt.service';

export const createRecoveryCode = (email: string, time: string = '5m') =>
  jwtService.createdRecoveryCode(email, time);
