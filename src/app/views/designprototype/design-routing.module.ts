import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewActivityComponent } from './new-activity/new-activity.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Diseño y Prototipo'
    },
    children: [
      {
        path: '',
        redirectTo: 'new-activity'
      },
      {
        path: 'new-activity',
        component: NewActivityComponent,
        data: {
          title: 'Actividades y Recursos'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignRoutingModule {}
