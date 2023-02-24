import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvidersService } from '../../../../services/providers.service';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../../../../services/clients.service';
import { Client } from '../../../../models/Client.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../models/User.model';
import { AddActivitiesComponent } from '../../components/add-activities/add-activities.component';
import { AddFollowersComponent } from '../../components/add-followers/add-followers.component';
import { EditActivitiesComponent } from '../../components/edit-activities/edit-activities.component';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {
  public client:any;

  public payment_conditions: any;

  public third_types_array: any[] = [
    { name: 'Proveedor' },
    { name: 'Intercompañia' },
    { name: 'Empleado' }
  ]

  public society_types_array: any[] = [
    { name: 'Natural' },
    { name: 'Unipersonal' },
    { name: 'Juridica' }
  ]

  public provider_array: any[] = [
    { name: 'Nacional' },
    { name: 'Extranjero' }
  ]

  public users: any[] = []
  public user: any
  public history: any[] = []
  public flagNote: boolean = false
  public activitiesPlan: any[] = []
  public followers: any[] = []
  public letterNames: string = ''

  public formActivity: FormControl = new FormControl('')

  public providerForm = this._fb.group({
    key_client: [ '', Validators.required ],
    name: [ '', Validators.required ],
    nit: ['', Validators.required ],
    third_type: ['', Validators.required ],
    society_type: ['', Validators.required ],
    provider_type: ['', Validators.required ],
    phone_number: ['', Validators.required ],
    mobile_number: ['', Validators.required ],
    email: ['', [ Validators.required, Validators.email ] ],
    payment_conditions: ['', Validators.required ],
  })
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _clientService: ClientsService,
    private _fb: FormBuilder,
    private _paymentConditionsService: PaymentConditionsService,
    private _spinner: NgxSpinnerService,
    private _toastr:ToastrService,
    private _router: Router,
    private _loginService: LoginService,
    private _dialog: MatDialog,
    private _userService: UsersService
  ) {
    this.user = _loginService.user
    this.letterNames = `${this.user.name.charAt(0).toUpperCase()}`;
   }

  ngOnInit(): void {
    this._spinner.show()
    this.getUsers()
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this.getClients(params.client)
    })
    this.getPaymentConditions()
  }

  public initValuesForm(){
    this._spinner.show()
    this.providerForm.patchValue({
      key_client: this.client.key_client,
      name: this.client.name,
      nit: this.client.nit,
      third_type: this.client.third_type,
      society_type: this.client.society_type,
      phone_number: this.client.phone_number,
      mobile_number: this.client.mobile_number,
      email: this.client.email,
      provider_type: this.client.provider_type,
      payment_conditions: this.client.payment_conditions._id
    })
    this.history = [...this.client.activities]
    this.followers = [...this.client.followers!]
  }

  getPaymentConditions(){
    this._spinner.show()
    this._paymentConditionsService.getPaymentConditions().subscribe((item:any) => {
      this.payment_conditions = item
      this._spinner.hide()
    })
  }

  getClients(id: string){
    this._spinner.show()
    this._clientService.getClients().subscribe((clients:Client[]) => {
      this.client = clients.find((client: Client) => client._id === id)
      this.initValuesForm()
      this._spinner.hide()
    })
  }

  registerClient(){
    this._spinner.show()
      if(this.providerForm.invalid){
        this._spinner.hide()
        return
      }
      const element = {
        ...this.providerForm.value,
      }

      this._clientService.updateClient(element, this.client._id)
        .subscribe(( res:any ) => {
          this._router.navigateByUrl('/clients')
          this._spinner.hide()
          this._toastr.success('Cliente actualizado con Exito')
        }, (err:any) =>{
          this._spinner.hide()
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

  getUsers() {
    this._userService.getUsers().subscribe((resp: User[]) => {
      this.users = resp
    })
  }

  getUser(id: any) {
    const findUser: any = this.users.find((user: any) => user._id === id)
    return {
      name: findUser?.name,
      last_name: findUser?.last_name
    }
  }
  getUserInitial(id: any) {
    const findUser: any = this.users.find((user: any) => user._id === id)
    return findUser?.name.charAt(0).toUpperCase()
  }

  addNote() {
    const value = this.formActivity.value.trim()

    if (value.length <= 0) {
      this._toastr.warning('Es obligatorio escribir una nota')
      return
    }

    this.history.push({
      note: this.formActivity.value,
      date: new Date().getTime(),
      type: 'note',
      user: this.user._id
    })

    const element = {
      activities: [
        ...this.history
      ]
    }

    this._clientService.updateClient(element, this.client._id!).subscribe((resp: any) => { })

    this.formActivity.setValue('')
  }

  openDialogAddActivity() {
    let dialogRef = this._dialog.open(AddActivitiesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe((resp: any) => {
      console.log('resp after dialog', resp);
      if (resp) {
        const element1 = {
          ...resp
        }
        this.history.push(element1)
        console.log('this.history', this.history);
        const element = {
          activities: [
            ...this.history
          ]
        }

        this._clientService.updateClient(element, this.client._id!).subscribe((resp: any) => { })
        this.viewActivitiesPlan()
      }
    })
  }

  viewActivitiesPlan() {
    let findActivity: any
    findActivity = this.history.filter((element: any) => {
      return element.type === 'activity' && element.status === 'DRAFT'
    })

    if (findActivity) {
      this.activitiesPlan = findActivity
    }
  }

  deleteFollower(index: any) {
    this.followers.splice(index, 1);
    const element = {
      followers: [...this.followers],
    }
    this._clientService.updateClient(element, this.client._id!).subscribe((resp: Client) => {
      this.followers = [...resp.followers!]
    })
  }

  openDialogAddFollower() {
    let dialogRef = this._dialog.open(AddFollowersComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: {
        followers: this.followers,
        client: this.client
      }
    });
    dialogRef.beforeClosed().subscribe((resp: any) => {
      console.log('resp after dialog', resp);
      if (resp) {
        const element = {
          followers: [...this.followers, resp],
        }
        this._clientService.updateClient(element, this.client._id!).subscribe((resp: Client) => {
          this.followers = [...resp.followers!]
        })
      }
    })
  }

  goToEditActivity(id: string) {
    console.log(id);
    let dialogRef = this._dialog.open(EditActivitiesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: id
    })
    dialogRef.beforeClosed().subscribe((resp: any) => {
      console.log('resp after dialog', resp);
      if (resp) {
        const element1 = {
          ...resp
        }

        const findIndexActivity = this.history.findIndex((element: any) => element._id === element1._id)

        this.history[findIndexActivity] = element1

        const element = {
          activities: [
            ...this.history
          ]
        }

        this._clientService.updateClient(element, this.client._id!).subscribe((resp: Client) => {
          this.history = [...resp.activities!]
        })
        this.viewActivitiesPlan()
      }
    })
  }

  cancelActivity(data: any) {
    const findActivity = this.history.findIndex((element: any) => element._id === data._id)
    this.history.splice(findActivity, 1)
    const element = {
      activities: [
        ...this.history
      ]
    }
    this._clientService.updateClient(element, this.client._id!).subscribe((resp: Client) => {
      this.history = [...resp.activities!]
    })
    this.viewActivitiesPlan()
  }

  markActivityDone(data: any) {

    const findActivity = this.history.findIndex((element: any) => element._id === data._id)
    const element1 = {
      ...data,
      status: 'DONE',
      date: new Date().getTime(),
      user: this.user._id
    }
    this.history[findActivity] = element1
    const element = {
      activities: [
        ...this.history,
      ]
    }
    this._clientService.updateClient(element, this.client._id!).subscribe((resp: Client) => {
      this.history = [...resp.activities!]
    })
    this.viewActivitiesPlan()
  }

  viewNote() {
    this.flagNote = !this.flagNote
  }

}
