import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/User.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-add-activities',
  templateUrl: './add-activities.component.html',
  styleUrls: ['./add-activities.component.scss']
})
export class AddActivitiesComponent implements OnInit {

  public activities: any[] = [
    { name: 'Por hacer' },
    { name: 'Correo electronico' },
    { name: 'LLamada' },
    { name: 'Reunion' },
    { name: 'Subir documento'}
  ]

  public users: User[] = []
  public filteredOptions: any[] = [];
  public user!: User

  public activityForm: FormGroup = new FormGroup({
    type_activity: new FormControl('', Validators.required),
    date_expiration: new FormControl('', Validators.required),
    summary: new FormControl('', Validators.required),
    assignment: new FormControl('', Validators.required),
    note: new FormControl(''),
    type: new FormControl('activity'),
  })

  constructor(
    private _dialog:MatDialog,
    private _dialogRef: MatDialogRef<AddActivitiesComponent>,
    private _users: UsersService,
    private _loginService: LoginService
  ) {
    this.getUsers()
    this.user = _loginService.user
  }

  ngOnInit(): void {
    this.activityForm.controls['assignment'].valueChanges.subscribe((inputValue:any) => {
      this.filterData(inputValue)
    })
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
    const element = {
      ...this.activityForm.value,
      date_expiration: new Date(this.activityForm.controls['date_expiration'].value).getTime(),
      user: this.user._id,
      assignment: this.activityForm.controls['assignment'].value._id,
      date: new Date().getTime(),
      status: 'DRAFT'
    }

    this._dialogRef.close(element);
  }


}
