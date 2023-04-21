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


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IdeationRoutingModule,
    BsDropdownModule,
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