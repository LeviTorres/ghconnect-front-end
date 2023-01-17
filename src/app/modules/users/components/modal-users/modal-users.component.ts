import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  public sameEmail:boolean = false

  public password: string = '';

  public repeatPassword: string = '';

  public users: User[] = []

  public tenantId: string = ''

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
  ) {
    this.tenantId = this._userService.tenant
   }

  ngOnInit(): void {
    this.registerForm.controls['email'].valueChanges.subscribe((inputEmail:any) => {
      this.validateEmail(inputEmail)
    })
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
      if(this.registerForm.invalid || !this.samePassword || !this.sameEmail){
        this._spinner.hide()
        return
      }

      const element = {
        ...this.registerForm.value,
        tenant: {
          tenant_id: this.tenantId
        }
      }
      this._userService.createUser(element)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Usuario registrado con Exito')

          this._dialogRef.close({
            ...this.registerForm.value
          })
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._spinner.hide()
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

  validateEmail(value: string){
    const validateEmail = this.users.some((user:User) => {
      return value.toLowerCase().trim() === user.email.toLowerCase().trim()
    })

    if (validateEmail) {
      this.sameEmail = false;
    } else {
      this.sameEmail = true;
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
