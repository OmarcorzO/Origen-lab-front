import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Inicio'
    },
    canActivate: [LoginGuard],
    children: [
      {
        path: 'ideas',
        loadChildren: () => import('../views/IDEAS/ideas.module').then(m => m.IdeasModule)
      },
      {
        path: 'needs',
        loadChildren: () => import('../views/NEEDS/needs.module').then(m => m.NeedsModule)
      },
      {
        path: 'ideation',
        loadChildren: () => import('../views/IDEATION/ideation.module').then(m => m.IdeationModule)
      },
      {
        path: 'design',
        loadChildren: () => import('../views/DESIGNPROTOTYPE/design.module').then(m => m.DesignModule)
      },
      {
        path: 'market',
        loadChildren: () => import('../views/MARKET/market.module').then(m => m.MarketModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../views/auth/profile/profile.module').then(m => m.ProfileModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule {}


