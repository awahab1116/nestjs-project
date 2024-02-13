import socketIOClient, { Socket } from 'socket.io-client';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('SocketService (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let client: Socket;

  beforeEach((done) => {
    client = socketIOClient('http://localhost:4000');
    client.on('connection', done);
  });

  it('should connect', (done) => {
    client.on('connection', (message) => {
      expect(message).toEqual('Successfully connected to server');
      done();
    });
  });
});

// import { Server } from 'socket.io';
// import * as Client from 'socket.io-client';
// import { SocketService } from '../src/gateway/gateway.service';
// import SocketIOClient from 'socket.io-client'; // Replace this import statement

// describe('SocketService (e2e)', () => {
// let server: Server;
// let client: SocketIOClient.Socket;
// let socketService: SocketService;

// beforeAll((done) => {
//     server = new Server();
//     socketService = new SocketService();
//     server.on('connection', socketService.handleConnection);
//     server.listen(3001, done);
// });

// beforeEach((done) => {
//     client = SocketIOClient('http://localhost:3001'); // Update this line
//     client.on('connect', done);
// });

//   it('should connect', (done) => {
//     client.on('connection', (message) => {
//       expect(message).toEqual('Successfully connected to server');
//       done();
//     });
//   });

//   afterEach((done) => {
//     if (client.connected) {
//       client.disconnect();
//     }
//     done();
//   });

//   afterAll(() => {
//     server.close();
//   });
// });
