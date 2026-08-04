import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  email    = '';
  password = '';
  showPwd  = false;
  loading  = false;
  errorMsg = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onSubmit(e: Event) {
    e.preventDefault();
    this.loading  = true;
    this.errorMsg = '';

    try {
      const { error } = await this.supabase.signIn(this.email, this.password);

      if (error) {
        this.errorMsg = 'Credenziali non valide. Riprova.';
      } else {
        this.router.navigate(['/admin']);
      }
    } catch (err: any) {
      this.errorMsg = 'Errore di connessione. Controlla la rete e riprova.';
    } finally {
      this.loading = false;
    }
  }
}
