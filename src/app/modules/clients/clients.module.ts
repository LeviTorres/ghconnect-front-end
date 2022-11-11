import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './pages/clients/clients.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { PageClientsComponent } from './pages/page-clients/page-clients.component';
import { TableClientsComponent } from './components/table-clients/table-clients.component';
import { AddClientsComponent } from './pages/add-clients/add-clients.component';


@NgModule({
  declarations: [
    ClientsComponent,
    PageClientsComponent,
    TableClientsComponent,
    AddClientsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class ClientsModule { }
