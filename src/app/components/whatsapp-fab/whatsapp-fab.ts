import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-whatsapp-fab',
  imports: [],
  templateUrl: './whatsapp-fab.html',
  styleUrl: './whatsapp-fab.scss',
})
export class WhatsappFab {
  get whatsappLink() {
    const msg = encodeURIComponent('Ciao! Sono interessato/a alle vostre candele 🕯️');
    return `https://wa.me/${environment.contact.whatsapp.replace('+', '')}?text=${msg}`;
  }
}

