import { INestApplication } from '@nestjs/common';
import request from 'supertest';

const APP_PREFIX = '/api';

export const customRequest = (app: INestApplication) => {
  const httpServer = app.getHttpServer();

  return {
    get: (url: string) => request(httpServer).get(`${APP_PREFIX}/${url}`),
    post: (url: string) => request(httpServer).post(`${APP_PREFIX}/${url}`),
    put: (url: string) => request(httpServer).put(`${APP_PREFIX}/${url}`),
    delete: (url: string) => request(httpServer).delete(`${APP_PREFIX}/${url}`),
    patch: (url: string) => request(httpServer).patch(`${APP_PREFIX}/${url}`),
  };
};
