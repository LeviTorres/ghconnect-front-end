import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './pages/operations/operations.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';


@NgModule({
  declarations: [
    OperationsComponent
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class OperationsModule { }
