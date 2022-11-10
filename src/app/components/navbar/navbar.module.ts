import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarRoutingModule } from './navbar-routing.module';
import { NavbarComponent } from './navbar.component';
import { SharedModule } from '../../shared/shared.module';
import { MenuNavbarModule } from '../menu-navbar/menu-navbar.module';


@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    NavbarRoutingModule,
    SharedModule,
    MenuNavbarModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
