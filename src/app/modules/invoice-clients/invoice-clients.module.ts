import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceClientsRoutingModule } from './invoice-clients-routing.module';
import { InvoiceClientsComponent } from './pages/invoice-clients/invoice-clients.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';


@NgModule({
  declarations: [
    InvoiceClientsComponent
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
