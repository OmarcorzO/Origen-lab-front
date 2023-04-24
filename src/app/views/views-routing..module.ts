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
        loadChildren: () => import('../views/ideas/ideas.module').then(m => m.IdeasModule)
      },
      {
        path: 'needs',
        loadChildren: () => import('../views/needs/needs.module').then(m => m.NeedsModule)
      },
      {
        path: 'ideation',
        loadChildren: () => import('../views/ideation/ideation.module').then(m => m.IdeationModule)
      },
      {
        path: 'design',
        loadChildren: () => import('../views/designprototype/design.module').then(m => m.DesignModule)
      },
      {
        path: 'market',
        loadChildren: () => import('../views/market/market.module').then(m => m.MarketModule)
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


