import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewMarketingComponent } from './new-marketing/new-marketing.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Mercadeo'
    },
    children: [
      {
        path: '',
        redirectTo: 'marketing' 
      },
      {
        path: 'marketing',
        component: NewMarketingComponent,
        data: {
          title: 'Marketing'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
