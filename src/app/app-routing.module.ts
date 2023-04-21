import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/auth/login/login.component';
import { LoguedGuard } from './views/guards/logued.guard';
import { RegisterComponent } from './views/auth/register/register.component';
import { LandingComponent } from './views/auth/landing/landing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'landing',
    canActivate:[LoguedGuard],
    component: LandingComponent,
    data: {
      title: 'Landing'
    }
  },
  {
    path: 'login',
    canActivate:[LoguedGuard],
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'register',
    canActivate:[LoguedGuard],
    component: RegisterComponent,
    data: {
      title: 'Registro'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./views/views.module').then(m => m.ViewsModule)
      }
    ]
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
