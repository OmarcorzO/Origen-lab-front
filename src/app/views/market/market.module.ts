import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MarketRoutingModule } from './market-routing.module';
import { NewMarketingComponent } from './new-marketing/new-marketing.component';
import { ButtonModule, CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@NgModule({
  declarations: [NewMarketingComponent],
  imports: [
    CommonModule,
    MarketRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ModalModule,
    IconModule,
    ButtonModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule,
  ],
  providers: [BsModalService],
})
export class MarketModule {}
