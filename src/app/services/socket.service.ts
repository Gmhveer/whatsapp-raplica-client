import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SocketService {


  QR: any
  //CREATE CONNECTION TO SERVER SOCKET
  socket = io(environment.SOCKET_ENDPOINT);
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public code$: BehaviorSubject<string> = new BehaviorSubject('');
  public linked$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loader$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public contact_list$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public message_list$: BehaviorSubject<boolean> = new BehaviorSubject(false);



  constructor() {
    this.socket.on('qr', (qr: any) => {
      console.log(qr['qr']);
      
      this.code$.next(qr['qr'])
    });
    this.socket.on('disconnected', (connection: any) => {
      localStorage.removeItem("socketId");
      window.location.reload();
    });
    this.socket.on('linked_device', (linked: any) => {
      console.log('linked_device', linked['loading']);
      this.linked$.next(linked['loading']);
    });

    this.socket.on('loading_screen', (load: any) => {
      console.log('linked_device', load['loading']);
      this.linked$.next(load['loading'])
    });

    this.socket.on('contact_list', (contact_list: any) => {
      console.log(contact_list, 'List');
      this.contact_list$.next(contact_list)
    });

    this.socket.on('message_list', (message_list: any) => {
      console.log(message_list, 'List');
      this.message_list$.next(message_list['message_list']);
    });

  }



  //REQUEST TO FETCH QR CODE OR INICIATE WHATS APP SOCIAT
  getQr() { this.socket.emit('GET_QR', "data"); }
  getQrCode() { return this.code$; }

  //SEND MESSAGE TO SERVER
  public sendMessage(message: any) {
    this.socket.emit('MESSAGE', message);
  }

  //SEND REQUEST TO SERVER FOR CONTACTS
  public getContact() {
    this.socket.emit('CONTACT_LIST', localStorage.getItem("socketId"));
  }

  //REQUEST TO LOGOUT CLIENT SESSION
  public logout() {
    console.log('logout call');
    
    this.socket.emit('LOGOUT', 'logout');
  }
  //GET MESSAGE FROM SERVER
  public getNewMessage = () => {
    this.socket.on('message', (message: any) => { this.message$.next(message); });
    return this.message$.asObservable();
  };

  public getMessagelist = () => {
    this.socket.on('message', (message: any) => { this.message$.next(message); });
    return this.message$.asObservable();
  };
}