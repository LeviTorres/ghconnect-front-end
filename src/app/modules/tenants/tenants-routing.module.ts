import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsComponent } from './pages/tenants/tenants.component';

const routes: Routes = [
  {
    path: '',
    component: TenantsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantsRoutingModule { }
