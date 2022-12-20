import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalsComponent } from './pages/travel-request/approvals/approvals.component';
import { MenuApprovalsComponent } from './pages/menu-approvals/menu-approvals.component';
import { MainComponent } from './pages/main/main.component';
import { AddTravelRequestComponent } from './pages/travel-request/add-travel-request/add-travel-request.component';
import { EditTravelRequestComponent } from './pages/travel-request/edit-travel-request/edit-travel-request.component';
import { ApprovalsRequestComponent } from './pages/travel-request/approvals-request/approvals-request.component';
import { MainFinaceRequestComponent } from './pages/finace-request/main-finace-request/main-finace-request.component';
import { AddFinaceRequestComponent } from './pages/finace-request/add-finace-request/add-finace-request.component';
import { EditFinaceRequestComponent } from './pages/finace-request/edit-finace-request/edit-finace-request.component';
import { ApprovalsFinaceRequestComponent } from './pages/finace-request/approvals-finace-request/approvals-finace-request.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: MenuApprovalsComponent },

      { path: 'approvals-travel', component: ApprovalsComponent },
      { path: 'approvals-travel/add-travel-request', component: AddTravelRequestComponent },
      { path: 'approvals-travel/:id', component: EditTravelRequestComponent },
      { path: 'approvals-request/:token', component: ApprovalsRequestComponent },

      { path: 'approvals-finace', component: MainFinaceRequestComponent },
      { path: 'approvals-finace/add-finace-request', component: AddFinaceRequestComponent },
      { path: 'approvals-finace/:id', component: EditFinaceRequestComponent },
      { path: 'approvals-finace/:token', component: ApprovalsFinaceRequestComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalsRoutingModule { }
