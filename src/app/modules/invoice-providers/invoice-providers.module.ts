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


@NgModule({
  declarations: [
    InvoiceProvidersComponent,
    MainComponent,
    TableInvoiceProvidersComponent,
    AddInvoiceProvidersComponent,
    ModalTrackingComponent
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
