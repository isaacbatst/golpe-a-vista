import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
    const client = host.switchToWs().getClient<Socket>();
    const message =
      exception instanceof Error ? exception.message : 'Ocorreu um erro';

    client.emit('error', {
      message,
      type: 'EXCEPTION',
    });
  }
}
