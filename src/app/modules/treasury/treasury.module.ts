import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { TreasuryComponent } from './pages/treasury/treasury.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';


@NgModule({
  declarations: [
    TreasuryComponent
  ],
  imports: [
    CommonModule,
    TreasuryRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class TreasuryModule { }
