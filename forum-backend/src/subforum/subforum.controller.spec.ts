import { Test, TestingModule } from '@nestjs/testing';
import { SubforumController } from './subforum.controller';

describe('SubforumController', () => {
  let controller: SubforumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubforumController],
    }).compile();

    controller = module.get<SubforumController>(SubforumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
