import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Admin (sempre disponibile, indipendente da comingSoon)
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/admin-login/admin-login').then(m => m.AdminLogin)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [authGuard]
  },

  // Sito pubblico
  ...(environment.comingSoon
    ? [{ path: '**', loadComponent: () => import('./pages/coming-soon/coming-soon').then(m => m.ComingSoon) }]
    : [
        { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
        { path: '**', redirectTo: '' }
      ]
  )
];
