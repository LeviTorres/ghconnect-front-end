import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessComponent } from './pages/business/business.component';
import { BusinessTenantsComponent } from './pages/business-tenants/business-tenants.component';
import { HomeBusinessComponent } from './pages/home-business/home-business.component';

const routes: Routes = [
  {
    path: '',
    component: HomeBusinessComponent,
    children: [
      { path: '', component: BusinessComponent},
      { path: 'new', component: BusinessTenantsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
