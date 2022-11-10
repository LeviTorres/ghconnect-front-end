import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationRoutingModule } from './validation-routing.module';
import { ValidationComponent } from './pages/validation/validation.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';


@NgModule({
  declarations: [
    ValidationComponent
  ],
  imports: [
    CommonModule,
    ValidationRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class ValidationModule { }
