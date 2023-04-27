// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NewIdeaComponent } from './new-idea/new-idea.component';
import { ViewIdeaComponent } from './view-idea/view-idea.component';

import { IdeasRoutingModule } from './ideas-routing.module';
import { MyIdeaComponent } from './my-idea/my-idea.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule, BsModalService  } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CardModule, FormModule, GridModule, TableModule, WidgetModule } from '@coreui/angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { IconModule } from '@coreui/icons-angular';

@NgModule({
  imports: [
    CommonModule,
    IdeasRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TableModule,
    ChartjsModule,
    WidgetModule,
    GridModule,
    IconModule,
    ModalModule,
    FormModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    NewIdeaComponent,
    ViewIdeaComponent,
    MyIdeaComponent,
  ],
  providers: [BsModalService]
})
export class IdeasModule { }
