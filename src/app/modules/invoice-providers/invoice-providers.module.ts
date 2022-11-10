import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceProvidersRoutingModule } from './invoice-providers-routing.module';
import { InvoiceProvidersComponent } from './pages/invoice-providers/invoice-providers.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';


@NgModule({
  declarations: [
    InvoiceProvidersComponent
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
