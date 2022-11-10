import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { FooterModule } from '../../components/footer/footer.module';


@NgModule({
  declarations: [
    ContractsComponent
  ],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    NavbarModule,
    SharedModule,
    FooterModule
  ]
})
export class ContractsModule { }
