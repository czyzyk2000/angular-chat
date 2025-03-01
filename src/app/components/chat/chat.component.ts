import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ChatService, Message } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div class="chat-container">
      <!-- Login Screen -->
      <div class="login-screen" *ngIf="!username">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Welcome to Chat</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline">
              <mat-label>Enter your username</mat-label>
              <input matInput 
                     [(ngModel)]="tempUsername" 
                     placeholder="Username"
                     (keyup.enter)="setUsername()">
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button 
                    color="primary" 
                    (click)="setUsername()"
                    [disabled]="!tempUsername.trim()">
              Start Chatting
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Chat Screen -->
      <mat-card class="chat-screen" *ngIf="username">
        <mat-card-header>
          <mat-card-title>
            <div class="chat-header">
              <mat-icon>chat</mat-icon>
              <span>Live Chat</span>
              <span class="username">{{ username }}</span>
            </div>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="messages" #messageContainer>
            <div *ngFor="let message of messages" 
                 class="message-wrapper"
                 [ngClass]="{'own-message': message.username === username}">
              <div class="message-info" [ngClass]="{'own-message-info': message.username === username}">
                <span class="message-username">{{ message.username }}</span>
                <span class="message-time">{{ formatTime(message.createdAt) }}</span>
              </div>
              <div class="message-bubble" [ngClass]="{'own-bubble': message.username === username}">
                {{ message.content }}
              </div>
            </div>
            <!-- Spacer div to prevent overlap -->
            <div class="message-spacer"></div>
          </div>
        </mat-card-content>

        <div class="message-input-container">
          <div class="message-input-wrapper">
            <button mat-icon-button 
                    [matMenuTriggerFor]="emojiMenu" 
                    class="emoji-button">
              <mat-icon>sentiment_satisfied_alt</mat-icon>
            </button>
            <mat-form-field appearance="outline" floatLabel="always">
              <input matInput 
                     [(ngModel)]="newMessage" 
                     (keyup.enter)="sendMessage()"
                     placeholder="Type your message here..."
                     #messageInput>
            </mat-form-field>
            <button mat-mini-fab 
                    color="primary" 
                    (click)="sendMessage()"
                    [disabled]="!newMessage.trim()"
                    class="send-button">
              <mat-icon>send</mat-icon>
            </button>
          </div>
        </div>

        <!-- Emoji Menu -->
        <mat-menu #emojiMenu="matMenu" class="emoji-menu">
          <div class="emoji-grid" (click)="$event.stopPropagation()">
            <button mat-button 
                    *ngFor="let emoji of emojis" 
                    (click)="addEmoji(emoji)"
                    class="emoji-button">
              {{ emoji }}
            </button>
          </div>
        </mat-menu>
      </mat-card>
    </div>
  `,
  styles: [`
    .chat-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      padding: 0;
    }

    .login-screen {
      width: 100%;
      max-width: 400px;

      mat-card {
        padding: 2rem;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      mat-card-header {
        justify-content: center;
        margin-bottom: 2rem;
      }

      mat-card-title {
        font-size: 1.5rem;
        color: #1976d2;
      }

      mat-form-field {
        width: 100%;
      }

      mat-card-actions {
        justify-content: center;
        padding: 1rem 0;
      }

      button {
        width: 200px;
        height: 45px;
        font-size: 1.1rem;
      }
    }

    .chat-screen {
      width: 100%;
      max-width: 800px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #fff;
      overflow: hidden;
      position: relative;
      box-shadow: none;
      border-radius: 0;

      mat-card-header {
        padding: 16px;
        background: #fff;
        border-bottom: 1px solid #e4e4e4;
        z-index: 2;
      }

      mat-card-content {
        flex: 1;
        overflow: hidden;
        padding: 0;
        position: relative;
      }
    }

    .messages {
      height: calc(100% - 20px);
      overflow-y: auto;
      padding: 16px;
      padding-bottom: 120px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
    }

    .message-spacer {
      height: 100px;
      min-height: 100px;
      flex-shrink: 0;
    }

    .message-input-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      padding: 12px 16px;
      background: #fff;
      border-top: 1px solid #e4e4e4;
      z-index: 10;
      margin-top: auto;
      box-shadow: none;
    }

    .message-input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f0f2f5;
      border-radius: 20px;
      padding: 6px 8px;
      margin: 0 auto;
      max-width: 768px;

      .emoji-button {
        min-width: 32px;
        width: 32px;
        height: 32px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &:hover {
          background: transparent;
          color: #1877f2;
        }
      }

      mat-form-field {
        flex: 1;
        margin: 0;
        
        ::ng-deep {
          .mat-mdc-form-field-subscript-wrapper {
            display: none;
          }

          .mat-mdc-form-field-infix {
            padding: 0;
            min-height: unset;
          }

          .mat-mdc-text-field-wrapper {
            padding: 0;
            background: transparent;
          }

          .mat-mdc-form-field-flex {
            padding: 0;
            background: transparent;
            min-height: unset;
            height: 32px;
            align-items: center;
          }

          .mdc-notched-outline {
            display: none;
          }

          input.mat-mdc-input-element {
            margin: 0;
            padding: 0 8px;
            height: 32px;
            line-height: 32px;
            font-size: 0.9375rem;
            color: #050505;
          }
        }
      }

      .send-button {
        min-width: 32px;
        width: 32px;
        height: 32px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: #0084ff;
        transition: all 0.2s ease;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          margin: 0;
        }

        &:not([disabled]):hover {
          background: rgba(0, 132, 255, 0.1);
          transform: none;
        }

        &[disabled] {
          color: #bcc0c4;
          background: transparent;
        }
      }
    }

    .message-wrapper {
      display: flex;
      flex-direction: column;
      max-width: 70%;
      
      &.own-message {
        align-self: flex-end;
        align-items: flex-end;
      }
    }

    .message-info {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
      padding: 0 10px;
      
      &.own-message-info {
        flex-direction: row-reverse;
      }
    }

    .message-username {
      font-size: 0.8rem;
      color: #666;
    }

    .message-time {
      font-size: 0.7rem;
      color: #999;
    }

    .message-bubble {
      padding: 8px 12px;
      background: #f0f2f5;
      border-radius: 18px;
      position: relative;
      word-wrap: break-word;
      font-size: 0.9375rem;
      line-height: 1.3333;
      
      &.own-bubble {
        background: #0084ff;
        color: white;
      }
    }

    /* Custom scrollbar */
    .messages::-webkit-scrollbar {
      width: 6px;
    }

    .messages::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .messages::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    .messages::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .emoji-menu {
      max-width: none !important;
    }

    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
      padding: 8px;
      width: 320px;

      .emoji-button {
        min-width: 0;
        padding: 8px;
        line-height: 1;
        font-size: 1.5em;

        &:hover {
          background: rgba(0, 0, 0, 0.04);
        }
      }
    }

    ::ng-deep .mat-mdc-menu-panel.emoji-menu {
      max-width: none !important;
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  
  messages: Message[] = [];
  newMessage: string = '';
  username: string = '';
  tempUsername: string = '';

  // Common emojis array
  emojis: string[] = [
    '😊', '😂', '🥰', '😍', '😒', '😭', '😩', '🥺',
    '😤', '😡', '🤔', '🤗', '😴', '🤢', '😷', '🤠',
    '👍', '👎', '👌', '✌️', '🤞', '👊', '🤝', '👋',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '😅', '😆', '😉', '😋', '😎', '😢', '😪', '😫',
    '🤣', '😇', '🙂', '🙃', '😘', '😚', '😜', '😝'
  ];

  constructor(private chatService: ChatService) {}

  async ngOnInit() {
    this.messages = await this.chatService.loadMessages();
    this.chatService.getMessages().subscribe((message: Message) => {
      this.messages.push(message);
      this.scrollToBottom();
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = 
        this.messageContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  setUsername() {
    if (this.tempUsername.trim()) {
      this.username = this.tempUsername;
      this.tempUsername = '';
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && this.username) {
      this.chatService.sendMessage({
        username: this.username,
        content: this.newMessage
      });
      this.newMessage = '';
    }
  }

  formatTime(date: Date | undefined): string {
    if (!date) return '';
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  addEmoji(emoji: string) {
    this.newMessage += emoji;
    // Focus back on the input after adding emoji
    this.messageInput.nativeElement.focus();
  }
}
