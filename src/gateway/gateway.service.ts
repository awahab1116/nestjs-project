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
import { JwtService } from '@nestjs/jwt';
import { UserReqData } from '../interface/user-req-data/user-req-data.interface';

@WebSocketGateway()
@Injectable()
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketService.name);
  private connectedUsers: Map<number, string> = new Map();
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: any, ...args: any[]) {
    const authorizationHeader = client.handshake.headers.authorization;

    if (!authorizationHeader) {
      this.logger.warn('Client disconnected due to missing token');
      client.disconnect(true);
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const payload: UserReqData = await this.jwtService.verifyAsync(token, {
        secret: process.env.TOKEN_SECRET,
      });

      this.connectedUsers.set(payload.id, client.id);
      this.logger.log('New client connected', client.id, payload);
      client.emit('connection', 'Successfully connected to server');
    } catch (error) {
      this.logger.warn('Client disconnected due to invalid token');
      client.disconnect(true);
    }
  }

  handleDisconnect(client: any) {
    const userId = this.getUserIdByClientId(client.id);

    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`Client disconnected ${client.id} for userId ${userId}`);
    } else {
      this.logger.warn(`Unknown client disconnected (${client.id})`);
    }
  }

  private getUserIdByClientId(clientId: string): number | undefined {
    for (const [userId, id] of this.connectedUsers.entries()) {
      if (id === clientId) {
        return userId;
      }
    }
    return undefined;
  }

  @SubscribeMessage('new-message')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.sockets.emit('response-message', {
      response: 'socket server',
    });
  }

  orderStatusMessage(order: Order) {
    const userClientId = this.connectedUsers.get(order.user.id);

    if (userClientId) {
      this.server.to(userClientId).emit('order-status-changed', { order });
    } else {
      this.logger.warn('Client not connected whose status is changed');
    }
  }
}
