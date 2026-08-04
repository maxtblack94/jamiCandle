import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  email = environment.contact.email;
  whatsappName = environment.contact.whatsappName;

  get emailLink() { return `mailto:${this.email}`; }
  get whatsappLink() {
    const msg = encodeURIComponent('Ciao! Sono interessato/a alle vostre candele 🕯️');
    return `https://wa.me/${environment.contact.whatsapp.replace('+', '')}?text=${msg}`;
  }

  formData = { name: '', email: '', message: '' };
  submitted = false;

  onSubmit(e: Event) {
    e.preventDefault();
    // Qui si integrerà il backend/email service
    this.submitted = true;
    setTimeout(() => {
      this.submitted = false;
      this.formData = { name: '', email: '', message: '' };
    }, 5000);
  }
}
