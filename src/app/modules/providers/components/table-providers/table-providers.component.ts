import { Component, OnInit } from '@angular/core';
import { Provider } from '../../../../models/Provider.model';
import { ProvidersService } from '../../../../services/providers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ExcelService } from '../../../../services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ImportFileComponent } from '../import-file/import-file.component';
import { InvoiceProvidersService } from '../../../../services/invoice-providers.service';
import { InvoiceProviders } from '../../../../models/InvoiceProviders.model';

@Component({
  selector: 'app-table-providers',
  templateUrl: './table-providers.component.html',
  styleUrls: ['../../../../../styles.scss']
})
export class TableProvidersComponent implements OnInit {

  public providers: Provider[] = []
  public providersTemp: Provider[] = []
  public invoiceProviders: InvoiceProviders[] = []

  public newArray: any = []
  public filterProviders: Provider[] = []

  public selectedValue: number = 100;
  public page!: number;

  public headersProvider: any[] = []
  public header_name: string = 'providers'

  public statusControl: FormControl = new FormControl()
  public keyProviderControl: FormControl = new FormControl()
  public nameControl: FormControl = new FormControl()
  public nitControl: FormControl = new FormControl()
  public paymentConditionsControl: FormControl = new FormControl()
  public societyTypeControl: FormControl = new FormControl()
  public thirdTypeControl: FormControl = new FormControl()
  public providerTypeControl: FormControl = new FormControl()
  public phoneNumberControl: FormControl = new FormControl()
  public mobileNumberControl: FormControl = new FormControl()
  public emailControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  constructor(
    private _providersService: ProvidersService,
    private _spinner: NgxSpinnerService,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _loginService: LoginService,
    private _headerService: HeadersService,
    private _excelService: ExcelService,
    private _router: Router,
    private _dialog: MatDialog,
    private _invoiceProviderService: InvoiceProvidersService
  ) { this._spinner.show() }

  ngOnInit(): void {
    this.getProviders()
    this.getInvoiceProviders()
    this.getHeadersProvider()
  }

  getHeadersProvider() {
    this._headerService.getHeaders('providers').subscribe((resp: any) => {
      this.headersProvider = resp
      this.initValuesHeader()
    })
  }

  initValuesHeader() {
    const headerProvider = this.headersProvider.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerProvider) {
      this.statusControl.setValue(headerProvider.status)
      this.keyProviderControl.setValue(headerProvider.key_provider)
      this.nameControl.setValue(headerProvider.name)
      this.nitControl.setValue(headerProvider.nit)
      this.paymentConditionsControl.setValue(headerProvider.payment_conditions)
      this.societyTypeControl.setValue(headerProvider.society_type)
      this.thirdTypeControl.setValue(headerProvider.third_type)
      this.providerTypeControl.setValue(headerProvider.provider_type)
      this.phoneNumberControl.setValue(headerProvider.phone_number)
      this.mobileNumberControl.setValue(headerProvider.mobile_number)
      this.emailControl.setValue(headerProvider.email)
      this.actionsControl.setValue(headerProvider.actions)
    } else {
      this.statusControl.setValue(true)
      this.keyProviderControl.setValue(true)
      this.nameControl.setValue(true)
      this.nitControl.setValue(true)
      this.paymentConditionsControl.setValue(true)
      this.societyTypeControl.setValue(true)
      this.thirdTypeControl.setValue(true)
      this.providerTypeControl.setValue(true)
      this.phoneNumberControl.setValue(true)
      this.mobileNumberControl.setValue(true)
      this.emailControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        status: true,
        key_provider: true,
        name: true,
        nit: true,
        payment_conditions: true,
        society_type: true,
        third_type: true,
        provider_type: true,
        phone_number: true,
        mobile_number: true,
        email: true,
        actions: true,
      }
      this._headerService.createHeaders(element, 'providers').subscribe((item: any) => {
        this.getHeadersProvider()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerProvider = this.headersProvider.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      status: this.statusControl.value,
      key_provider: this.keyProviderControl.value,
      name: this.nameControl.value,
      nit: this.nitControl.value,
      payment_conditions: this.paymentConditionsControl.value,
      society_type: this.societyTypeControl.value,
      third_type: this.thirdTypeControl.value,
      provider_type: this.providerTypeControl.value,
      phone_number: this.phoneNumberControl.value,
      mobile_number: this.mobileNumberControl.value,
      email: this.emailControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerProvider._id, 'providers').subscribe(() => {

    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  getProviders() {
    this._providersService.getProviders().subscribe((resp: any) => {
      this.providers = resp
      this.providersTemp = resp
      this._spinner.hide()
    })
  }

  getInvoiceProviders(){
    this._invoiceProviderService.getInvoiceProviders().subscribe((resp: InvoiceProviders[]) =>{
      this.invoiceProviders = resp
    })
  }

  goToEditProvider(provider: Provider) {
    this._router.navigate(['/providers/edit-provider'],
      {
        queryParams: {
          provider: provider._id,
        }
      });
  }

  async delete(provider: Provider) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar el provider ${provider.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()

        const findInvoiceProvider = this.invoiceProviders.find((element:any) => element.provider._id === provider._id)
        if(findInvoiceProvider){
          this._spinner.hide()
          this._toastr.error('No se puede eliminar proveedor porque tiene al menos una factura relacionada')
          return
        }

        this._providersService.deleteProvider(provider).subscribe(() => {
          this.getProviders()
          this._spinner.hide()
          this._toastr.success(`Proveedor ${provider.name} eliminado con exito`)
        },(e:any) => {
          this._spinner.hide();
          console.warn(e.error.msg);
          this._toastr.error(`${e.error.msg}`);
        })

      }
    })
  }

  search(term: string) {
    if (term.length === 0) {
      return this.providersTemp = this.providers
    }
    this._searchService.search('providers', term).subscribe((resp: any) => {
      this.providersTemp = resp
    })
    return
  }

  createExcel() {
    for (let index = 0; index < this.providersTemp.length; index++) {
      this.newArray.push({
        ...this.providersTemp[index],
        payment_conditions: this.providersTemp[index].payment_conditions.name_payment
      })
    }
    const element = {
      data: this.newArray,
      headers: [
        'STATUS',
        'No. PROVEEDOR',
        'NOMBRE PROVEEDOR',
        'NIT',
        'CONDICIONES DE PAGO',
        'TIPO DE TERCERO',
        'TIPO DE SOCIEDAD',
        'TIPO DE PROVEEDOR',
        'TELEFONO',
        'TELEFONO MOVIL',
        'EMAIL'
      ]
    }
    this._excelService.downloadExcel(element, 'Proveedores', 'providers')
  }


  openDialogUploadExcel(){
    let dialogRef = this._dialog.open(ImportFileComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getProviders()
    })
  }

}
