// import { Test, TestingModuleBuilder } from '@nestjs/testing';
// import { applyAppSettings } from '../../src/settings/apply.app.setting';
// import { appSettings } from '../../src/settings/app-settings';
// import { AppModule } from '../../src/app.module';
// import { Connection } from 'mongoose';
// import { getConnectionToken } from '@nestjs/mongoose';
// import { deleteAllData } from './delete-all-data';
// import { BlogsService } from '../../src/features/bloggers-platform/blogs/application/blogs.service';
// import { BlogsTestManager } from './blogs-test-manager';
// import { BlogsServiceMockObject } from '../mock/blogs.service.mock';
//
// export const initBaseSettings = async (
//   providersToOverride: {
//     provider: any;
//     useValue: any;
//   }[] = [],
//   addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
// ) => {
//   console.log('in tests ENV: ', appSettings.env.getEnv());
//   const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
//     imports: [AppModule],
//   })
//
//   providersToOverride.forEach(({provider, useValue}) => {
//     testingModuleBuilder.overrideProvider(provider).useValue(useValue);
//   })
//
//   if (addSettingsToModuleBuilder) {
//     addSettingsToModuleBuilder(testingModuleBuilder);
//   }
//
//   const testingAppModule = await testingModuleBuilder.compile();
//
//   const app = testingAppModule.createNestApplication();
//
//   applyAppSettings(app);
//
//   await app.init();
//
//   const databaseConnection = app.get<Connection>(getConnectionToken());
//   const httpServer = app.getHttpServer();
//   // const blogsTestManger = new BlogsTestManager(app);
//
//   await deleteAllData(databaseConnection);
//
//   return {
//     app,
//     databaseConnection,
//     httpServer,
//     // blogsTestManger,
//   };
// };
