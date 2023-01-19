import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalsRoutingModule } from './approvals-routing.module';
import { ApprovalsComponent } from './pages/travel-request/approvals/approvals.component';
import { SharedModule } from '../../shared/shared.module';
import { FooterModule } from '../../components/footer/footer.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { TableApprovalsComponent } from './components/table-approvals/table-approvals.component';
import { MenuApprovalsComponent } from './pages/menu-approvals/menu-approvals.component';
import { MainComponent } from './pages/main/main.component';
import { AddTravelRequestComponent } from './pages/travel-request/add-travel-request/add-travel-request.component';
import { EditTravelRequestComponent } from './pages/travel-request/edit-travel-request/edit-travel-request.component';
import { ApprovalsRequestComponent } from './pages/travel-request/approvals-request/approvals-request.component';
import { AddFinaceRequestComponent } from './pages/finace-request/add-finace-request/add-finace-request.component';
import { EditFinaceRequestComponent } from './pages/finace-request/edit-finace-request/edit-finace-request.component';
import { ApprovalsFinaceRequestComponent } from './pages/finace-request/approvals-finace-request/approvals-finace-request.component';
import { MainFinaceRequestComponent } from './pages/finace-request/main-finace-request/main-finace-request.component';
import { TableFinaceRequestComponent } from './components/table-finace-request/table-finace-request.component';
import { AddDocumentFinaceRequestComponent } from './components/add-document-finace-request/add-document-finace-request.component';


@NgModule({
  declarations: [
    ApprovalsComponent,
    TableApprovalsComponent,
    MenuApprovalsComponent,
    MainComponent,
    AddTravelRequestComponent,
    EditTravelRequestComponent,
    ApprovalsRequestComponent,
    AddFinaceRequestComponent,
    EditFinaceRequestComponent,
    ApprovalsFinaceRequestComponent,
    MainFinaceRequestComponent,
    TableFinaceRequestComponent,
    AddDocumentFinaceRequestComponent
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
