import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../models/User.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalUsersComponent } from '../modal-users/modal-users.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../../../services/login.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeadersService } from '../../../../services/headers.service';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.scss']
})
export class TableUsersComponent implements OnInit {

  public users: User[] = []
  public usersTemp: User[] = []

  public headersUser: any[] = []
  public header_name: string = 'users';

  public avatarControl: FormControl = new FormControl()
  public nameControl: FormControl = new FormControl()
  public lastNameControl: FormControl = new FormControl()
  public roleControl: FormControl = new FormControl()
  public emailControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  public selectedValue: number = 100;
  public page!: number;

  constructor(
    private _userService: UsersService,
    private _headerService: HeadersService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _loginService: LoginService
  ) {
    this.getUsers()
    this.getHeadersUser()
  }

  ngOnInit() {

  }

  openDialogModalUser() {
    let dialogRef = this._dialog.open(ModalUsersComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getUsers()
    })
  }

  initValuesHeader() {
    const headerUser = this.headersUser.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerUser) {
      this.avatarControl.setValue(headerUser.avatar)
      this.nameControl.setValue(headerUser.name)
      this.lastNameControl.setValue(headerUser.last_name)
      this.emailControl.setValue(headerUser.email)
      this.roleControl.setValue(headerUser.role)
      this.actionsControl.setValue(headerUser.actions)
    } else {
      this.avatarControl.setValue(true)
      this.nameControl.setValue(true)
      this.lastNameControl.setValue(true)
      this.emailControl.setValue(true)
      this.roleControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        avatar: true,
        name: true,
        last_name: true,
        role: true,
        email: true,
        actions: true,
      }
      this._headerService.createHeaders(element, 'users').subscribe((item: any) => {
        this.getHeadersUser()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerUser = this.headersUser.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      avatar: this.avatarControl.value,
      name: this.nameControl.value,
      last_name: this.lastNameControl.value,
      email: this.emailControl.value,
      role: this.roleControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerUser._id, 'users').subscribe(() => {

    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  getUsers() {
    this._spinner.show()
    this._userService.getUsers().subscribe((resp: any) => {
      this.users = resp.users
      this.usersTemp = resp.users
      this._spinner.hide()
    })
  }

  getHeadersUser() {
    this._spinner.show()
    this._headerService.getHeaders('users').subscribe((resp: any) => {
      this.headersUser = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  getRole(role: string) {
    if (role === 'ADMIN_ROLE') {
      return 'Administrador'
    }
    return
  }

  search(term: string) {
    if (term.length === 0) {
      return this.users = this.usersTemp
    }
    this._searchService.search('users', term).subscribe((resp: any) => {
      console.log(this.users);

      this.users = resp
    })
    return
  }

  delete(user: User) {

    if (user._id === this._loginService.user._id) {
      return this._toastr.error('No puede eliminar el usuario')
    }

    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${user.name} ${user.last_name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._userService.deleteUser(user).subscribe(() => {
          this.getUsers()
          this._spinner.hide()
          this._toastr.success(`Usuario ${user.name} ${user.last_name} eliminado con exito`)
        })

      }
    })
  }

}
