import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhatsappFab } from './components/whatsapp-fab/whatsapp-fab';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WhatsappFab],
  template: `
    <router-outlet />
    <app-whatsapp-fab />
  `,
  styleUrl: './app.scss'
})
export class App {}
