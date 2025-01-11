import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getAll_Empty', () => {
    it('should return empty list', () => {
      expect(appController.getAll()).toStrictEqual([]);
    });

    it('should return the id of all the tasks', () => {
      appController.postExchange('EUR', 'DIN', 12);
      appController.postExchange('USD', 'PLN', 12);
      expect(appController.getAll().length).toBe(2);
      expect(appController.getAll()).toStrictEqual(["620208", "662688"]);
    });
  });

  describe('post_exchange_good_data', () => {
    it('should return the id of the task', async () => {
      expect(await appController.postExchange('EUR', 'DIN', 12)).toStrictEqual({
        taskId: 620208,
      }); // 620208
      expect(await appController.postExchange('USD', 'PLN', 12)).toStrictEqual({
        taskId: 662688,
      }); // 662688
    });
  });


  describe('getId', () => {
    it('should return nothing', () => {
      expect(appController.getTask(12)).toBeUndefined();
    });

    it('should return specific TaskId', () => {
      appController.postExchange("EUR","DIN",12);
      expect(appController.getTask(620208)).toStrictEqual({"progress": 100, "status": "completed", "taskId": 620208});
    });
  });
});
