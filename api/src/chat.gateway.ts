import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/ws/socket',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('🟢 Cliente conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('🔴 Cliente desconectado:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('📩 Mensagem recebida:', message);
    this.server.emit('message', message);
  }
}
