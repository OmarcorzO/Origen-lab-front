import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyIdeaComponent } from './my-idea/my-idea.component';

import { NewIdeaComponent } from './new-idea/new-idea.component';
import { ViewIdeaComponent } from './view-idea/view-idea.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ideas'
    },
    children: [
      {
        path: '',
        redirectTo: 'new-idea',
        pathMatch: 'full'
      },
      {
        path: 'new-idea',
        component: NewIdeaComponent,
        data: {
          title: 'Nueva Idea'
        }
      },
      {
        path: 'view-idea',
        component: ViewIdeaComponent,
        data: {
          title: 'Ver Ideas'
        }
      },
      {
        path: 'my-idea',
        component: MyIdeaComponent,
        data: {
          title: 'Mis Ideas'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdeasRoutingModule {}
