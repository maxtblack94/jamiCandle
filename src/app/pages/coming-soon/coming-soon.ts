import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {
  email = environment.contact.email;
  get emailLink() { return `mailto:${this.email}`; }
  get whatsappLink() {
    const msg = encodeURIComponent('Ciao! Sono interessato/a alle vostre candele 🕯️');
    return `https://wa.me/${environment.contact.whatsapp.replace('+', '')}?text=${msg}`;
  }
}
