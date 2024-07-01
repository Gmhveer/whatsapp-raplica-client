import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SocketService } from '../services/socket.service';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { HelperService } from '../services/helper.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  searchText: string = "";
  loader = false;
  storyList: any = [];
  chatList: any = [];
  conversations: any = [];
  contactList: any = [];
  isSelectTab: String = 'status';
  get filteredConversations() {
    return this.conversations.filter((conversation: any) => {
      return (
        conversation?.name
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        conversation?.latestMessage
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    });
  }

  constructor(public socket: SocketService, public hlp: HelperService) {
    this.loader = true;
  }

  ngOnInit(): void {

    this.socket.message_list$.pipe().subscribe((msg: any) => {
      if (msg.eventType == "chat" || msg.eventType == "groupChat") {
        this.filterMessageChat(msg)
      } else if (msg.eventType == 'status') {
        this.filterStory(msg);
      } else {
        console.log(msg);
      }
      this.conversations = this.isSelectTab == 'status' ? this.storyList : this.conversations;
    });

  }


  filterStory(msg: any) {
    //Check if User is already in list
    let findex = this.storyList.findIndex((chat: any) => chat.number == this.hlp.filterAutherName(msg['id']?.participant));
    if (findex != -1) {

      //push Incoming message in existing user msessage list
      this.storyList[findex].latestMessage.msg?.body;
      this.storyList[findex].messages.unshift({ id: this.storyList[findex].messages + 1, body: msg?.body, time: moment(new Date(msg?.timestamp * 1000)).format('LT'), me: true });
      this.loader = false;

    } else {

      //Enter new msessage in conversations
      this.storyList.unshift({
        name: this.hlp.filterAutherName(msg['id']?.participant),
        number: this.hlp.filterAutherName(msg['id']?.participant),
        media: msg.dmedia,
        time: moment(new Date(msg?.timestamp * 1000)).format('L'),
        latestMessage: msg?.body,
        latestMessageRead: true,
        messages: [{ id: 1, body: msg?.body, time: moment(new Date(msg?.timestamp * 1000)).format('LT'), me: true }]
      });
      this.loader = false;
    }
    return this.storyList;
  }

  filterMessageChat(msg: any) {
    //Check if User is already in list
    let findex = this.chatList.findIndex((chat: any) => chat.number == this.hlp.filterAutherName(msg['id']?.remote));
    if (findex != -1) {

      //push Incoming message in existing user msessage list
      this.chatList[findex].latestMessage.msg?.body;
      this.chatList[findex].messages.unshift({ id: this.chatList[findex].messages + 1, body: msg?.body, time: moment(new Date(msg?.timestamp * 1000)).format('LT'), me: true });
      this.loader = false;

    } else {

      //Enter new msessage in conversations
      this.chatList.unshift({
        name: msg._data.notifyName ? msg._data.notifyName : this.hlp.filterAutherName(msg['id'].remote),
        number: this.hlp.filterAutherName(msg['id'].remote),
        media: msg.dmedia,
        time: moment(new Date(msg?.timestamp * 1000)).format('L'),
        latestMessage: msg?.body,
        latestMessageRead: true,
        messages: [{ id: 1, body: msg?.body, time: moment(new Date(msg?.timestamp * 1000)).format('LT'), me: true }]
      });
      this.loader = false;
    }
  }
  getContactList() {
    this.socket.getContact();
  }

  getStatusList() {
    this.isSelectTab = "status";
    this.conversations = this.storyList;
    console.log(this.conversations, "status");

  }
  getMessageList() {
    this.isSelectTab = "chat";
    this.conversations = this.chatList;
    console.log(this.conversations, "Chat");
  }


  onClickMenu(event: string) {

    //Logout account
    if (event == 'logout') {
      localStorage.removeItem('socketId');
      this.setQr();
      this.socket.logout();
      return window.location.reload()
    };
  }

  setQr() { this.socket.getQr(); }

}