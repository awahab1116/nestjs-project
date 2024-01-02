import { Test, TestingModule } from '@nestjs/testing';
import { ViewProductService } from './view-product.service';

describe('ViewProductService', () => {
  let service: ViewProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewProductService],
    }).compile();

    service = module.get<ViewProductService>(ViewProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
