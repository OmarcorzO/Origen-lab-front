import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewNeedComponent } from './new-need/new-need.component';
import { ConformationComponent } from './conformation/conformation.component';

import { NeedsRoutingModule } from './needs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService  } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NeedPipe } from './pipes/need.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    NeedsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    NewNeedComponent,
    ConformationComponent,
    NeedPipe
  ],
  providers: [BsModalService]
})
export class NeedsModule { }
