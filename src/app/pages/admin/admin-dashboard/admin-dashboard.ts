import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService, Product } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  activeTab: 'products' | 'images' = 'products';

  // Prodotti
  products: Product[]    = [];
  productsLoading        = false;

  // Immagini
  images: { name: string; url: string }[] = [];
  imagesLoading = false;

  // Form prodotto
  showProductForm   = false;
  editingProduct?: Product;
  productForm: Product = this.emptyForm();
  formSaving        = false;
  formError         = '';
  uploadingProductImg = false;

  // Conferma eliminazione
  confirmMsg    = '';
  private confirmFn?: () => Promise<void>;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadImages();
  }

  // ─── Prodotti ─────────────────────────────────────────────────────────────

  async loadProducts() {
    this.productsLoading = true;
    try { this.products = await this.supabase.getProducts(); }
    catch (e: any) { console.error(e); }
    finally {
      this.productsLoading = false;
      this.cdr.markForCheck();
    }
  }

  openProductForm(product?: Product) {
    this.editingProduct = product;
    this.productForm    = product ? { ...product } : this.emptyForm();
    this.formError      = '';
    this.showProductForm = true;
  }

  closeProductForm() {
    this.showProductForm = false;
  }

  async saveProduct(e: Event) {
    e.preventDefault();
    if (this.formSaving) return;

    this.formSaving = true;
    this.formError  = '';
    try {
      await this.supabase.upsertProduct({ ...this.editingProduct, ...this.productForm });
      await this.loadProducts();
      this.closeProductForm();
    } catch (err: any) {
      this.formError = err.message ?? 'Errore nel salvataggio.';
    } finally {
      this.formSaving = false;
      this.cdr.markForCheck();
    }
  }

  async onProductImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingProductImg = true;
    try {
      const url = await this.supabase.uploadImage(file);
      this.productForm.image_url = url;
      await this.loadImages();
    } catch (e: any) { alert('Errore upload: ' + e.message); }
    finally {
      this.uploadingProductImg = false;
      this.cdr.markForCheck();
    }
  }

  confirmDeleteProduct(p: Product) {
    this.confirmMsg = `Eliminare "${p.name}"? L'azione è irreversibile.`;
    this.confirmFn  = async () => {
      await this.supabase.deleteProduct(p.id!);
      await this.loadProducts();
    };
  }

  // ─── Immagini ─────────────────────────────────────────────────────────────

  async loadImages() {
    this.imagesLoading = true;
    try { this.images = await this.supabase.listImages(); }
    catch (e: any) { console.error(e); }
    finally {
      this.imagesLoading = false;
      this.cdr.markForCheck();
    }
  }

  async onUpload(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!files.length) return;
    this.imagesLoading = true;
    try {
      await Promise.all(files.map(f => this.supabase.uploadImage(f)));
      await this.loadImages();
    } catch (e: any) { alert('Errore upload: ' + e.message); }
    finally {
      this.imagesLoading = false;
      this.cdr.markForCheck();
    }
  }

  confirmDeleteImage(img: { name: string }) {
    this.confirmMsg = `Eliminare l'immagine "${img.name}"?`;
    this.confirmFn  = async () => {
      await this.supabase.deleteImage(img.name);
      await this.loadImages();
    };
  }

  // ─── Conferma ─────────────────────────────────────────────────────────────

  async runConfirm() {
    try { await this.confirmFn?.(); }
    catch (e: any) { alert('Errore: ' + e.message); }
    this.cancelConfirm();
  }

  cancelConfirm() {
    this.confirmMsg = '';
    this.confirmFn  = undefined;
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/admin/login']);
  }

  private emptyForm(): Product {
    return { name: '', notes: '', description: '', price: '', tag: '', image_url: '' };
  }
}
