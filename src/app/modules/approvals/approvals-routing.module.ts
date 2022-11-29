import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalsComponent } from './pages/approvals/approvals.component';
import { MenuApprovalsComponent } from './pages/menu-approvals/menu-approvals.component';
import { MainComponent } from './pages/main/main.component';
import { AddTravelRequestComponent } from './pages/add-travel-request/add-travel-request.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: ApprovalsComponent },
      { path: 'menu-approvals', component: MenuApprovalsComponent },
      { path: 'add-travel-request', component: AddTravelRequestComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalsRoutingModule { }
