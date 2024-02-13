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

/**
 * WebSocket gateway service that handles client connections and disconnections,
 * as well as sending and receiving messages.
 */
@WebSocketGateway()
@Injectable()
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketService.name);
  private connectedUsers: Map<number, string> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  /**
   * Handles a new client connection.
   * @param client - The client object representing the connection.
   * @param args - Additional arguments passed to the handler.
   */
  async handleConnection(client: any, ...args: any[]) {
    // Check if the client has provided an authorization token
    const authorizationHeader =
      client.handshake.headers.authorization || client.handshake.auth.token;

    if (!authorizationHeader) {
      this.logger.warn('Client disconnected due to missing token');
      client.disconnect(true);
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      // Verify the token and extract the user data
      const payload: UserReqData = await this.jwtService.verifyAsync(token, {
        secret: process.env.TOKEN_SECRET,
      });

      // Store the user's connection ID
      this.connectedUsers.set(payload.id, client.id);
      this.logger.log('New client connected', client.id, payload);
      client.emit('connection', 'Successfully connected to server');
    } catch (error) {
      this.logger.warn('Client disconnected due to invalid token');
      client.disconnect(true);
    }
  }

  /**
   * Handles a client disconnection.
   * @param client - The client object representing the connection.
   */
  handleDisconnect(client: any) {
    const userId = this.getUserIdByClientId(client.id);

    if (userId) {
      // Remove the user's connection ID
      this.connectedUsers.delete(userId);
      this.logger.log(`Client disconnected ${client.id} for userId ${userId}`);
    } else {
      this.logger.warn(`Unknown client disconnected (${client.id})`);
    }
  }

  /**
   * Retrieves the user ID associated with a client connection ID.
   * @param clientId - The client connection ID.
   * @returns The user ID if found, otherwise undefined.
   */
  private getUserIdByClientId(clientId: string): number | undefined {
    for (const [userId, id] of this.connectedUsers.entries()) {
      if (id === clientId) {
        return userId;
      }
    }
    return undefined;
  }

  /**
   * Handles a new message received from a client.
   * @param body - The message body.
   */
  @SubscribeMessage('new-message')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.sockets.emit('response-message', {
      response: 'socket server',
    });
  }

  /**
   * Sends an order status message to the client associated with the order's user.
   * @param order - The order object.
   */
  orderStatusMessage(order: Order) {
    const userClientId = this.connectedUsers.get(order.user.id);
    this.logger.log(`Connected userId is ${userClientId}`);
    if (userClientId) {
      this.server.to(userClientId).emit('order-status-changed', { order });
    } else {
      this.logger.warn('Client not connected whose status is changed');
    }
  }
}
