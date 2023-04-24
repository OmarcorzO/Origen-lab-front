import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewNeedComponent } from './new-need/new-need.component';
import { ConformationComponent } from './conformation/conformation.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Necesidades'
    },
    children: [
      {
        path: '',
        redirectTo: 'new-need',
        pathMatch: 'full'
      },
      {
        path: 'new-need',
        component: NewNeedComponent,
        data: {
          title: 'Las necesidades'
        }
      },
      {
        path: 'conformation',
        component: ConformationComponent,
        data: {
          title: 'Conformación equipo'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedsRoutingModule {}
