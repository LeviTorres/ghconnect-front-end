import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantsRoutingModule } from './tenants-routing.module';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TenantsComponent,
  ],
  imports: [
    CommonModule,
    TenantsRoutingModule,
    SharedModule
  ],
  exports: []
})
export class TenantsModule { }
