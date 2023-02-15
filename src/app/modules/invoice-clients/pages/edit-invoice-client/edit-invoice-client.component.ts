import { Component, OnInit } from '@angular/core';
import { Divisa } from 'src/app/models/Divisa.model';
import { MovementType } from 'src/app/models/MovementType.model';
import { Client } from 'src/app/models/Client.model';
import { Ceco } from 'src/app/models/Ceco.model';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { InvoiceClientsService } from 'src/app/services/invoice-clients.service';
import { ClientsService } from 'src/app/services/clients.service';
import { CecosService } from 'src/app/services/cecos.service';
import { DivisasService } from 'src/app/services/divisas.service';
import { MovementsTypeService } from 'src/app/services/movements-type.service';
import { ToastrService } from 'ngx-toastr';
import { InvoiceClient } from 'src/app/models/InvoiceClients.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { formatDate } from '@angular/common';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../models/User.model';
import { LoginService } from '../../../../services/login.service';
import { AddActivitiesComponent } from '../../components/add-activities/add-activities.component';
import { MatDialog } from '@angular/material/dialog';
import { AddFollowersComponent } from '../../components/add-followers/add-followers.component';
import { EditActivitiesComponent } from '../../components/edit-activities/edit-activities.component';

@Component({
  selector: 'app-edit-invoice-client',
  templateUrl: './edit-invoice-client.component.html',
  styleUrls: ['./edit-invoice-client.component.scss']
})
export class EditInvoiceClientComponent implements OnInit {

  public invoiceClients: any
  public divisas: Divisa[] = []
  public movements: MovementType[] = []
  public clients: Client[] = []
  public cecos: Ceco[] = []
  public users: any[] = []
  public user:any
  public history: any[] = []
  public flagNote: boolean = false
  public activitiesPlan: any[] = []
  public followers: any[] = []
  public letterNames: string = ''

  public filteredOptions: any[] = [];
  public filteredOptionsCeco: any[] = [];

  public showOption: boolean = false;

  public formActivity: FormControl = new FormControl('')

  public invoiceForm = this._fb.group({
    ceco: ['', Validators.required],
    client: ['', Validators.required],
    key_invoice: ['', Validators.required],
    upload_date: ['', Validators.required],
    invoice_date: ['', Validators.required],
    expiration_date: ['', Validators.required],
    invoice_total: ['', Validators.required],
    divisa: ['', Validators.required],
    description: ['', Validators.required],
    movement_type: ['', Validators.required]
  })

  constructor(
    private _router: Router,
    private _invoiceClientsService: InvoiceClientsService,
    private _spinner: NgxSpinnerService,
    private _clientsService: ClientsService,
    private _cecosService: CecosService,
    private _divisasService: DivisasService,
    private _movementsService: MovementsTypeService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private _userService:UsersService,
    private _loginService:LoginService,
    private _dialog: MatDialog,
  ) {
    this.user = _loginService.user
    this.letterNames = `${this.user.name.charAt(0).toUpperCase()}`;
  }

  ngOnInit(): void {
    this._spinner.show()
    this.getCecos()
    this.getMovements()
    this.getDivisas()
    this.getClients()
    this.getUsers()
    this._activatedRoute.queryParams.subscribe((params: any) => {
      this.getInvoiceClients(params.invoice)
    })
    this.invoiceForm.controls['client'].valueChanges.subscribe((inputValue: any) => {
      this.filterData(inputValue)
    })
    this.invoiceForm.controls['ceco'].valueChanges.subscribe((inputValue: any) => {
      this.filterDataCeco(inputValue)
    })
  }

  public displayFn(client: any): string {
    return client && `${client.name}` ? `${client.name}` : '';
  }

  public displayFnCeco(ceco: any): string {
    return ceco && `${ceco.name_short}` ? `${ceco.name_short}` : '';
  }

  public filterData(value: string) {
    this.filteredOptions = this.clients.filter(item => {
      this.displayFn(item)
      return item.name.toLowerCase().indexOf(value) > -1 || item.key_client.toLowerCase().indexOf(value) > -1
    })
  }

  public filterDataCeco(value: string) {
    this.filteredOptionsCeco = this.cecos.filter(item => {
      this.displayFnCeco(item)
      return item.name_short.toLowerCase().indexOf(value) > -1 ||
        item.key_ceco_business.toLowerCase().indexOf(value) > -1
    })
  }

  public opcionSeleccionada($event: MatAutocompleteSelectedEvent) {
    this.showOption = true;
  }

  getInvoiceClients(id: any) {
    this._spinner.show()
    this._invoiceClientsService.getInvoiceClients().subscribe((invoices: InvoiceClient[]) => {
      this.invoiceClients = invoices.find((invoice: InvoiceClient) => invoice._id === id)
      this.initValueForm()
      this.viewActivitiesPlan()
      this._spinner.hide()
    })
  }

  initValueForm() {
    this._spinner.show()
    this.invoiceForm.patchValue({
      ceco: this.invoiceClients.ceco,
      client: this.invoiceClients.client,
      key_invoice: this.invoiceClients.key_invoice,
      upload_date: formatDate(this.invoiceClients.upload_date, 'yyyy-MM-dd', 'en'),
      invoice_date: formatDate(this.invoiceClients.invoice_date, 'yyyy-MM-dd', 'en'),
      expiration_date: formatDate(this.invoiceClients.expiration_date, 'yyyy-MM-dd', 'en'),
      invoice_total: this.invoiceClients.invoice_total,
      divisa: this.invoiceClients.divisa._id,
      description: this.invoiceClients.description,
      movement_type: this.invoiceClients.movement_type._id
    })
    this.history = [ ...this.invoiceClients.activities ]
    this.followers = [...this.invoiceClients.followers! ]
  }

  getMovements() {
    this._spinner.show()
    this._movementsService.getMovementsType().subscribe((item: any) => {
      this.movements = item
      this._spinner.hide()
    })
  }

  getCecos() {
    this._spinner.show()
    this._cecosService.getCecos().subscribe((item: any) => {
      this.cecos = item
      this._spinner.hide()
    })
  }

  getDivisas() {
    this._spinner.show()
    this._divisasService.getDivisas().subscribe((item: any) => {
      this.divisas = item
      this._spinner.hide()
    })
  }

  getClients() {
    this._spinner.show()
    this._clientsService.getClients().subscribe((item: any) => {
      this.clients = item
      this._spinner.hide()
    })
  }

  registerInvoice() {

    this._spinner.show()
    if (this.invoiceForm.invalid) {
      this._spinner.hide()
      return
    }
    let client: any;
    const clientSelect: any = this.invoiceForm.controls['client'].value
    if (clientSelect._id) {
      client = clientSelect;
    } else {
      const findClient = this.clients.find((client: Client) => client.key_client.trim().toLowerCase() === this.invoiceForm.controls['client'].value?.trim().toLowerCase() || client.name.toLowerCase().trim() === this.invoiceForm.controls['client'].value?.trim().toLowerCase())
      client = findClient
    }
    if (!client) {
      this._spinner.hide()
      this._toastr.error('No se ha seleccionado un proveedor correctamente')
      return
    }

    let ceco: any;
    const cecoSelect: any = this.invoiceForm.controls['ceco'].value
    if (cecoSelect._id) {
      ceco = cecoSelect;
    } else {
      const findCeco = this.cecos.find((ceco: Ceco) => ceco.key_ceco_business.trim().toLowerCase() === this.invoiceForm.controls['ceco'].value?.trim().toLowerCase() || ceco.name_short.toLowerCase().trim() === this.invoiceForm.controls['ceco'].value?.trim().toLowerCase())
      ceco = findCeco
    }
    if (!ceco) {
      this._spinner.hide()
      this._toastr.error('No se ha seleccionado un ceco correctamente')
      return
    }

    const element = {
      ceco: ceco._id,
      client: client._id,
      key_invoice: this.invoiceForm.controls['key_invoice'].value,
      upload_date: new Date(this.invoiceForm.controls['upload_date'].value!).getTime(),
      invoice_date: new Date(this.invoiceForm.controls['invoice_date'].value!).getTime(),
      expiration_date: new Date(this.invoiceForm.controls['expiration_date'].value!).getTime(),
      invoice_total: this.invoiceForm.controls['invoice_total'].value,
      divisa: this.invoiceForm.controls['divisa'].value,
      description: this.invoiceForm.controls['description'].value,
      movement_type: this.invoiceForm.controls['movement_type'].value,
    }
    this._invoiceClientsService.updateInvoiceClient(element, this.invoiceClients._id)
      .subscribe((res: any) => {
        this._router.navigateByUrl('/invoice-clients')
        this._spinner.hide()
        this._toastr.success('Factura actualizada con Exito')
      }, (err: any) => {
        this._spinner.hide()
        console.warn(err.error.msg)
        this._toastr.error(`${err.error.msg}`)
      })
  }

  getUsers(){
    this._userService.getUsers().subscribe((resp: User[]) => {
      this.users = resp
    })
  }

  getUser(id:any){
    const findUser:any = this.users.find((user: any) => user._id === id)
    return {
      name: findUser?.name,
      last_name: findUser?.last_name
    }
  }
  getUserInitial(id:any){
    const findUser:any = this.users.find((user: any) => user._id === id)
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

    this._invoiceClientsService.updateInvoiceClient(element, this.invoiceClients._id!).subscribe((resp: any) => {})

    this.formActivity.setValue('')
  }

  openDialogAddActivity() {
    let dialogRef = this._dialog.open(AddActivitiesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe((resp:any) => {
      console.log('resp after dialog', resp);
      if(resp){
        const element1 = {
          ...resp
        }
        this.history.push(element1)
        console.log('this.history',this.history);
        const element = {
          activities: [
            ...this.history
          ]
        }

        this._invoiceClientsService.updateInvoiceClient(element, this.invoiceClients._id!).subscribe((resp: any) => {})
        this.viewActivitiesPlan()
      }
    })
  }

  viewActivitiesPlan(){
    let findActivity:any
    findActivity = this.history.filter((element:any) => {
      return element.type === 'activity' && element.status === 'DRAFT'
    })

    if(findActivity){
      this.activitiesPlan = findActivity
    }
  }

  viewNote(){
    this.flagNote = !this.flagNote
  }

  deleteFollower(index:any){
    this.followers.splice(index, 1);
    const element = {
      followers: [ ...this.followers],
    }
    this._invoiceClientsService.updateInvoiceClient(element, this.invoiceClients._id!).subscribe((resp: InvoiceClient) => {
      this.followers = [...resp.followers!]
    })
  }

  openDialogAddFollower(){
    let dialogRef = this._dialog.open(AddFollowersComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: {
        followers: this.followers,
        key_invoice: this.invoiceClients.key_invoice
      }
    });
    dialogRef.beforeClosed().subscribe((resp:any) => {
      console.log('resp after dialog', resp);
      if(resp){
        const element = {
          followers: [ ...this.followers, resp],
        }
        this._invoiceClientsService.updateInvoiceClient(element, this.invoiceClients._id!).subscribe((resp: InvoiceClient) => {
          this.followers = [...resp.followers!]
        })
      }
    })
  }

  goToEditActivity(id: string){
    console.log(id);
    let dialogRef = this._dialog.open(EditActivitiesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: id
    })
    dialogRef.beforeClosed().subscribe((resp:any) => {
      console.log('resp after dialog', resp);
      if(resp){
        const element1 = {
          ...resp
        }

        const findIndexActivity = this.history.findIndex((element:any) => element._id === element1._id)

        this.history[findIndexActivity] = element1

        const element = {
          activities: [
           ...this.history
         ]
        }

        this._invoiceClientsService.updateInvoiceClient(element, this.invoiceClients._id!).subscribe((resp: InvoiceClient) => {
          this.history = [...resp.activities]
        })
        this.viewActivitiesPlan()
      }
    })
  }

  cancelActivity(data: any){
    const findActivity = this.history.findIndex((element:any) => element._id === data._id)
    this.history.splice(findActivity,1)
    const element = {
      activities: [
       ...this.history
     ]
    }
    this._invoiceClientsService.updateInvoiceClient(element, this.invoiceClients._id!).subscribe((resp: InvoiceClient) => {
      this.history = [...resp.activities]
    })
    this.viewActivitiesPlan()
  }

  markActivityDone(data:any){

    const findActivity = this.history.findIndex((element:any) => element._id === data._id)
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
    this._invoiceClientsService.updateInvoiceClient(element, this.invoiceClients._id!).subscribe((resp: InvoiceClient) => {
      this.history = [...resp.activities]
    })
    this.viewActivitiesPlan()
  }

}
