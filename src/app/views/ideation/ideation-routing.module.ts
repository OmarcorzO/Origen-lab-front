import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewIdeationComponent } from './new-ideation/new-ideation.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ideación'
    },
    children: [
      {
        path: '',
        redirectTo: 'new-ideation'
      },
      {
        path: 'new-ideation',
        component: NewIdeationComponent,
        data: {
          title: 'Panel de Ideación'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdeationRoutingModule {}
