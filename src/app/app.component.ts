import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public socket: SocketService) {
    if (localStorage.getItem("socketId")) this.connected = true;
  }
  qrCode: any;
  loader: any = false;
  connected = false;
  defaultImage = '../assets/images/qr-code.png';

  ngOnInit(): void {
    this.socket.getQr();
    //Check if device already connected
    if (!localStorage.getItem("socketId")) {
      this.loader = true;

      //Set QR code Observalble
      this.socket.code$.subscribe((value: any) => {
        this.qrCode = value;
        this.qrCode ? this.loader = false : this.loader = true;
        console.log(this.qrCode, 'Qr code___');
      });

      //Check App Linking code Observalble
      this.socket.linked$.subscribe((value: any) => {
console.log(value,this.connected);

        if (this.connected == false && value == 'start') this.loader = true;
        if (value == "end") {
          this.loader = false;
          // localStorage.setItem("socketId", this.socket?.socket?.id);
          this.connected = value;
        }
      });
    }
  }

  ngAfterViewInit(): void { }
  setQr() { this.socket.getQr(); }
}
