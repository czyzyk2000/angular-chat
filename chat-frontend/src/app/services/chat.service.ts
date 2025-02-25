import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

export interface Message {
  id?: number;
  username: string;
  content: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io('http://localhost:3001');

  sendMessage(message: Message) {
    this.socket.emit('sendMessage', message);
  }

  getMessages(): Observable<Message> {
    return new Observable((observer) => {
      this.socket.on('newMessage', (message) => {
        observer.next(message);
      });
    });
  }

  loadMessages(): Promise<Message[]> {
    return new Promise((resolve) => {
      this.socket.emit('findAllMessages', {}, (messages: Message[]) => {
        resolve(messages);
      });
    });
  }
}
