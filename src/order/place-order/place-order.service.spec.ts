import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOrderService } from './place-order.service';

describe('PlaceOrderService', () => {
  let service: PlaceOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceOrderService],
    }).compile();

    service = module.get<PlaceOrderService>(PlaceOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
