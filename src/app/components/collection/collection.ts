import { Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  notes: string;
  description: string;
  price: string;
  tag?: string;
  bgColor: string;
  image: string;
}

@Component({
  selector: 'app-collection',
  imports: [],
  templateUrl: './collection.html',
  styleUrl: './collection.scss',
})
export class Collection {
  products: Product[] = [
    {
      id: 1,
      name: "Pomeriggio d'Ambra",
      notes: 'Fico maturo · Cedro · Vaniglia',
      description: 'Un profumo avvolgente, come un pomeriggio lento tra libri e luce dorata.',
      price: '€ 35',
      tag: 'Bestseller',
      bgColor: 'linear-gradient(135deg, #e8d5b0, #c9a97c)',
      image: 'sole.jpeg'
    },
    {
      id: 2,
      name: 'Fiore di Lino',
      notes: 'Iris · Cotone · Muschio bianco',
      description: 'Delicato come il mattino, perfetto per i momenti di calma e semplicità.',
      price: '€ 32',
      bgColor: 'linear-gradient(135deg, #e8eaf0, #c5c8d5)',
      image: 'abbraccio.jpeg'
    },
    {
      id: 3,
      name: 'Giardino d\'Estate',
      notes: 'Rosa · Gelsomino · Legno di sandalo',
      description: 'Un bouquet floreale che abbraccia dolcemente, perfetto per i momenti di serenità.',
      price: '€ 38',
      tag: 'Novità',
      bgColor: 'linear-gradient(135deg, #f0dde8, #d4a0b8)',
      image: 'pomeriggioFiorito.jpeg'
    }
  ];
}
