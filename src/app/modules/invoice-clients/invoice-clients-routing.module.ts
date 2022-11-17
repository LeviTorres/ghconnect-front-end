import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceClientsComponent } from './pages/invoice-clients/invoice-clients.component';
import { MainComponent } from './pages/main/main.component';
import { AddInvoiceClientsComponent } from './pages/add-invoice-clients/add-invoice-clients.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: InvoiceClientsComponent},
      { path: 'add-invoice-clients', component: AddInvoiceClientsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceClientsRoutingModule { }
