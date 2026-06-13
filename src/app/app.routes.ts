import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'timeline', pathMatch: 'full' },
  {
    path: 'timeline',
    loadComponent: () => import('./features/timeline/timeline.component').then(m => m.TimelineComponent),
  },
  {
    path: 'summary',
    loadComponent: () => import('./features/summary/summary.component').then(m => m.SummaryComponent),
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
  },
  { path: '**', redirectTo: 'timeline' },
];
