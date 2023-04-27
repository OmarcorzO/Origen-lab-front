import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { IconModule } from '@coreui/icons-angular';

import { LoginRoutingModule } from './login-routing.module';
import {
  ButtonModule,
  FormModule,
} from '@coreui/angular';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule,
    IconModule,
    FormModule,
    ButtonModule,
  ],
})
export class LoginModule {}
