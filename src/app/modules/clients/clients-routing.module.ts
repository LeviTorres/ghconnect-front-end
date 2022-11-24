import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './pages/clients/clients.component';
import { PageClientsComponent } from './pages/page-clients/page-clients.component';
import { AddClientsComponent } from './pages/add-clients/add-clients.component';
import { EditClientComponent } from './pages/edit-client/edit-client.component';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
    children: [
      { path: '', component: PageClientsComponent },
      { path: 'add-client', component: AddClientsComponent },
      { path: 'edit-client', component: EditClientComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
