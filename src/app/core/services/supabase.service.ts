import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface Product {
  id?:          string;
  name:         string;
  notes:        string;
  description:  string;
  price:        string;
  tag?:         string;
  image_url?:   string;
  sort_order?:  number;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient;
  static readonly BUCKET = 'candele';

  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────

  signIn(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.client.auth.signOut();
  }

  getSession(): Promise<{ data: { session: Session | null } }> {
    return this.client.auth.getSession();
  }

  getUser(): Promise<{ data: { user: User | null } }> {
    return this.client.auth.getUser();
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // ─── Storage: immagini candele ────────────────────────────────────────────

  async uploadImage(file: File): Promise<string> {
    const ext  = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await this.client.storage
      .from(SupabaseService.BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;
    return this.getPublicUrl(path);
  }

  getPublicUrl(path: string): string {
    const { data } = this.client.storage
      .from(SupabaseService.BUCKET)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async listImages(): Promise<{ name: string; url: string }[]> {
    const { data, error } = await this.client.storage
      .from(SupabaseService.BUCKET)
      .list('', { sortBy: { column: 'created_at', order: 'desc' } });

    if (error) throw error;
    return (data ?? []).map(f => ({
      name: f.name,
      url:  this.getPublicUrl(f.name)
    }));
  }

  async deleteImage(name: string): Promise<void> {
    const { error } = await this.client.storage
      .from(SupabaseService.BUCKET)
      .remove([name]);
    if (error) throw error;
  }

  // ─── Database: prodotti ───────────────────────────────────────────────────

  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async upsertProduct(product: Product): Promise<void> {
    const { error } = await this.client
      .from('products')
      .upsert(product, { onConflict: 'id' });
    if (error) throw error;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.client
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
