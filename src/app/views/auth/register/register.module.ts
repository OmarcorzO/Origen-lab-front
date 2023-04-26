import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { RegisterRoutingModule } from './register-routing.module';
import { IconModule } from '@coreui/icons-angular';
import { FormModule, ButtonModule } from '@coreui/angular';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule, FormsModule,
    RegisterRoutingModule,
    ButtonModule,
    IconModule,
    FormModule
  ]
})
export class RegisterModule { }
