import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangesRoutingModule } from './exchanges-routing.module';
import { ExchangesComponent } from './pages/exchanges/exchanges.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalExchangeComponent } from './components/modal-exchange/modal-exchange.component';
import { TableExchangesComponent } from './components/table-exchanges/table-exchanges.component';
import { AddNewExchangesComponent } from './components/add-new-exchanges/add-new-exchanges.component';
import { EditExchangesComponent } from './components/edit-exchanges/edit-exchanges.component';


@NgModule({
  declarations: [
    ExchangesComponent,
    ModalExchangeComponent,
    TableExchangesComponent,
    AddNewExchangesComponent,
    EditExchangesComponent
  ],
  imports: [
    CommonModule,
    ExchangesRoutingModule,
    NavbarModule,
    FooterModule,
    SharedModule
  ],
  exports: [
    ExchangesComponent,
    ModalExchangeComponent,
    TableExchangesComponent,
    AddNewExchangesComponent,
    EditExchangesComponent
  ]
})
export class ExchangesModule { }
