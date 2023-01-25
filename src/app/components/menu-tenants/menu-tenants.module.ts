import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTenantsComponent } from './menu-tenants.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    MenuTenantsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    MenuTenantsComponent
  ]
})
export class MenuTenantsModule { }
