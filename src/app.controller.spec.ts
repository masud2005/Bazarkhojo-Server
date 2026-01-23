import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('root (GET /)', () => {
    it('should return the hello object', () => {
      expect(appController.getHello()).toEqual({
        success: true,
        statusCode: 200,
        message: 'API is running successfully',
      });
    });
  });
});