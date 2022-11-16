import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangesDivisasRoutingModule } from './exchanges-divisas-routing.module';
import { DivisasModule } from '../divisas/divisas.module';
import { ExchangesModule } from '../exchanges/exchanges.module';
import { ExchangesDivisasComponent } from './pages/exchanges-divisas/exchanges-divisas.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { MainComponent } from './pages/main/main.component';
import { DetailsExchangesComponent } from './pages/details-exchanges/details-exchanges.component';


@NgModule({
  declarations: [
    ExchangesDivisasComponent,
    MainComponent,
    DetailsExchangesComponent
  ],
  imports: [
    CommonModule,
    ExchangesDivisasRoutingModule,
    DivisasModule,
    ExchangesModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class ExchangesDivisasModule { }
