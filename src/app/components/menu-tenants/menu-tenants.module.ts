import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTenantsComponent } from './menu-tenants.component';
import { SharedModule } from '../../shared/shared.module';
import { ModalQuestionModule } from '../modal-question/modal-question.module';



@NgModule({
  declarations: [
    MenuTenantsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalQuestionModule
  ],
  exports: [
    MenuTenantsComponent
  ]
})
export class MenuTenantsModule { }
