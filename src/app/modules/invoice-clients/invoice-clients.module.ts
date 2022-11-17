import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceClientsRoutingModule } from './invoice-clients-routing.module';
import { InvoiceClientsComponent } from './pages/invoice-clients/invoice-clients.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { MainComponent } from './pages/main/main.component';
import { AddInvoiceClientsComponent } from './pages/add-invoice-clients/add-invoice-clients.component';
import { TableInvoiceClientsComponent } from './components/table-invoice-clients/table-invoice-clients.component';
import { ModalTrackingComponent } from './components/modal-tracking/modal-tracking.component';


@NgModule({
  declarations: [
    InvoiceClientsComponent,
    MainComponent,
    AddInvoiceClientsComponent,
    TableInvoiceClientsComponent,
    ModalTrackingComponent
  ],
  imports: [
    CommonModule,
    InvoiceClientsRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class InvoiceClientsModule { }
