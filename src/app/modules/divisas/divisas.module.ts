import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivisasRoutingModule } from './divisas-routing.module';
import { DivisasComponent } from './pages/divisas/divisas.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { FooterModule } from '../../components/footer/footer.module';
import { TableDivisaComponent } from './components/table-divisa/table-divisa.component';
import { ModalDivisaComponent } from './components/modal-divisa/modal-divisa.component';


@NgModule({
  declarations: [
    DivisasComponent,
    TableDivisaComponent,
    ModalDivisaComponent
  ],
  imports: [
    CommonModule,
    DivisasRoutingModule,
    NavbarModule,
    SharedModule,
    FooterModule
  ]
})
export class DivisasModule { }
