import { Component, OnInit, Inject } from '@angular/core';
import { Divisa } from '../../../../models/Divisa.model';
import { Provider } from '../../../../models/Provider.model';
import { Ceco } from '../../../../models/Ceco.model';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { InvoiceProvidersService } from '../../../../services/invoice-providers.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProvidersService } from '../../../../services/providers.service';
import { CecosService } from '../../../../services/cecos.service';
import { DivisasService } from '../../../../services/divisas.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { InvoiceProviders } from '../../../../models/InvoiceProviders.model';
import { formatDate } from '@angular/common';
import { UsersService } from '../../../../services/users.service';
import { LoginService } from '../../../../services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../../models/User.model';
import { AddActivitiesComponent } from '../../components/add-activities/add-activities.component';
import { AddFollowersComponent } from '../../components/add-followers/add-followers.component';
import { EditActivitiesComponent } from '../../components/edit-activities/edit-activities.component';
import { MovementTypeProvider } from '../../../../models/MovementTypeProvider.model';
import { MovementsTypeProviderService } from '../../../../services/movements-type-provider.service';
import { ModalTrackingComponent } from '../../components/modal-tracking/modal-tracking.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-invoice-provider',
  templateUrl: './edit-invoice-provider.component.html',
  styleUrls: ['./edit-invoice-provider.component.scss']
})
export class EditInvoiceProviderComponent implements OnInit {

  public invoiceProviders: any
  public divisas: Divisa[] = []
  public movements: MovementTypeProvider[] = []
  public providers: Provider[] = []
  public cecos: Ceco[] = []
  public users: any[] = []
  public user: any
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
    provider: ['', Validators.required],
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
    private _invoiceProvidersService: InvoiceProvidersService,
    private _spinner: NgxSpinnerService,
    private _providersService: ProvidersService,
    private _cecosService: CecosService,
    private _divisasService: DivisasService,
    private _movementsProviderService: MovementsTypeProviderService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private _userService: UsersService,
    private _loginService: LoginService,
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
    this.getProviders()
    this.getUsers()
    this._activatedRoute.queryParams.subscribe((params: any) => {
      this.getInvoiceProviders(params.invoice)
    })
    this.invoiceForm.controls['provider'].valueChanges.subscribe((inputValue: any) => {
      this.filterData(inputValue)
    })
    this.invoiceForm.controls['ceco'].valueChanges.subscribe((inputValue: any) => {
      this.filterDataCeco(inputValue)
    })
  }

  public displayFn(provider: any): string {
    return provider && `${provider.name}` ? `${provider.name}` : '';
  }

  public displayFnCeco(ceco: any): string {
    return ceco && `${ceco.name_short}` ? `${ceco.name_short}` : '';
  }

  public filterData(value: string) {
    this.filteredOptions = this.providers.filter(item => {
      this.displayFn(item)
      return item.name.toLowerCase().indexOf(value) > -1 || item.key_provider.toLowerCase().indexOf(value) > -1
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

  getInvoiceProviders(id: any) {
    this._spinner.show()
    this._invoiceProvidersService.getInvoiceProviders().subscribe((invoices: InvoiceProviders[]) => {
      this.invoiceProviders = invoices.find((invoice: InvoiceProviders) => invoice._id === id)
      this.initValueForm()
      this.viewActivitiesPlan()
      this._spinner.hide()
    })
  }

  initValueForm() {
    this._spinner.show()
    this.invoiceForm.patchValue({
      ceco: this.invoiceProviders.ceco,
      provider: this.invoiceProviders.provider,
      key_invoice: this.invoiceProviders.key_invoice,
      upload_date: formatDate(this.invoiceProviders.upload_date, 'yyyy-MM-dd', 'en'),
      invoice_date: formatDate(this.invoiceProviders.invoice_date, 'yyyy-MM-dd', 'en'),
      expiration_date: formatDate(this.invoiceProviders.expiration_date, 'yyyy-MM-dd', 'en'),
      invoice_total: this.invoiceProviders.invoice_total,
      divisa: this.invoiceProviders.divisa._id,
      description: this.invoiceProviders.description,
      movement_type: this.invoiceProviders.movement_type._id
    })
    this.history = [...this.invoiceProviders.activities]
    this.followers = [...this.invoiceProviders.followers!]
  }

  getMovements() {
    this._spinner.show()
    this._movementsProviderService.getMovementsTypeProviderActive().subscribe((item: any) => {
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

  getProviders() {
    this._spinner.show()
    this._providersService.getProviders().subscribe((item: any) => {
      this.providers = item
      this._spinner.hide()
    })
  }

  registerInvoice() {

    this._spinner.show()
    if (this.invoiceForm.invalid) {
      this._spinner.hide()
      return
    }
    let provider: any;
    const providerSelect: any = this.invoiceForm.controls['provider'].value
    if (providerSelect._id) {
      provider = providerSelect;
    } else {
      const findProvider = this.providers.find((provider: Provider) => provider.key_provider.trim().toLowerCase() === this.invoiceForm.controls['provider'].value?.trim().toLowerCase() || provider.name.toLowerCase().trim() === this.invoiceForm.controls['provider'].value?.trim().toLowerCase())
      provider = findProvider
    }
    if (!provider) {
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
      provider: provider._id,
      key_invoice: this.invoiceForm.controls['key_invoice'].value,
      upload_date: new Date(this.invoiceForm.controls['upload_date'].value!).getTime(),
      invoice_date: new Date(this.invoiceForm.controls['invoice_date'].value!).getTime(),
      expiration_date: new Date(this.invoiceForm.controls['expiration_date'].value!).getTime(),
      invoice_total: this.invoiceForm.controls['invoice_total'].value,
      divisa: this.invoiceForm.controls['divisa'].value,
      description: this.invoiceForm.controls['description'].value,
      movement_type: this.invoiceForm.controls['movement_type'].value,
    }
    this._invoiceProvidersService.updateInvoiceProvider(element, this.invoiceProviders._id)
      .subscribe((res: any) => {
        this._router.navigateByUrl('/invoice-providers')
        this._spinner.hide()
        this._toastr.success('Factura actualizada con Exito')
      }, (err: any) => {
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

    this._invoiceProvidersService.updateInvoiceProvider(element, this.invoiceProviders._id!).subscribe((resp: any) => { })

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

        this._invoiceProvidersService.updateInvoiceProvider(element, this.invoiceProviders._id!).subscribe((resp: any) => { })
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

  viewNote() {
    this.flagNote = !this.flagNote
  }

  deleteFollower(index: any) {
    this.followers.splice(index, 1);
    const element = {
      followers: [...this.followers],
    }
    this._invoiceProvidersService.updateInvoiceProvider(element, this.invoiceProviders._id!).subscribe((resp: InvoiceProviders) => {
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
        key_invoice: this.invoiceProviders.key_invoice
      }
    });
    dialogRef.beforeClosed().subscribe((resp: any) => {
      console.log('resp after dialog', resp);
      if (resp) {
        const element = {
          followers: [...this.followers, resp],
        }
        this._invoiceProvidersService.updateInvoiceProvider(element, this.invoiceProviders._id!).subscribe((resp: InvoiceProviders) => {
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

        this._invoiceProvidersService.updateInvoiceProvider(element, this.invoiceProviders._id!).subscribe((resp: InvoiceProviders) => {
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
    this._invoiceProvidersService.updateInvoiceProvider(element, this.invoiceProviders._id!).subscribe((resp: InvoiceProviders) => {
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
    this._invoiceProvidersService.updateInvoiceProvider(element, this.invoiceProviders._id!).subscribe((resp: InvoiceProviders) => {
      this.history = [...resp.activities!]
    })
    this.viewActivitiesPlan()
  }

  async delete() {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar la factura ${this.invoiceProviders.key_invoice}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._invoiceProvidersService.deleteInvoiceProvider(this.invoiceProviders).subscribe(() => {
          this._router.navigate(['/invoice-providers'])
          this._spinner.hide()
          this._toastr.success(`Factura ${this.invoiceProviders.key_invoice} eliminada con exito`)
        })

      }
    })
  }

  openDialogTracking() {
    console.log(this.invoiceProviders);
    let dialogRef = this._dialog.open(ModalTrackingComponent, {
      width: '1000px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: this.invoiceProviders
    });
    dialogRef.beforeClosed().subscribe(() => {
      this._router.navigate(['/invoice-providers'])
    })
  }


}
