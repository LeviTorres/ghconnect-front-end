import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ProvidersComponent } from './pages/providers/providers.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';


@NgModule({
  declarations: [
    ProvidersComponent
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class ProvidersModule { }
