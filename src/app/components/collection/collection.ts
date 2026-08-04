import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product, SupabaseService } from '../../core/services/supabase.service';

interface CollectionProduct extends Product {
  image: string;
}

@Component({
  selector: 'app-collection',
  imports: [],
  templateUrl: './collection.html',
  styleUrl: './collection.scss',
})
export class Collection implements OnInit {
  private readonly fallbackImages = ['sole.jpeg', 'abbraccio.jpeg', 'pomeriggioFiorito.jpeg'];

  products: CollectionProduct[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    this.errorMsg = '';

    try {
      const products = await this.supabase.getProducts();
      this.products = products.map((product, index) => this.toCollectionProduct(product, index));
    } catch (e) {
      console.error(e);
      this.errorMsg = 'Non siamo riusciti a caricare la collezione.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  private toCollectionProduct(product: Product, index: number): CollectionProduct {
    return {
      ...product,
      tag: product.tag?.trim() || undefined,
      price: this.formatPrice(product.price),
      image: product.image_url?.trim() || this.fallbackImages[index % this.fallbackImages.length]
    };
  }

  private formatPrice(price: string): string {
    const trimmedPrice = price.trim();
    return trimmedPrice.startsWith('€') ? trimmedPrice : `€ ${trimmedPrice}`;
  }
}
