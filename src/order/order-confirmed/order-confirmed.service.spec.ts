import { Test, TestingModule } from '@nestjs/testing';
import { OrderConfirmedService } from './order-confirmed.service';

describe('OrderConfirmedService', () => {
  let service: OrderConfirmedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderConfirmedService],
    }).compile();

    service = module.get<OrderConfirmedService>(OrderConfirmedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
