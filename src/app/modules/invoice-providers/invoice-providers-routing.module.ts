import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceProvidersComponent } from './pages/invoice-providers/invoice-providers.component';
import { MainComponent } from './pages/main/main.component';
import { AddInvoiceProvidersComponent } from './pages/add-invoice-providers/add-invoice-providers.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: InvoiceProvidersComponent},
      { path: 'add-invoice-providers', component: AddInvoiceProvidersComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceProvidersRoutingModule { }
