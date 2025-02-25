import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { username: string; content: string }) {
    const message = this.messageRepository.create({
      username: data.username,
      content: data.content,
    });

    await this.messageRepository.save(message);
    this.server.emit('newMessage', message);
    
    return message;
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    const messages = await this.messageRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 50,
    });
    return messages;
  }
}
