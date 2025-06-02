import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // console.log('1679',  exception);

    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse = {
        errorsMessages: [],
      };

      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        // @ts-ignore
        responseBody.message.forEach((e) =>
          // @ts-ignore
          errorsResponse.errorsMessages.push(e),
        );
      } else {
        // @ts-ignore
        errorsResponse.errorsMessages.push(responseBody.message);
      }

      response.status(status).send(errorsResponse);
    }

    // else {
    //   response.status(status).json({
    //     statusCode: status,
    //     timestamp: new Date().toISOString(),
    //     path: request.url,
    //   });
    // }

    if (status === HttpStatus.UNAUTHORIZED) {
      response.status(status).json({});
    }

    if (status === HttpStatus.NOT_FOUND) {
      response.status(status).json({});
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({});
    }

    if (status === HttpStatus.FORBIDDEN) {
      response.status(status).json({});
    }

    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      response.status(status).json({});
    }
  }
}
