import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuNavbarComponent } from './menu-navbar.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    MenuNavbarComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    MenuNavbarComponent
  ]
})
export class MenuNavbarModule { }
