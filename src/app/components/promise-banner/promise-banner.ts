import { Component } from '@angular/core';

@Component({
  selector: 'app-promise-banner',
  imports: [],
  templateUrl: './promise-banner.html',
  styleUrl: './promise-banner.scss',
})
export class PromiseBanner {
  pillars = [
    { icon: '🌿', title: 'Cera naturale', text: 'Solo cere vegetali, senza paraffina.' },
    { icon: '🧵', title: 'Stoppino in cotone', text: 'Combustione pulita e silenziosa.' },
    { icon: '🌸', title: 'Essenze pure', text: 'Fragranze selezionate e sicure.' },
    { icon: '♻️', title: 'Contenitori riusabili', text: 'Il barattolo è tuo, da subito.' }
  ];
}
