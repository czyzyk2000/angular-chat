import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private socket: Socket;
  private messages: Message[] = [];

  constructor() {
    // Setup socket connection with explicit options
    this.socket = io(`${environment.apiUrl}/api/socket`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // Listen for all messages event
    this.socket.on('allMessages', (messages: Message[]) => {
      console.log('Received all messages:', messages);
      this.messages = messages || [];
    });

    // Listen for new messages
    this.socket.on('newMessage', (message: Message) => {
      console.log('New message received:', message);
      this.messages.push(message);
    });
  }

  sendMessage(message: Message) {
    console.log('Sending message:', message);
    this.socket.emit('sendMessage', message);
  }

  getMessages(): Observable<Message> {
    return new Observable((observer) => {
      // Initial emit of all messages
      if (this.messages.length > 0) {
        this.messages.forEach(message => observer.next(message));
      }

      // Subscribe to new messages
      const newMessageHandler = (message: Message) => {
        observer.next(message);
      };
      
      this.socket.on('newMessage', newMessageHandler);

      return () => {
        this.socket.off('newMessage', newMessageHandler);
      };
    });
  }

  loadMessages(): Promise<Message[]> {
    return new Promise((resolve) => {
      // If we already have messages, return them
      if (this.messages.length > 0) {
        console.log('Returning cached messages:', this.messages);
        resolve([...this.messages]);
        return;
      }

      // Create a one-time handler for allMessages
      const messageHandler = (messages: Message[]) => {
        console.log('Loaded messages from allMessages event:', messages);
        this.messages = messages || [];
        resolve([...this.messages]);
      };

      // Listen for the allMessages event once
      this.socket.once('allMessages', messageHandler);

      // Emit the findAllMessages event to request messages
      console.log('Requesting all messages');
      this.socket.emit('findAllMessages');

      // Set a timeout in case we don't get a response
      setTimeout(() => {
        // Remove the listener if it hasn't fired
        this.socket.off('allMessages', messageHandler);
        console.log('Timeout waiting for messages');
        resolve([...this.messages]);
      }, 5000);
    });
  }
}
