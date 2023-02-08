import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceClientsComponent } from './pages/invoice-clients/invoice-clients.component';
import { MainComponent } from './pages/main/main.component';
import { AddInvoiceClientsComponent } from './pages/add-invoice-clients/add-invoice-clients.component';
import { EditInvoiceClientComponent } from './pages/edit-invoice-client/edit-invoice-client.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: InvoiceClientsComponent },
      { path: 'add-invoice-clients', component: AddInvoiceClientsComponent },
      { path: 'edit-invoice-client', component: EditInvoiceClientComponent },
      { path: 'dashboard', component: DashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceClientsRoutingModule { }
