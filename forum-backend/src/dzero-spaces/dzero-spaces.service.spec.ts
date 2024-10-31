import { Test, TestingModule } from '@nestjs/testing';
import { DzeroSpacesService } from './dzero-spaces.service';

describe('DzeroSpacesService', () => {
  let service: DzeroSpacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DzeroSpacesService],
    }).compile();

    service = module.get<DzeroSpacesService>(DzeroSpacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
