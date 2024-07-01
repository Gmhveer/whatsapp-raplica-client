import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() conversation: any;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  emojiPickerVisible: any;
  message = '';
  newMessage: any;
  constructor(public socket: SocketService) { }

  ngOnInit(): void { }

  submitMessage(event: any) {
    let value = event.target.value.trim();
    this.message = '';
    this.sendMessage(this.message)
    if (value.length < 1) return false;
    this.conversation.latestMessage = value;
    this.conversation.messages.unshift({ id: 1, body: value, time: '10:21', me: true });
    return true;

  }

  emojiClicked(event: any) {
    this.message += event.emoji.native;
  }

  sendMessage(msg: any) {
    this.socket.sendMessage(msg);
    this.message = '';
  }

  onConversationSelected(conversation: any) {
    this.conversation = conversation;
  }

}
