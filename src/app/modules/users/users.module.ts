import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { TableUsersComponent } from './components/table-users/table-users.component';
import { UsersComponent } from './pages/users/users.component';
import { SharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { ModalUsersComponent } from './components/modal-users/modal-users.component';
import { FooterModule } from '../../components/footer/footer.module';
import { EditUserComponent } from './components/edit-user/edit-user.component';


@NgModule({
  declarations: [
    ModalUsersComponent,
    TableUsersComponent,
    UsersComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NavbarModule,
    FooterModule
  ]
})
export class UsersModule { }
