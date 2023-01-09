import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantsRoutingModule } from './tenants-routing.module';
import { TenantsComponent } from './pages/tenants/tenants.component';


@NgModule({
  declarations: [
    TenantsComponent
  ],
  imports: [
    CommonModule,
    TenantsRoutingModule
  ]
})
export class TenantsModule { }
