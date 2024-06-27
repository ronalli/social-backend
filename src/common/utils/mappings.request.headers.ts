import { Request } from "express";
import { HeaderSessionModel } from '../models/header.session.model';

export class MappingsRequestHeadersService {
  getHeadersForCreateSession(request: Request): HeaderSessionModel {
    return {
      'deviceName': request.headers['user-agent'] || 'unknown',
      'ip': request.ip || 'unknown',
    }
  }
}