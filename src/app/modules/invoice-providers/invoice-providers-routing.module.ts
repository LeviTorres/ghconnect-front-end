import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceProvidersComponent } from './pages/invoice-providers/invoice-providers.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceProvidersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceProvidersRoutingModule { }
