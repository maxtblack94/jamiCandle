import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Collection } from '../../components/collection/collection';
import { PromiseBanner } from '../../components/promise-banner/promise-banner';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Hero, Collection, PromiseBanner, Contact, Footer],
  template: `
    <app-navbar />
    <main>
      <app-hero />
      <app-collection />
      <app-promise-banner />
      <app-contact />
    </main>
    <app-footer />
  `
})
export class Home {}
