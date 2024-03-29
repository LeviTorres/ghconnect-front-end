import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './pages/business/business.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { ModalBusinessComponent } from './components/modal-business/modal-business.component';
import { TableBusinessComponent } from './components/table-business/table-business.component';
import { EditBusinessComponent } from './components/edit-business/edit-business.component';
import { BusinessTenantsComponent } from './pages/business-tenants/business-tenants.component';
import { HomeBusinessComponent } from './pages/home-business/home-business.component';
import { AddActivitiesComponent } from './components/add-activities/add-activities.component';
import { BusinessTenantsEditComponent } from './pages/business-tenants-edit/business-tenants-edit.component';
import { AddFollowersComponent } from './components/add-followers/add-followers.component';
import { EditActivitiesComponent } from './components/edit-activities/edit-activities.component';

@NgModule({
  declarations: [
    BusinessComponent,
    ModalBusinessComponent,
    TableBusinessComponent,
    EditBusinessComponent,
    BusinessTenantsComponent,
    HomeBusinessComponent,
    AddActivitiesComponent,
    BusinessTenantsEditComponent,
    AddFollowersComponent,
    EditActivitiesComponent,
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class BusinessModule { }
