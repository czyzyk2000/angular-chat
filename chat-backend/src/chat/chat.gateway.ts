import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
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
    console.log('Received message:', data);
    try {
      const message = await this.prisma.message.create({
        data: {
          username: data.username,
          content: data.content,
        },
      });
      
      console.log('Created message:', message);
      this.server.emit('newMessage', message);
      
      return message;
    } catch (error) {
      console.error('Error creating message:', error);
      return { error: 'Failed to create message' };
    }
  }

  @SubscribeMessage('findAllMessages')
  async findAll(@ConnectedSocket() client: Socket) {
    console.log('Finding all messages');
    try {
      const messages = await this.prisma.message.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        take: 50,
      });
      
      console.log(`Found ${messages.length} messages`);
      client.emit('allMessages', messages);
      return messages;
    } catch (error) {
      console.error('Error finding messages:', error);
      return [];
    }
  }
}
