import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlRoutingModule } from './control-routing.module';
import { ControlComponent } from './pages/control/control.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';


@NgModule({
  declarations: [
    ControlComponent
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class ControlModule { }
