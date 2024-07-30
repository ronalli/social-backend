import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../common/exception-filters/http-exception-filter';

const APP_PREFIX = '/api';

export const applyAppSettings = (app: INestApplication) => {
  useContainer(app.select(AppModule), {fallbackOnErrors: true})

  // setCookie(app);

  setAppPrefix(app)

  setAppPipes(app)

  setAppExceptionsFilters(app)

  // setCors(app)
}


const setAppPipes = (app: INestApplication) => {
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

}

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX);
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};

const setCors = (app: INestApplication) => {
  app.enableCors()
}

const setCookie = (app: INestApplication) => {
  app.use(cookieParser());
}