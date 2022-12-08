import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalsComponent } from './pages/approvals/approvals.component';
import { MenuApprovalsComponent } from './pages/menu-approvals/menu-approvals.component';
import { MainComponent } from './pages/main/main.component';
import { AddTravelRequestComponent } from './pages/add-travel-request/add-travel-request.component';
import { EditTravelRequestComponent } from './pages/edit-travel-request/edit-travel-request.component';
import { ApprovalsRequestComponent } from './pages/approvals-request/approvals-request.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: MenuApprovalsComponent },
      { path: 'approvals-travel', component: ApprovalsComponent },
      { path: 'approvals-travel/add-travel-request', component: AddTravelRequestComponent },
      { path: 'approvals-travel/:id', component: EditTravelRequestComponent},
      { path: 'approvals-request/:token', component: ApprovalsRequestComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalsRoutingModule { }
