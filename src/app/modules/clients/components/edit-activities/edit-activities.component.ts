import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../../../models/User.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';
import { LoginService } from '../../../../services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-activities',
  templateUrl: './edit-activities.component.html',
  styleUrls: ['./edit-activities.component.scss']
})
export class EditActivitiesComponent implements OnInit {

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
    private _dialogRef: MatDialogRef<EditActivitiesComponent>,
    private _users: UsersService,
    private _loginService: LoginService,
    private _spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public activity: any
  ) {
    this._spinner.show()
    this.getUsers()
    this.user = _loginService.user
    console.log(this.activity);

  }

  ngOnInit(): void {
    this.activityForm.controls['assignment'].valueChanges.subscribe((inputValue:any) => {
      this.filterData(inputValue)
    })
  }


  initValuesForm(){
    const findUser = this.users.find((element:any) => element._id === this.activity.assignment)
    this.activityForm.controls['assignment'].setValue(findUser)

    this.activityForm.patchValue({
      type_activity: this.activity.type_activity,
      date_expiration: new Date(this.activity.date_expiration),
      summary: this.activity.summary,
      note: this.activity.note,
      type: this.activity.type,
    })
    this._spinner.hide()
  }

  getUsers(){
    this._users.getUsers().subscribe((users: User[]) => {
      this.users = users
      this.initValuesForm()
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
      status: 'DRAFT',
      _id: this.activity._id
    }

    this._dialogRef.close(element);
  }


}
