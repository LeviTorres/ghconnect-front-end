import { Component, OnInit } from '@angular/core';
import { Business } from '../../../../../models/Business.model';
import { Ceco } from '../../../../../models/Ceco.model';
import { Divisa } from '../../../../../models/Divisa.model';
import { User } from '../../../../../models/User.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from '../../../../../services/business.service';
import { UsersService } from '../../../../../services/users.service';
import { DivisasService } from '../../../../../services/divisas.service';
import { CecosService } from '../../../../../services/cecos.service';
import { FinaceRequestService } from '../../../../../services/finace-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailsService } from '../../../../../services/emails.service';
import { MatDialog } from '@angular/material/dialog';
import { FinaceRequest } from '../../../../../models/FinaceRequest.model';
import { ModalUsersComponent } from '../../../../users/components/modal-users/modal-users.component';
import { ClientsService } from '../../../../../services/clients.service';
import { ProvidersService } from '../../../../../services/providers.service';
import { Client } from 'src/app/models/Client.model';
import { Provider } from '../../../../../models/Provider.model';
import { TokensService } from '../../../../../services/tokens.service';

@Component({
  selector: 'app-edit-finace-request',
  templateUrl: './edit-finace-request.component.html',
  styleUrls: ['./edit-finace-request.component.scss']
})
export class EditFinaceRequestComponent implements OnInit {
  public id_user!: any
  public finaceRequest!: FinaceRequest
  public business: Business[] = []
  public clients: Client[] = []
  public providers: Provider[] = []
  public cecos: Ceco[] = []
  public divisas: Divisa[] = []
  public arrays: any[] = []
  public authorizers: any[] = [];
  public date: any
  public filteredOptionsPayer: any[] = []
  public activities: any;
  public tokens: any[] = []

  public dynamicArray: Array<any> = [];
  public newDynamic: any = {};
  public indice: number = 0;
  public validate_user: boolean = true

  public addUser: boolean = false;
  public users: User[] = []
  public filteredOptions: any[] = [];

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
    private _clientService: ClientsService,
    private _providerService:ProvidersService,
    private _divisaService: DivisasService,
    private _cecoService:CecosService,
    private _finaceService: FinaceRequestService,
    private _router: Router,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private _emailService: EmailsService,
    private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _tokenService: TokensService
  ) {
    this._spinner.show()
    this.id_user = JSON.parse(atob(this._userService.token.split('.')[1])).uid;
    this.getBusiness()
    this.getCecos()
    this.getUsers()
    this.getDivisas()
    this.getTokens()
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((id:any) => {
      this.getFinaceRequest(id.id)
    })
    this.finaceForm.controls['creation_date'].disable()
    this.finaceForm.controls['equivalent_value'].disable()
    this.finaceForm.controls['policy_validity'].disable()
    this.finaceForm.controls['business'].disable()
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
    this.finaceForm.controls['payer'].valueChanges.subscribe((inputValue: any) => {
      this.filterDataPayer(inputValue)
    })
    //Autocompletado autorizadores
    this.userForm.controls['user'].valueChanges.subscribe((inputValue: any) => {
      this.validateUser()
      this.filterData(inputValue)
    })
    setTimeout(() => {
      this.getClients()
      this.getProviders()
    }, 2000);
  }

  getTokens(){
    this._tokenService.getTokens().subscribe((tokens:any) => {
      this.tokens = tokens
    })
  }

  getFinaceRequest(id:any){
    this._finaceService.getFinaceRequest().subscribe((finacesRequest:any) => {
      this.finaceRequest = finacesRequest.find((finaceRequest: FinaceRequest) =>
        finaceRequest._id === id
      )
    })
  }

  initValuesForm(){
    const findPayer = this.arrays.find((element: any) => element._id === this.finaceRequest.payer)
    this.finaceForm.patchValue({
      key_policy: this.finaceRequest.key_policy,
      creation_date: new Date(this.finaceRequest.creation_date),
      policy_type: this.finaceRequest.policy_type,
      ceco: this.finaceRequest.ceco._id,
      business: this.finaceRequest.business._id,
      payer: findPayer,
      beneficiary: this.finaceRequest.beneficiary,
      main_contract_value: this.finaceRequest.main_contract_value,
      divisa_main_value: this.finaceRequest.divisa_main_value._id,
      guaranteed_sum: this.finaceRequest.guaranteed_sum,
      divisa_guaranteed_sum: this.finaceRequest.divisa_guaranteed_sum._id,
      equivalent_value: this.finaceRequest.equivalent_value,
      start_date: new Date(this.finaceRequest.start_date),
      finish_date: new Date(this.finaceRequest.finish_date),
      policy_validity: this.finaceRequest.policy_validity,
      insurance_object: this.finaceRequest.insurance_object,
      process_execution: this.finaceRequest.process_execution,
      premium_pay: this.finaceRequest.premium_pay,
      payment_conditions: this.finaceRequest.payment_conditions
    })

    for (
      let index = 0;
      index < this.finaceRequest.authorizers.length;
      index++
    ) {
      this.authorizers.push({
        user: this.finaceRequest.authorizers[index].user._id,
        required: this.finaceRequest.authorizers[index].required,
        status: this.finaceRequest.authorizers[index].status,
        message: this.finaceRequest.authorizers[index].message,
      });
    }

    this.activities = this.finaceRequest.history;

    this._spinner.hide()
  }

  getBusiness() {
    this._businessService.getBusiness().subscribe((business: Business[]) => {
      this.business = business;
    });
  }

  getClients(){
    this._clientService.getClients().subscribe((clients:Client[]) => {
      this.clients = clients
      this.arrays = [...this.clients, ...this.providers, ...this.business]
      this.initValuesForm()
    })
  }

  getProviders(){
    this._providerService.getProviders().subscribe((providers: Provider[]) => {
      this.providers = providers
    })
  }

  getCecos(){
    this._cecoService.getCecos().subscribe((cecos: Ceco[]) => {
      this.cecos = cecos
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

    this.activities.push({
      action: 'Actualizacion de solicitud de Seguro/Fianzas',
      date: new Date().getTime(),
      user: this.id_user,
    });

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
      ceco: this.finaceForm.controls['ceco'].value,
      payer: this.finaceForm.controls['payer'].value._id,
      policy_validity: this.finaceForm.controls['policy_validity'].value,
      history: this.activities,
    };

    await this._finaceService.updateFinaceRequest(element, this.finaceRequest._id!).subscribe(
      (res: any) => {
        this._router.navigateByUrl('/approvals/approvals-finace');
        this._spinner.hide();
        this._toastr.success('Solicitud de Seguros/Fianzas actualizada con Exito');
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

    this.activities.push({
      action: 'Cambio de Estado Por enviar -> Enviado',
      date: new Date().getTime(),
      user: this.id_user,
    });

    for (let index = 0; index < this.authorizers.length; index++) {
      this.authorizers[index].status = 'SEND'
    }

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
      ceco: this.finaceForm.controls['ceco'].value,
      payer: this.finaceForm.controls['payer'].value._id,
      policy_validity: this.finaceForm.controls['policy_validity'].value,
      history: this.activities,
      status: 'SEND',
    };
    await this._finaceService.updateFinaceRequest(element, this.finaceRequest._id!).subscribe(
      (res: any) => {
        this._router.navigateByUrl('/approvals/approvals-finace');
        this._spinner.hide();
        this._toastr.success('Solicitud de Seguro/fianzas enviada con Exito');

        for (let index = 0; index < this.authorizers.length; index++) {
          const element = {
            to: this.authorizers[index].user,
            request: res.finaceRequestUpdated,
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
          this.userForm.controls['user'].value
      );
      if (findUser) {
        this.validate_user = true
        user = findUser;
      } else {
        this.validate_user = false
      }
    }
  }

  getUser(user_data?: any) {
    const findUser = this.users.find((user: User) => user._id === user_data._id)
    return {
      name: findUser?.name,
      last_name: findUser?.last_name
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
      const user: any = {
        email: data.email,
        last_name: data.last_name,
        name: data.name,
        getImage: ''
      }
      this.users.push(user)
      this.userForm.controls['user'].setValue(data.email)
    })
  }

  getStatus(status: string) {
    if (status === 'SEND') {
      return 'Enviado';
    } else if (status === 'PASSED') {
      return 'Aprobado';
    } else if (status === 'REFUSED') {
      return 'Rechazado';
    } else if (status === 'CANCELLED') {
      return 'Cancelado';
    }
    return;
  }

  async updatedToSend() {
    this._spinner.show();
    this.activities.push({
      action: `Cambio de Estado ${this.getStatus(
        this.finaceRequest.status
      )} -> Por enviar`,
      date: new Date().getTime(),
      user: this.id_user,
    });

    for (let index = 0; index < this.authorizers.length; index++) {
      this.authorizers[index].status = '';
    }

    const element = {
      ...this.finaceForm.value,
      authorizers: this.authorizers,
      start_date: new Date(
        this.finaceForm.controls['start_date'].value
      ).getTime(),
      finish_date: new Date(
        this.finaceForm.controls['finish_date'].value
      ).getTime(),
      creation_date: new Date(
        this.finaceForm.controls['creation_date'].value
      ).getTime(),
      business: this.finaceForm.controls['business'].value,
      main_contract_value: Number(this.finaceForm.controls['main_contract_value'].value),
      guaranteed_sum: Number(this.finaceForm.controls['guaranteed_sum'].value),
      equivalent_value: Number(this.finaceForm.controls['equivalent_value'].value),
      premium_pay: Number(this.finaceForm.controls['premium_pay'].value),
      ceco: this.finaceForm.controls['ceco'].value,
      payer: this.finaceForm.controls['payer'].value._id,
      policy_validity: this.finaceForm.controls['policy_validity'].value,
      history: this.activities,
      status: 'TOSEND',
    };

    await this._finaceService
      .updateFinaceRequest(element, this.finaceRequest._id!)
      .subscribe(
        (res: any) => {
          this._router.navigateByUrl('/approvals/approvals-finace');
          this._spinner.hide();
          this._toastr.success('Solicitud de Seguros/Fianzas actualizada con Exito');
          for (let index = 0; index < this.finaceRequest.authorizers.length; index++) {

            const findToken = this.tokens.find((token: any) => token.user.email === this.finaceRequest.authorizers[index].user.email)
            if(findToken){
              this._tokenService.deleteToken(findToken).subscribe(() => {

              })
            }
          }
        },
        (err: any) => {
          this._spinner.hide();
          console.warn(err.error.msg);
          this._toastr.error(`${err.error.msg}`);
        }
      );
  }


  getEmailAuthorizer(id: string){
    const findAuthorizer = this.users.find((user: User) => user._id === id)
    return findAuthorizer?.email
  }

  validateBusiness(input:any){
    const findCeco = this.cecos.find((business:Ceco) => business._id === input)
    this.finaceForm.controls['business'].setValue(findCeco?.business?._id)
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

  displayFnPayer(user: any): string {
    return user && `${user.name}`
      ? `${user.name}`
      : '';
  }

  filterDataPayer(value: string) {
    this.filteredOptionsPayer = this.arrays.filter((item: any) => {
      this.displayFnPayer(item);
      return (
        item.name.toLowerCase().indexOf(value) > -1
      );
    });
  }

}
