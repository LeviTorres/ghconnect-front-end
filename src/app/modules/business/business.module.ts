import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './pages/business/business.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { ModalBusinessComponent } from './components/modal-business/modal-business.component';
import { TableBusinessComponent } from './components/table-business/table-business.component';
import { EditBusinessComponent } from './components/edit-business/edit-business.component';


@NgModule({
  declarations: [
    BusinessComponent,
    ModalBusinessComponent,
    TableBusinessComponent,
    EditBusinessComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class BusinessModule { }
