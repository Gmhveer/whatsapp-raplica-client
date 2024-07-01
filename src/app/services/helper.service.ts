import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  
  filterAutherName(name:String){
    if(((name).includes('@c.us'))) return (name).replace('@c.us', '');
    if(((name).includes('@g.us'))) return (name).replace('@c.us', '');
    return name;
  }
}
