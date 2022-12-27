import { Component, OnInit } from '@angular/core';
import { Business } from '../../../../../models/Business.model';
import { User } from '../../../../../models/User.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from '../../../../../services/business.service';
import { UsersService } from '../../../../../services/users.service';
import { TravelRequestService } from '../../../../../services/travel-request.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailsService } from '../../../../../services/emails.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsersComponent } from '../../../../users/components/modal-users/modal-users.component';
import { DivisasService } from '../../../../../services/divisas.service';
import { Divisa } from '../../../../../models/Divisa.model';
import { Ceco } from '../../../../../models/Ceco.model';
import { CecosService } from '../../../../../services/cecos.service';
import { FinaceRequest } from '../../../../../models/FinaceRequest.model';
import { FinaceRequestService } from '../../../../../services/finace-request.service';
import { ClientsService } from '../../../../../services/clients.service';
import { ProvidersService } from '../../../../../services/providers.service';
import { Provider } from '../../../../../models/Provider.model';
import { Client } from '../../../../../models/Client.model';

@Component({
  selector: 'app-add-finace-request',
  templateUrl: './add-finace-request.component.html',
  styleUrls: ['./add-finace-request.component.scss']
})
export class AddFinaceRequestComponent implements OnInit {
  public id_user!: any
  public business: Business[] = []
  public cecos: Ceco[] = []
  public divisas: Divisa[] = []
  public providers:Provider[] = []
  public clients: Client[] = []
  public arrays: any[] = []
  public authorizers: any[] = [];
  public date: any

  public dynamicArray: Array<any> = [];
  public newDynamic: any = {};
  public indice: number = 0;
  public validate_user: boolean = true

  public addUser: boolean = false;
  public users: User[] = []
  public filteredOptions: any[] = [];
  public filteredOptionsPayer: any[] = []

  public finaceForm: FormGroup = new FormGroup({
    creation_date: new FormControl('', Validators.required),
    key_policy: new FormControl('', Validators.required),
    policy_type: new FormControl('', Validators.required),
    ceco: new FormControl('', Validators.required),
    business: new FormControl('', Validators.required),
    payer: new FormControl('', Validators.required),
    beneficiary: new FormControl('', Validators.required),
    main_contract_value: new FormControl('', Validators.required),
    divisa_main_value: new FormControl('', Validators.required),
    guaranteed_sum: new FormControl('', Validators.required),
    divisa_guaranteed_sum: new FormControl('', Validators.required),
    equivalent_value: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    finish_date: new FormControl('', Validators.required),
    policy_validity: new FormControl('', Validators.required),
    insurance_object: new FormControl('', Validators.required),
    process_execution: new FormControl('', Validators.required),
    premium_pay: new FormControl('', Validators.required),
    payment_conditions: new FormControl('', Validators.required),
  });

  public userForm: FormGroup = new FormGroup({
    user: new FormControl('', Validators.required),
    required: new FormControl(false),
    message: new FormControl(''),
  });

  constructor(
    private _businessService: BusinessService,
    private _userService: UsersService,
    private _divisaService: DivisasService,
    private _cecoService:CecosService,
    private _clientService: ClientsService,
    private _providerService: ProvidersService,
    private _finaceService: FinaceRequestService,
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
    this.finaceForm.controls['creation_date'].setValue(this.date)
    this.finaceForm.controls['creation_date'].disable()
    this.finaceForm.controls['equivalent_value'].disable()
    this.finaceForm.controls['policy_validity'].disable()
    this.finaceForm.controls['business'].disable()
    this.getUsers()
    this.getDivisas()
    this.getCecos()
    this.finaceForm.controls['ceco'].valueChanges.subscribe((inputValue:any) => {
      this.validateBusiness(inputValue)
    })
    this.finaceForm.controls['main_contract_value'].valueChanges.subscribe((value:any) => {
      this.valueEquivalent(value)
    })
    this.finaceForm.controls['start_date'].valueChanges.subscribe(() => {
      this.setValuePolicyValidity()
    })
    this.finaceForm.controls['finish_date'].valueChanges.subscribe(() => {
      this.setValuePolicyValidity()
    })
    //Autocompletado autorizadores
    this.userForm.controls['user'].valueChanges.subscribe((inputValue: any) => {
      this.validateUser()
      this.filterData(inputValue)
    })

    this.finaceForm.controls['payer'].valueChanges.subscribe((inputValue: any) => {
      this.filterDataPayer(inputValue)
    })
    this.getBusiness()

    setTimeout(() => {
      this.getClients()
      this.getProviders()
    }, 2000);
  }

  getBusiness() {
    this._businessService.getBusiness().subscribe((business: Business[]) => {
      this.business = business;
    });
  }

  getCecos(){
    this._cecoService.getCecos().subscribe((cecos: Ceco[]) => {
      this.cecos = cecos
    })
  }

  getProviders(){
    this._providerService.getProviders().subscribe((providers:Provider[]) => {
      this.providers = providers
      this.arrays = [...this.clients, ...this.providers, ...this.business]
      console.log(this.arrays);
    })
  }

  getClients(){
    this._clientService.getClients().subscribe((clients: Client[]) => {
      this.clients = clients
    })
  }

  getDivisas(){
    this._divisaService.getDivisas().subscribe((divisas: Divisa[]) => {
      this.divisas = divisas
    })
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

    this.authorizers.push({
      ...this.userForm.value,
      user: user._id
    });
    this.userForm.reset()
    this.addUser = false;
  }

  async registerFinace() {
    this._spinner.show();

    const history_data = {
      action: 'Solicitud de Seguros/Fianzas creada',
      date: new Date().getTime(),
      user: this.id_user,
    };

    const element: FinaceRequest = {
      ...this.finaceForm.value,
      authorizers: this.authorizers,
      creation_date: new Date(
        this.finaceForm.controls['creation_date'].value
      ).getTime(),
      start_date: new Date(
        this.finaceForm.controls['start_date'].value
      ).getTime(),
      finish_date: new Date(
        this.finaceForm.controls['finish_date'].value
      ).getTime(),
      business: this.finaceForm.controls['business'].value,
      main_contract_value: Number(this.finaceForm.controls['main_contract_value'].value),
      guaranteed_sum: Number(this.finaceForm.controls['guaranteed_sum'].value),
      equivalent_value: Number(this.finaceForm.controls['equivalent_value'].value),
      premium_pay: Number(this.finaceForm.controls['premium_pay'].value),
      payer: this.finaceForm.controls['payer'].value._id,
      ceco: this.finaceForm.controls['ceco'].value._id,
      policy_validity: this.finaceForm.controls['policy_validity'].value,
      history: history_data,
    };

    await this._finaceService.createFinaceRequest(element).subscribe(
      (res: any) => {
        this._router.navigateByUrl('/approvals/approvals-finace');
        this._spinner.hide();
        this._toastr.success('Solicitud de Seguros/Fianzas creada con Exito');
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

    const validateAuthorizer = this.authorizers.find((authorizer: any) => authorizer.required === true)

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
        action: 'Solicitud de Seguro/fianzas creada',
        date: new Date().getTime(),
        user: this.id_user,
      },
      {
        action: 'Cambio de Estado Por enviar -> Enviado',
        date: new Date().getTime(),
        user: this.id_user,
      }
    ];

    const element: FinaceRequest = {
      ...this.finaceForm.value,
      authorizers: this.authorizers,
      creation_date: new Date(
        this.finaceForm.controls['creation_date'].value
      ).getTime(),
      start_date: new Date(
        this.finaceForm.controls['start_date'].value
      ).getTime(),
      finish_date: new Date(
        this.finaceForm.controls['finish_date'].value
      ).getTime(),
      business: this.finaceForm.controls['business'].value,
      main_contract_value: Number(this.finaceForm.controls['main_contract_value'].value),
      guaranteed_sum: Number(this.finaceForm.controls['guaranteed_sum'].value),
      equivalent_value: Number(this.finaceForm.controls['equivalent_value'].value),
      premium_pay: Number(this.finaceForm.controls['premium_pay'].value),
      ceco: this.finaceForm.controls['ceco'].value._id,
      policy_validity: this.finaceForm.controls['policy_validity'].value,
      history: history_data,
      status: 'SEND',
    };
    await this._finaceService.createFinaceRequest(element).subscribe(
      (res: any) => {
        this._router.navigateByUrl('/approvals/approvals-finace');
        this._spinner.hide();
        this._toastr.success('Solicitud de Seguro/fianzas enviada con Exito');

        for (let index = 0; index < this.authorizers.length; index++) {
          const element = {
            to: this.authorizers[index].user,
            request: res.finace,
          };

          this._emailService.sendEmailFianceRequest(element).subscribe((resp: any) => { });
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

  displayFnPayer(user: any): string {
    return user && `${user.name}`
      ? `${user.name}`
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

  filterDataPayer(value: string) {
    this.filteredOptionsPayer = this.arrays.filter((item: any) => {
      this.displayFnPayer(item);
      return (
        item.name.toLowerCase().indexOf(value) > -1
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
      const user: User = {
        email: data.email,
        last_name: data.last_name,
        name: data.name,
        getImage: ''
      }
      this.users.push(user)
      this.userForm.controls['user'].setValue(data.email)
    })
  }


  getEmailAuthorizer(id: string){
    const findAuthorizer = this.users.find((user: User) => user._id === id)
    return findAuthorizer?.email
  }

  validateBusiness(input:any){
    this.finaceForm.controls['business'].setValue(input.business._id)
  }

  valueEquivalent(value:any){
    const valueEquivalence = (value*7)/100
    this.finaceForm.controls['equivalent_value'].setValue(valueEquivalence)
  }

  setValuePolicyValidity(){
    const start_date = new Date(this.finaceForm.controls['start_date'].value)
    const finish_date = new Date(this.finaceForm.controls['finish_date'].value)
    if(finish_date && start_date){
      const resta = finish_date.getTime() - start_date.getTime()
      if(resta >= 0){
        this.finaceForm.controls['policy_validity'].setValue(
          `${new Date(resta).getDate()} dias desde el ${start_date.getDate()} de ${this.getMonth(start_date.getMonth()+1)} ${start_date.getFullYear()} al ${finish_date.getDate()} de ${this.getMonth(finish_date.getMonth()+1)} ${finish_date.getFullYear()}`
        )
      }
    }
  }

  getMonth(month:any){
    if(month === 11){
      return 'Noviembre'
    }else if(month === 12){
      return 'Diciembre'
    }else if(month === 1){
      return 'Enero'
    }else if(month === 2){
      return 'Febrero'
    }else if(month === 3){
      return 'Marzo'
    }else if(month === 4){
      return 'Abril'
    }else if(month === 5){
      return 'Mayo'
    }else if(month === 6){
      return 'Junio'
    }else if(month === 7){
      return 'Julio'
    }else if(month === 8){
      return 'Agosto'
    }else if(month === 9){
      return 'Septiembre'
    }else if(month === 10){
      return 'Octubre'
    }
    return ''
  }

}
