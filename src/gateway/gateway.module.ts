import { Module } from '@nestjs/common';
import { SocketService } from './gateway.service';

@Module({
  providers: [SocketService],
  exports: [SocketService],
})
export class GatewayModule {}
