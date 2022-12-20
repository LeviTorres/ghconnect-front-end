import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { BusinessService } from '../../../../../services/business.service';
import { Business } from '../../../../../models/Business.model';
import { User } from '../../../../../models/User.model';
import { UsersService } from '../../../../../services/users.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TravelRequestService } from '../../../../../services/travel-request.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { empty } from 'rxjs';
import { EmailsService } from '../../../../../services/emails.service';
import { TravelRequest } from '../../../../../models/TravelRequest.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsersComponent } from '../../../../users/components/modal-users/modal-users.component';

@Component({
  selector: 'app-add-travel-request',
  templateUrl: './add-travel-request.component.html',
  styleUrls: ['./add-travel-request.component.scss'],
})
export class AddTravelRequestComponent implements OnInit {
  public id_user!: any
  public business: Business[] = [];
  public authorizers: any[] = [];
  public date: any

  public dynamicArray: Array<any> = [];
  public newDynamic: any = {};
  public indice: number = 0;
  public validate_user: boolean = true

  public addUser: boolean = false;
  public users: User[] = []
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
  });

  public userForm: FormGroup = new FormGroup({
    user: new FormControl('', Validators.required),
    required: new FormControl(false),
    message: new FormControl(''),
  });

  constructor(
    private _businessService: BusinessService,
    private _userService: UsersService,
    private _travelService: TravelRequestService,
    private _router: Router,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private _emailService: EmailsService,
    private _dialog: MatDialog
  ) {
    this.id_user = JSON.parse(atob(this._userService.token.split('.')[1])).uid;

  }

  ngOnInit(): void {
    this.date = new Date();
    this.travelForm.controls['travel_date'].setValue(this.date);
    this.travelForm.controls['travel_date'].disable();
    this.getBusiness();
    this.getUsers();

    //Autocompletado autorizadores
    this.userForm.controls['user'].valueChanges.subscribe((inputValue: any) => {
      this.validateUser()
      this.filterData(inputValue)
    })

  }

  getBusiness() {
    this._businessService.getBusiness().subscribe((business: Business[]) => {
      this.business = business;
    });
  }

  getUsers() {
    this._userService.getUsers().subscribe((users: any) => {
      this.users = users;
    });
  }

  delete(i: any) {
    this.authorizers.splice(i, 1);
  }

  returnTable() {
    this.addUser = false;
    this.userForm.reset()
  }

  addRow() {
    this.addUser = true;
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
    console.log('user',user);

    this.authorizers.push({
      ...this.userForm.value,
      user: user._id
    });
    this.userForm.reset()
    this.addUser = false;
  }

  async registerTravel() {
    this._spinner.show();

    const history_data = {
      action: 'Solicitud de viaje creada',
      date: new Date().getTime(),
      user: this.id_user,
    };

    const element: TravelRequest = {
      ...this.travelForm.value,
      authorizers: this.authorizers,
      departure_date: new Date(
        this.travelForm.controls['departure_date'].value
      ).getTime(),
      return_date: new Date(
        this.travelForm.controls['return_date'].value
      ).getTime(),
      history: history_data,
    };

    await this._travelService.createTravelRequest(element).subscribe(
      (res: any) => {
        this._router.navigateByUrl('/approvals/approvals-travel');
        this._spinner.hide();
        this._toastr.success('Solicitud de viaje creada con Exito');
      },
      (err: any) => {
        this._spinner.hide();
        console.warn(err.error.msg);
        this._toastr.error(`${err.error.msg}`);
      }
    );
  }

  async sendRequest() {
    this._spinner.show();
    console.log(this.authorizers);

    const validateAuthorizer = this.authorizers.find((authorizer: any) => authorizer.required === true)
    console.log(validateAuthorizer);

    if(!validateAuthorizer){
      this._spinner.hide()
      this._toastr.warning('Selecciona al menos un autorizador requerido')
      return
    }

    if(this.authorizers.length <= 0){
      this._spinner.hide()
      this._toastr.warning('Selecciona al menos un autorizador')
      return
    }

    const history_data = [
      {
        action: 'Solicitud de viaje creada',
        date: new Date().getTime(),
        user: this.id_user,
      },
      {
        action: 'Cambio de Estado Por enviar -> Enviado',
        date: new Date().getTime(),
        user: this.id_user,
      }
    ];

    const element: TravelRequest = {
      ...this.travelForm.value,
      authorizers: this.authorizers,
      departure_date: new Date(
        this.travelForm.controls['departure_date'].value
      ).getTime(),
      return_date: new Date(
        this.travelForm.controls['return_date'].value
      ).getTime(),
      status: 'SEND',
      history: history_data
    };
    await this._travelService.createTravelRequest(element).subscribe(
      (res: any) => {
        this._router.navigateByUrl('/approvals/approvals-travel');
        this._spinner.hide();
        this._toastr.success('Solicitud de viaje enviada con Exito');
        for (let index = 0; index < this.authorizers.length; index++) {
          const element = {
            to: this.authorizers[index].user,
            request: res.travel,
          };
          this._emailService.sendEmail(element).subscribe((resp: any) => { });
        }
      },
      (err: any) => {
        this._spinner.hide();
        console.warn(err.error.msg);
        this._toastr.error(`${err.error.msg}`);
      }
    );
  }

  //Autocompletado autorizadores
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

  getUser() {
    const findUser = this.users.find((user: User) => user._id === this.id_user)
    return {
      name: findUser!.name,
      last_name: findUser!.last_name
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


  getEmailAuthorizer(id: string){
    const findAuthorizer = this.users.find((user: User) => user._id === id)
    return findAuthorizer?.email
  }
}
