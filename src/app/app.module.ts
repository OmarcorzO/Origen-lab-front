import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { LandingComponent } from './views/auth/landing/landing.component';
import { LoginComponent } from './views/auth/login/login.component';
import { ProfileComponent } from './views/auth/profile/profile.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { ConformationComponent } from './views/needs/conformation/conformation.component';
import { NewNeedComponent } from './views/needs/new-need/new-need.component';
import { NeedPipe } from './views/needs/pipes/need.pipe';
import { NewIdeationComponent } from './views/ideation/new-ideation/new-ideation.component';
import { NewActivityComponent } from './views/DESIGNPROTOTYPE/new-activity/new-activity.component';
import { MyIdeaComponent } from './views/ideas/my-idea/my-idea.component';
import { NewIdeaComponent } from './views/ideas/new-idea/new-idea.component';
import { ViewIdeaComponent } from './views/ideas/view-idea/view-idea.component';
// import { NewMarketingComponent } from './views/market/new-marketing/new-marketing.component';
import { MarketModule } from "./views/market/market.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, LandingComponent, LoginComponent, ProfileComponent, RegisterComponent, ConformationComponent, NewNeedComponent, NeedPipe, NewIdeationComponent, NewActivityComponent, MyIdeaComponent, NewIdeaComponent, ViewIdeaComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MarketModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    PerfectScrollbarModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
  ],
  providers: [
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    IconSetService,
    Title
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
