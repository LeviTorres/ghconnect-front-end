import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalsRoutingModule } from './approvals-routing.module';
import { ApprovalsComponent } from './pages/approvals/approvals.component';
import { SharedModule } from '../../shared/shared.module';
import { FooterModule } from '../../components/footer/footer.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { TableApprovalsComponent } from './components/table-approvals/table-approvals.component';
import { MenuApprovalsComponent } from './pages/menu-approvals/menu-approvals.component';
import { MainComponent } from './pages/main/main.component';
import { AddTravelRequestComponent } from './pages/add-travel-request/add-travel-request.component';
import { EditTravelRequestComponent } from './pages/edit-travel-request/edit-travel-request.component';
import { ApprovalsRequestComponent } from './pages/approvals-request/approvals-request.component';


@NgModule({
  declarations: [
    ApprovalsComponent,
    TableApprovalsComponent,
    MenuApprovalsComponent,
    MainComponent,
    AddTravelRequestComponent,
    EditTravelRequestComponent,
    ApprovalsRequestComponent
  ],
  imports: [
    CommonModule,
    ApprovalsRoutingModule,
    SharedModule,
    FooterModule,
    NavbarModule
  ]
})
export class ApprovalsModule { }
