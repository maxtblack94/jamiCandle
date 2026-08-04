import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

type FormState = 'idle' | 'loading' | 'success' | 'error';

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
  formState: FormState = 'idle';
  errorMsg = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async onSubmit(e: Event) {
    e.preventDefault();
    if (this.formState === 'loading') return;

    this.formState = 'loading';
    this.errorMsg = '';

    try {
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        {
          nome: this.formData.name,
          telefono: '',
          name: this.formData.name,
          email: this.formData.email,
          reply_to: this.formData.email,
          auto: 'Jami Candles',
          note: this.formData.message,
          message: this.formData.message,
          messaggio: this.formData.message,
          to_email: environment.emailjs.toEmail,
        },
        { publicKey: environment.emailjs.publicKey }
      );

      this.formState = 'success';
      this.formData = { name: '', email: '', message: '' };
    } catch (err) {
      console.error('EmailJS send failed', err);
      this.errorMsg = this.getErrorMessage(err);
      this.formState = 'error';
    } finally {
      this.cdr.markForCheck();
    }
  }

  resetForm() {
    this.formState = 'idle';
    this.errorMsg = '';
  }

  private getErrorMessage(err: unknown): string {
    if (typeof err === 'object' && err && 'text' in err && typeof err.text === 'string') {
      return err.text;
    }

    return 'Riprova oppure scrivici direttamente via email o WhatsApp.';
  }
}
