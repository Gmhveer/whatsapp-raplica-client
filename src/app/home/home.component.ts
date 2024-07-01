import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  conversation:any;
  constructor() { }

  ngOnInit(): void { }
  onConversationSelected(conversation:any) {
    this.conversation = conversation;
  }
}
