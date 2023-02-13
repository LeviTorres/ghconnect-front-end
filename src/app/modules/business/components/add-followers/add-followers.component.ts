import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../../../models/User.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-followers',
  templateUrl: './add-followers.component.html',
  styleUrls: ['./add-followers.component.scss']
})
export class AddFollowersComponent implements OnInit {

  public activities: any[] = [
    { name: 'Por hacer' },
    { name: 'Correo electronico' },
    { name: 'LLamada' },
    { name: 'Reunion' },
    { name: 'Subir documento'}
  ]

  public users: User[] = []
  public filteredOptions: any[] = [];
  public dateForm: any

  public activityForm: FormGroup = new FormGroup({
    user: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    sendEmail: new FormControl(true, Validators.required),
  })

  constructor(
    private _dialog:MatDialog,
    private _dialogRef: MatDialogRef<AddFollowersComponent>,
    private _users: UsersService,
    private _toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public followers: any
  ) {
    this.getUsers()
  }

  ngOnInit(): void {
    this.activityForm.controls['user'].valueChanges.subscribe((inputValue:any) => {
      this.filterData(inputValue)
    })
    this.activityForm.controls['date'].setValue(new Date().getTime())
  }

  getUsers(){
    this._users.getUsers().subscribe((users: User[]) => {
      this.users = users
    })
  }

  displayFn(user: User): string {
    return user && `${user.email}`
      ? `${user.email}`
      : '';
  }

  filterData(value: string) {
    this.filteredOptions = this.users.filter((item: any) => {
      this.displayFn(item);
      return (
        item.email.toLowerCase().indexOf(value) > -1
      );
    });
  }

  registerActivity(){

    if(this.activityForm.invalid){
      this.activityForm.markAllAsTouched()
      return
    }
    const findUser = this.followers.find((element:any) => element.user._id === this.activityForm.controls['user'].value._id)
    if(findUser){
      this._toastr.warning('Selecciona un destinatario diferente')
      return
    }

    const element = {
      ...this.activityForm.value,
    }
    this._dialogRef.close(element);
    this._dialogRef.close()
  }


}
