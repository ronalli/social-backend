import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply.app.setting';
import { appSettings } from './settings/app-settings';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('Social API')
    .setDescription('Social Backend API')
    .setVersion('1.0')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  applyAppSettings(app);

  await app.listen(appSettings.api.APP_PORT ?? 3000);

  console.log(`Server running on ${await app.getUrl()}`);
}

bootstrap();
