import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { ViewsRoutingModule } from '../views/views-routing..module'

@NgModule({
  imports: [
    FormsModule,
    ViewsRoutingModule,
    ReactiveFormsModule,
    NgChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [  ]
})
export class ViewsModule { }