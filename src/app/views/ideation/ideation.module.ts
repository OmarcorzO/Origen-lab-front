import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { IdeationRoutingModule } from './ideation-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NewIdeationComponent } from './new-ideation/new-ideation.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonModule, CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IdeationRoutingModule,
    BsDropdownModule,
    CardModule,
    IconModule,
    ButtonModule,
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule,
    ModalModule,
    TabsModule,
  ],
  declarations: [
    NewIdeationComponent
  ],
  providers: [BsModalService]
})
export class IdeationModule { }