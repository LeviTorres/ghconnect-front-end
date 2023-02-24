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
import { EditClientComponent } from './pages/edit-client/edit-client.component';
import { ImportFileComponent } from './components/import-file/import-file.component';
import { AddActivitiesComponent } from './components/add-activities/add-activities.component';
import { AddFollowersComponent } from './components/add-followers/add-followers.component';
import { EditActivitiesComponent } from './components/edit-activities/edit-activities.component';


@NgModule({
  declarations: [
    ClientsComponent,
    PageClientsComponent,
    TableClientsComponent,
    AddClientsComponent,
    EditClientComponent,
    ImportFileComponent,
    AddActivitiesComponent,
    AddFollowersComponent,
    EditActivitiesComponent
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
