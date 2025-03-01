import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/api/socket',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private prisma: PrismaService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { username: string; content: string }) {
    const message = await this.prisma.message.create({
      data: {
        username: data.username,
        content: data.content,
      },
    });

    this.server.emit('newMessage', message);
    
    return message;
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    const messages = await this.prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
    return messages;
  }
}
