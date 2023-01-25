import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ModalQuestionComponent } from './modal-question.component';
import { MenuTenantsModule } from '../menu-tenants/menu-tenants.module';



@NgModule({
  declarations: [
    ModalQuestionComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ModalQuestionComponent
  ]
})
export class ModalQuestionModule { }
