import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelRequestService } from '../../../../services/travel-request.service';
import { TravelRequest } from '../../../../models/TravelRequest.model';
import { User } from '../../../../models/User.model';
import { Business } from '../../../../models/Business.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from '../../../../services/business.service';
import { UsersService } from '../../../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailsService } from '../../../../services/emails.service';
import { ModalUsersComponent } from '../../../users/components/modal-users/modal-users.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-travel-request',
  templateUrl: './edit-travel-request.component.html',
  styleUrls: ['./edit-travel-request.component.scss']
})
export class EditTravelRequestComponent implements OnInit {

  public id: string = ''
  public travelRequest!: TravelRequest
  public id_user: string = ''

  public business: Business[] = []
  public authorizers: any[] = []
  public activities: any
  public validate_user: boolean = true
  public dynamicArray: Array<any> = []
  public newDynamic: any = {}
  public indice: number = 0

  public addUser: boolean = false

  public users: User[] = []

  public showOption: boolean = false;
  public filteredOptions: any[] = [];

  public travelForm: FormGroup = new FormGroup({
    travel_date: new FormControl('', Validators.required),
    key_employee: new FormControl('', Validators.required),
    name_applicant: new FormControl('', Validators.required),
    business: new FormControl('', Validators.required),
    cost_center: new FormControl('', Validators.required),
    departure_date: new FormControl('', Validators.required),
    return_date: new FormControl('', Validators.required),
    origin_city: new FormControl('', Validators.required),
    destination_city: new FormControl('', Validators.required),
    reason_trip: new FormControl('', Validators.required),
    lodging: new FormControl(false),
    vehicle: new FormControl(false),
    observations: new FormControl(),
  })

  public userForm: FormGroup = new FormGroup({
    user: new FormControl('', Validators.required),
    required: new FormControl(false),
    message: new FormControl('')
  })

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _travelRequestService: TravelRequestService,
    private _businessService: BusinessService,
    private _userService: UsersService,
    private _router: Router,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private _emailService: EmailsService,
    private _dialog: MatDialog
  ) {
    this.id_user = JSON.parse(atob(this._userService.token.split('.')[1])).uid
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((id: any) => {
      this.getTravelRequest(id.id)
    })
    this.travelForm.controls['travel_date'].disable();
    this.getBusiness()
    this.getUsers()
    //Autocompletado autorizadores
    this.userForm.controls['user'].valueChanges.subscribe((inputValue: any) => {
      this.validateUser()
      this.filterData(inputValue)
    })
  }

  getBusiness() {
    this._businessService.getBusiness().subscribe((business: Business[]) => {
      this.business = business
    })
  }

  getUsers() {
    this._userService.getUsers().subscribe((users: any) => {
      this.users = users
    })
  }

  delete(i: any) {
    this.authorizers.splice(i, 1)
  }

  returnTable() {
    this.addUser = false
  }

  addRow() {
    this.addUser = true
  }

  registerUser() {
    if (this.userForm.invalid) {
      return
    }
    let user: any
    const userSelect = this.userForm.controls['user'].value
    if (userSelect._id) {
      user = userSelect;
      this.validate_user = true
    } else {
      const findUser = this.users.find(
        (user: User) =>
          user.email.trim().toLowerCase() ===
          this.userForm.controls['user'].value?.trim().toLowerCase()
      );
      if (findUser) {
        this.validate_user = true
        user = findUser;
      } else {
        this.validate_user = false
      }
    }
    if (!this.validate_user) {
      this._toastr.warning('Usuario no existe', 'Seleccione un usuario existente')
      return
    }



    const repeatUser = this.authorizers.find((data: any) => data.user === user.email)
    if (repeatUser) {
      this._toastr.warning('Usuario previamente seleccionado', 'Seleccione un usuario distinto')
      return
    }
    this.authorizers.push({
      ...this.userForm.value,
      user: user.email
    });
    this.userForm.reset()
    this.addUser = false;
  }

  getTravelRequest(id: string) {
    this._travelRequestService.getTravelRequest().subscribe((travelsRequest: any) => {
      this.travelRequest = travelsRequest.find((travelRequest: TravelRequest) => travelRequest._id === id)
      this.initValuesForm()
    })
  }

  initValuesForm() {
    this.travelForm.patchValue({
      key_employee: this.travelRequest.key_employee,
      name_applicant: this.travelRequest.name_applicant,
      business: this.travelRequest.business._id,
      cost_center: this.travelRequest.cost_center,
      departure_date: new Date(this.travelRequest.departure_date),
      travel_date: new Date(this.travelRequest.createdAt!),
      return_date: new Date(this.travelRequest.return_date),
      origin_city: this.travelRequest.origin_city,
      destination_city: this.travelRequest.destination_city,
      reason_trip: this.travelRequest.reason_trip,
      lodging: this.travelRequest.lodging,
      vehicle: this.travelRequest.vehicle,
      observations: this.travelRequest.observations,

    })
    this.authorizers = this.travelRequest.authorizers
    this.activities = this.travelRequest.history
  }

  async registerTravel() {
    this._spinner.show()
    this.activities.push({
      action: 'Actualizacion de solicitud de viaje',
      date: new Date().getTime(),
      user: this.id_user
    })
    const element = {
      ...this.travelForm.value,
      authorizers: this.authorizers,
      departure_date: new Date(this.travelForm.controls['departure_date'].value).getTime(),
      return_date: new Date(this.travelForm.controls['return_date'].value).getTime(),
      history: this.activities
    }

    await this._travelRequestService.updateTravelRequest(element, this.travelRequest._id!)
      .subscribe((res: any) => {
        this._router.navigateByUrl('/approvals/approvals-travel')
        this._spinner.hide()
        this._toastr.success('Solicitud de viaje actualizada con Exito')
      }, (err: any) => {
        this._spinner.hide()
        console.warn(err.error.msg)
        this._toastr.error(`${err.error.msg}`)
      })

  }

  async sendRequest() {
    this._spinner.show()
    const validateAuthorizer = this.authorizers.find((authorizer: any) => authorizer.required === true)
    if (!validateAuthorizer) {
      this._spinner.hide()
      this._toastr.warning('Selecciona al menos un autorizador requerido')
      return
    }

    if (this.authorizers.length <= 0) {
      this._spinner.hide()
      this._toastr.warning('Selecciona al menos un autorizador')
      return
    }

    this.activities.push(
      {
        action: 'Cambio de Estado Por enviar -> Enviado',
        date: new Date().getTime(),
        user: this.id_user,
      }
    )

    const element = {
      ...this.travelForm.value,
      authorizers: this.authorizers,
      departure_date: new Date(this.travelForm.controls['departure_date'].value).getTime(),
      return_date: new Date(this.travelForm.controls['return_date'].value).getTime(),
      status: 'SEND',
      history: this.activities
    }
    await this._travelRequestService.updateTravelRequest(element, this.travelRequest._id!)
      .subscribe((res: any) => {
        console.log('res', res);

        this._router.navigateByUrl('/approvals/approvals-travel')
        this._spinner.hide()
        this._toastr.success('Solicitud de viaje enviada con Exito')
        for (let index = 0; index < this.authorizers.length; index++) {
          const element = {
            to: this.authorizers[index].user,
            id_request: res.travelRequestUpdated
          }
          this._emailService.sendEmail(element).subscribe(() => {
          })
        }
      }, (err: any) => {
        this._spinner.hide()
        console.warn(err.error.msg)
        this._toastr.error(`${err.error.msg}`)
      })
  }

  async updatedToSend() {
    this._spinner.show()
    this.activities.push(
      {
        action: `Cambio de Estado ${this.getStatus(this.travelRequest.status)} -> Por enviar`,
        date: new Date().getTime(),
        user: this.id_user,
      }
    )

    const element = {
      ...this.travelForm.value,
      authorizers: this.authorizers,
      departure_date: new Date(this.travelForm.controls['departure_date'].value).getTime(),
      return_date: new Date(this.travelForm.controls['return_date'].value).getTime(),
      history: this.activities,
      status: 'TOSEND'
    }

    await this._travelRequestService.updateTravelRequest(element, this.travelRequest._id!)
      .subscribe((res: any) => {
        this._router.navigateByUrl('/approvals/approvals-travel')
        this._spinner.hide()
        this._toastr.success('Solicitud de viaje actualizada con Exito')
      }, (err: any) => {
        this._spinner.hide()
        console.warn(err.error.msg)
        this._toastr.error(`${err.error.msg}`)
      })
  }

  getUser(user_data: string) {
    const findUser = this.users.find((user: User) => user._id === user_data)
    return {
      name: findUser!.name,
      last_name: findUser!.last_name
    }
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

  validateUser() {
    let user: any;
    const userSelect: any = this.userForm.controls['user'].value;
    if (userSelect._id) {
      user = userSelect;
      this.validate_user = true
    } else {
      const findUser = this.users.find(
        (user: User) =>
          user.email.trim().toLowerCase() ===
          this.userForm.controls['user'].value?.trim().toLowerCase()
      );
      if (findUser) {
        this.validate_user = true
        user = findUser;
      } else {
        this.validate_user = false
      }
    }
  }

  createUser(value: string) {
    this.userForm.reset()
    let dialogRef = this._dialog.open(ModalUsersComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: value
    });
    dialogRef.beforeClosed().subscribe((data: any) => {
      console.log('data', data);

      const user: User = {
        email: data.email,
        last_name: data.last_name,
        name: data.name,
        getImage: ''
      }
      console.log(user);
      this.users.push(user)
      console.log(this.users);

      //this.filteredOptions.push(user)
      //console.log(this.filteredOptions);

      this.userForm.controls['user'].setValue(data.email)
      //this.displayFn(user)
    })
  }


  getStatus(status: string) {
    if (status === 'SEND') {
      return 'Enviado'
    } else if (status === 'PASSED') {
      return 'Aprobado'
    } else if (status === 'REFUSED') {
      return 'Rechazado'
    } else if (status === 'CANCELLED') {
      return 'Cancelado'
    }
    return
  }
}
