import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../../services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../../../models/User.model';

@Component({
  selector: 'app-modal-users',
  templateUrl: './modal-users.component.html',
  styleUrls: ['./modal-users.component.scss']
})
export class ModalUsersComponent implements OnInit {

  public samePassword: boolean = true;

  public sameName: boolean = false;

  public password: string = '';

  public repeatPassword: string = '';

  public users: User[] = []

  public registerForm = this._fb.group({
    name: ['', Validators.required ],
    last_name: [ '', Validators.required ],
    password: [ '', Validators.required ],
    password2: [ '', Validators.required ],
    email: [ '', [ Validators.required, Validators.email ] ]
  })

  constructor(
    private _fb: FormBuilder,
    private _userService: UsersService,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<ModalUsersComponent>,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.registerForm.controls['password2'].valueChanges.subscribe((inputPassword2) => {
      this.repeatPassword = inputPassword2!.trim();
      this.comparePassword();
    })
    this.registerForm.controls['password'].valueChanges.subscribe((inputPassword) => {
      this.password = inputPassword!.trim();
      this.comparePassword();
    })
  }

  registerUser() {
      this._spinner.show()
      if(this.registerForm.invalid || !this.samePassword){
        return
      }

      this._userService.createUser(this.registerForm.value)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Usuario registrado con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

  comparePassword() {
    if(this.password === this.repeatPassword) {
      this.samePassword = true;
    }else {
      this.samePassword = false;
    }
  }

  /*validateName() {
    const fullName = `${this.registerForm.controls['name'].value!
      .toLowerCase()
      .trim()}${this.registerForm.controls['last_name'].value!
      .toLowerCase()
      .trim()}`;
    const validatefullName = this.users.some((user: User) => {
      return (
        `${user.name.toLocaleLowerCase().trim()}${user.last_name
          .toLocaleLowerCase()
          .trim()}` ===
        fullName.toLowerCase().trim()
      );
    });
    if (validatefullName) {
      this.sameName = false;
    } else {
      this.sameName = true;
    }
  }*/

}
