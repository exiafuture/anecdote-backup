import { Test, TestingModule } from '@nestjs/testing';
import { SubforumService } from './subforum.service';

describe('SubforumService', () => {
  let service: SubforumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubforumService],
    }).compile();

    service = module.get<SubforumService>(SubforumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
