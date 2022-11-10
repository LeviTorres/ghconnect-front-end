import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceClientsComponent } from './pages/invoice-clients/invoice-clients.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceClientsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceClientsRoutingModule { }
