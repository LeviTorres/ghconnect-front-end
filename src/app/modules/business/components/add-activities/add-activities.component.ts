import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../models/User.model';
import { UsersService } from '../../../../services/users.service';

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
    private _users: UsersService
  ) {
    this.getUsers()
  }

  ngOnInit(): void {
    this.activityForm.controls['assignment'].valueChanges.subscribe((inputValue:any) => {
      this.filterData(inputValue)
    })
  }

  getUsers(){
    this._users.getUsers().subscribe((users: User[]) => {
      this.users = users
      console.log(this.users);

    })
  }

  displayFn(user: User): string {
    return user && `${user.email}`
      ? `${user.email}`
      : '';
  }

  filterData(value: string) {
    this.filteredOptions = this.users.filter((item: any) => {
      console.log(item);
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
      date_expiration: new Date(this.activityForm.controls['date_expiration'].value).getTime()
    }
    this._dialogRef.close(element);
  }

}
