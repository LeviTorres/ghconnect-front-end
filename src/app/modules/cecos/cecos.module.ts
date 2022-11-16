import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CecosRoutingModule } from './cecos-routing.module';
import { CecosComponent } from './pages/cecos/cecos.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { FooterModule } from '../../components/footer/footer.module';
import { TableCecosComponent } from './components/table-cecos/table-cecos.component';
import { ModalCecosComponent } from './components/modal-cecos/modal-cecos.component';
import { EditCecosComponent } from './components/edit-cecos/edit-cecos.component';


@NgModule({
  declarations: [
    CecosComponent,
    TableCecosComponent,
    ModalCecosComponent,
    EditCecosComponent
  ],
  imports: [
    CommonModule,
    CecosRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class CecosModule { }
