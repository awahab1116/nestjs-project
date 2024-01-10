import { Test, TestingModule } from '@nestjs/testing';
import { ViewOrderService } from './view-order.service';

describe('ViewOrderService', () => {
  let service: ViewOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewOrderService],
    }).compile();

    service = module.get<ViewOrderService>(ViewOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
