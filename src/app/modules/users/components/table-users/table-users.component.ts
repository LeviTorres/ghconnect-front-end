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

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.scss']
})
export class TableUsersComponent implements OnInit {

  public totalUsers:number = 0
  public users: User[] = []
  public usersTemp: User[] = []
  public desde: number = 0
  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _userService: UsersService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr:ToastrService,
    private _loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.getUsers()
  }

  openDialogModalUser(){
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

  getUsers(){
    this._spinner.show()
    this._userService.getUsers().subscribe((resp:any) => {
      this.users = resp.users
      this.usersTemp = resp.users
      this._spinner.hide()
    })
  }

  getRole(role:string){
    if(role === 'ADMIN_ROLE'){
      return 'Administrador'
    }
    return
  }

  search(term:string){
    if(term.length === 0){
      return this.users = this.usersTemp
    }
    this._searchService.search('users',term).subscribe( (resp: any) => {
      this.users = resp
    })
    return
  }

  delete(user:User){

    if(user._id === this._loginService.user._id){
      return this._toastr.error('No puede eliminar el usuario')
    }

    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${user.name} ${user.last_name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if(result.value){
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
