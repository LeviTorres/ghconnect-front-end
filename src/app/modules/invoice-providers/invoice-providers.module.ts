import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceProvidersRoutingModule } from './invoice-providers-routing.module';
import { InvoiceProvidersComponent } from './pages/invoice-providers/invoice-providers.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { MainComponent } from './pages/main/main.component';
import { TableInvoiceProvidersComponent } from './components/table-invoice-providers/table-invoice-providers.component';
import { AddInvoiceProvidersComponent } from './pages/add-invoice-providers/add-invoice-providers.component';
import { ModalTrackingComponent } from './components/modal-tracking/modal-tracking.component';
import { EditInvoiceProviderComponent } from './pages/edit-invoice-provider/edit-invoice-provider.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditActivitiesComponent } from './components/edit-activities/edit-activities.component';
import { AddActivitiesComponent } from './components/add-activities/add-activities.component';
import { AddFollowersComponent } from './components/add-followers/add-followers.component';
import { ImportFileComponent } from './components/import-file/import-file.component';


@NgModule({
  declarations: [
    InvoiceProvidersComponent,
    MainComponent,
    TableInvoiceProvidersComponent,
    AddInvoiceProvidersComponent,
    ModalTrackingComponent,
    EditInvoiceProviderComponent,
    DashboardComponent,
    EditActivitiesComponent,
    AddActivitiesComponent,
    AddFollowersComponent,
    ImportFileComponent
  ],
  imports: [
    CommonModule,
    InvoiceProvidersRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class InvoiceProvidersModule { }
