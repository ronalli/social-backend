import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../common/exception-filters/http-exception-filter';

export const appSettings = (app: INestApplication) => {
  app.use(cookieParser());
  useContainer(app.select(AppModule), {fallbackOnErrors: true})

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      const errorsForResp = [];
      errors.forEach((err) => {
        const keys = Object.keys(err.constraints);
        keys.forEach((key) => {
          errorsForResp.push({
            message: err.constraints[key],
            field: err.property
          })
        })
      })

      throw new BadRequestException(errorsForResp)
    }
  }));

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter())
}