import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { Order } from '../entity/order.entity';

@WebSocketGateway()
@Injectable()
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketService.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    this.logger.log('New client connected ', client.id);
    client.emit('connection', 'Successfully connected to server ');
  }
  handleDisconnect(client: any) {
    this.logger.log('Client disconnected ', client.id);
  }

  @SubscribeMessage('new-message')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.sockets.emit('response-message', {
      response: 'socket server',
    });
  }

  orderStatusMessage(order: Order) {
    this.server.sockets.emit('order-status-changed', { order });
  }
}
