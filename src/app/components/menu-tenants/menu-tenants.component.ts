import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/User.model';
import { UsersService } from '../../services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalQuestionComponent } from '../modal-question/modal-question.component';

@Component({
  selector: 'app-menu-tenants',
  templateUrl: './menu-tenants.component.html',
  styleUrls: ['./menu-tenants.component.scss']
})
export class MenuTenantsComponent implements OnInit {

  public tenants:any
  public user:any
  public tenant:any


  constructor(
    private _loginService: LoginService,
    private _userService:UsersService,
    private _spinner: NgxSpinnerService,
    private _router:Router,
    private _dialog: MatDialog,
  ) {
    this.tenant = localStorage.getItem('name-tenant')
  }

  ngOnInit(): void {
    this.getUsers()
  }


  getUsers() {
    this._userService.getUsers().subscribe((users: User[]) => {
      this.user = users.find((user: User) => user._id === this._loginService.uid)
      const findTenants = this.user.tenant.findIndex((element:any) => {
        return element.tenant_id.name_short === this.tenant
      })
      this.tenants = this.user.tenant
      this.tenants.splice(findTenants, 1);
    })
  }

  goToTenant(id:string){

    let dialogRef = this._dialog.open(ModalQuestionComponent, {
      width: '640px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: id
    });
    dialogRef.beforeClosed().subscribe(() => {
      //window.location.reload()
    })

  }

}
