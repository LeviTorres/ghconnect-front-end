import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';



@NgModule({
  declarations: [
    TaskComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TaskComponent
  ]
})
export class TaskModule { }
