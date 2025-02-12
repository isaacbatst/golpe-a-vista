import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/ws/socket',
})
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: AppService) {}

  handleConnection(client: Socket) {
    console.log('🟢 Cliente conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('🔴 Cliente desconectado:', client.id);
  }

  @SubscribeMessage('join')
  handleMessage(
    client: Socket,
    data: { lobbyId: string; userId: string },
  ): void {
    console.log('type of data:', typeof data);
    console.log('📩 Mensagem recebida:', data);
    this.service.connectUser(data.lobbyId, data.userId, client.id);
  }
}
