import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CecosComponent } from './pages/cecos/cecos.component';

const routes: Routes = [
  {
    path: '',
    component: CecosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CecosRoutingModule { }
