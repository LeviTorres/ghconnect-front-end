import { Component, OnInit } from '@angular/core';
import { InvoiceProvidersService } from '../../../../services/invoice-providers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from '../../../../services/search.service';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';
import { ToastrService } from 'ngx-toastr';
import { InvoiceProviders } from '../../../../models/InvoiceProviders.model';
import { Divisa } from '../../../../models/Divisa.model';
import { DivisasService } from '../../../../services/divisas.service';
import { Exchange } from '../../../../models/Exchange.model';
import { ExchangesService } from '../../../../services/exchanges.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ModalTrackingComponent } from '../modal-tracking/modal-tracking.component';
import Swal from 'sweetalert2';
import { Business } from 'src/app/models/Business.model';
import { BusinessService } from 'src/app/services/business.service';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../services/excel.service';

@Component({
  selector: 'app-table-invoice-providers',
  templateUrl: './table-invoice-providers.component.html',
  styleUrls: ['../../../../../styles.scss']
})
export class TableInvoiceProvidersComponent implements OnInit {

  public invoiceProvidersTemp: InvoiceProviders[] = []

  public invoices: InvoiceProviders[] = [];

  public invoiceProviders: InvoiceProviders[] = []
  public filterInvoiceProviders: InvoiceProviders[] = []
  public divisas: Divisa[] = []
  public exchanges: Exchange[] = []
  public business: Business[] = []

  public selectedValue: number = 100;
  public page!: number;

  public headersInvoiceProvider: any[] = []
  public header_name: string = 'invoiceProviders'

  public trackingControl: FormControl = new FormControl()
  public statusControl: FormControl = new FormControl()
  public flowIdControl: FormControl = new FormControl()
  public remesaControl: FormControl = new FormControl()
  public nameBusinessControl: FormControl = new FormControl()
  public cecoControl: FormControl = new FormControl()
  public keyProviderControl: FormControl = new FormControl()
  public providerControl: FormControl = new FormControl()
  public keyInvoiceControl: FormControl = new FormControl()
  public uploadDateControl: FormControl = new FormControl()
  public invoiceDateControl: FormControl = new FormControl()
  public expirationDateControl: FormControl = new FormControl()
  public invoiceTotalControl: FormControl = new FormControl()
  public invoiceTotalPaymentControl: FormControl = new FormControl()
  public divisaControl: FormControl = new FormControl()
  public descriptionControl: FormControl = new FormControl()
  public contractControl: FormControl = new FormControl()
  public movementTypeControl: FormControl = new FormControl()
  public tcControl: FormControl = new FormControl()
  public totalMNControl: FormControl = new FormControl()
  public checkbookControl: FormControl = new FormControl()
  public payStatusControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  constructor(
    private _invoiceProvidersService: InvoiceProvidersService,
    private _spinner: NgxSpinnerService,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _divisaService: DivisasService,
    private _exchangeService: ExchangesService,
    private _dialog: MatDialog,
    private _loginService: LoginService,
    private _headerService: HeadersService,
    private _businessService: BusinessService,
    private _router: Router,
    private _excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this._spinner.show()
    this.getInvoiceProviders()
    this.getDivisas()
    this.getExchanges()
    this.getHeadersInvoiceProvider()
    this._spinner.hide()
  }

  getHeadersInvoiceProvider() {
    this._spinner.show()
    this._headerService.getHeaders(this.header_name).subscribe((resp: any) => {
      this.headersInvoiceProvider = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  initValuesHeader() {
    this._spinner.show()
    const headerInvoiceProvider = this.headersInvoiceProvider.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerInvoiceProvider) {
      this.trackingControl.setValue(headerInvoiceProvider.tracking)
      this.statusControl.setValue(headerInvoiceProvider.status)
      this.flowIdControl.setValue(headerInvoiceProvider.flow_id)
      this.remesaControl.setValue(headerInvoiceProvider.remesa)
      this.nameBusinessControl.setValue(headerInvoiceProvider.name_business)
      this.cecoControl.setValue(headerInvoiceProvider.ceco)
      this.keyProviderControl.setValue(headerInvoiceProvider.key_provider)
      this.providerControl.setValue(headerInvoiceProvider.provider)
      this.keyInvoiceControl.setValue(headerInvoiceProvider.key_invoice)
      this.uploadDateControl.setValue(headerInvoiceProvider.upload_date)
      this.invoiceDateControl.setValue(headerInvoiceProvider.invoice_date)
      this.expirationDateControl.setValue(headerInvoiceProvider.expiration_date)
      this.invoiceTotalControl.setValue(headerInvoiceProvider.invoice_total)
      this.invoiceTotalPaymentControl.setValue(headerInvoiceProvider.invoice_total_payment)
      this.divisaControl.setValue(headerInvoiceProvider.divisa)
      this.descriptionControl.setValue(headerInvoiceProvider.description)
      this.contractControl.setValue(headerInvoiceProvider.contract)
      this.movementTypeControl.setValue(headerInvoiceProvider.movement_type)
      this.tcControl.setValue(headerInvoiceProvider.tc)
      this.totalMNControl.setValue(headerInvoiceProvider.totalMN)
      this.checkbookControl.setValue(headerInvoiceProvider.checkbook)
      this.payStatusControl.setValue(headerInvoiceProvider.pay_status)
      this.actionsControl.setValue(headerInvoiceProvider.actions)
      this._spinner.hide()
    } else {
      this.trackingControl.setValue(true)
      this.statusControl.setValue(true)
      this.flowIdControl.setValue(true)
      this.remesaControl.setValue(true)
      this.nameBusinessControl.setValue(true)
      this.cecoControl.setValue(true)
      this.keyProviderControl.setValue(true)
      this.providerControl.setValue(true)
      this.keyInvoiceControl.setValue(true)
      this.uploadDateControl.setValue(true)
      this.invoiceDateControl.setValue(true)
      this.expirationDateControl.setValue(true)
      this.invoiceTotalControl.setValue(true)
      this.invoiceTotalPaymentControl.setValue(true)
      this.divisaControl.setValue(true)
      this.descriptionControl.setValue(true)
      this.contractControl.setValue(true)
      this.movementTypeControl.setValue(true)
      this.tcControl.setValue(true)
      this.totalMNControl.setValue(true)
      this.checkbookControl.setValue(true)
      this.payStatusControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        tracking: true,
        status: true,
        flow_id: true,
        remesa: true,
        name_business: true,
        ceco: true,
        key_provider: true,
        provider: true,
        key_invoice: true,
        upload_date: true,
        invoice_date: true,
        expiration_date: true,
        invoice_total: true,
        invoice_total_payment: true,
        divisa: true,
        description: true,
        contract: true,
        movement_type: true,
        tc: true,
        totalMN: true,
        checkboock: true,
        pay_status: true,
        actions: true,
      }

      this._headerService.createHeaders(element, this.header_name).subscribe((item: any) => {
        this.getHeadersInvoiceProvider()
        this._spinner.hide()
      }, () => {
        this._spinner.hide()
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerInvoiceProvider = this.headersInvoiceProvider.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      tracking: this.trackingControl.value,
      status: this.statusControl.value,
      flow_id: this.flowIdControl.value,
      remesa: this.remesaControl.value,
      name_business: this.nameBusinessControl.value,
      ceco: this.cecoControl.value,
      key_provider: this.keyInvoiceControl.value,
      provider: this.providerControl.value,
      key_invoice: this.keyInvoiceControl.value,
      upload_date: this.uploadDateControl.value,
      invoice_date: this.invoiceDateControl.value,
      expiration_date: this.expirationDateControl.value,
      invoice_total: this.invoiceTotalControl.value,
      invoice_total_payment: this.invoiceTotalControl.value,
      divisa: this.divisaControl.value,
      description: this.descriptionControl.value,
      contract: this.contractControl.value,
      movement_type: this.movementTypeControl.value,
      tc: this.tcControl.value,
      totalMN: this.totalMNControl.value,
      checkbook: this.checkbookControl.value,
      pay_status: this.payStatusControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerInvoiceProvider._id, this.header_name).subscribe(() => {
    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  getInvoiceProviders() {
    this._spinner.show()
    this._invoiceProvidersService.getInvoiceProviders().subscribe((resp: any) => {
      this.invoiceProviders = resp
      this.invoices = this.invoiceProviders.filter((item: InvoiceProviders) => item.movement_type.type === 'CARGO')
      this.filterInvoiceProviders = this.invoiceProviders.filter((item: InvoiceProviders) => item.movement_type.type === 'CARGO')
      this._spinner.hide()
    })
  }

  openDialogTracking(invoice: InvoiceProviders) {
    let dialogRef = this._dialog.open(ModalTrackingComponent, {
      width: '1000px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: invoice
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getInvoiceProviders()
    })
  }

  getDivisas() {
    this._spinner.show()
    this._divisaService.getDivisas().subscribe((resp: any) => {
      this.divisas = resp
      this._spinner.hide()
    })
  }

  getBusiness() {
    this._spinner.show()
    this._businessService.getBusiness().subscribe((resp: any) => {
      this.business = resp
      this._spinner.hide()
    })
  }

  getExchanges() {
    this._spinner.show()
    this._exchangeService.getExchanges().subscribe((resp: any) => {
      this.exchanges = resp
      this._spinner.hide()
    })
  }


  getBusin(id: any) {
    const findBusiness = this.business.find((business: Business) => business._id === id)
    return findBusiness?.name_short
  }


  getTotal(invoice: InvoiceProviders) {
    let total: number = 0
    const array = this.invoiceProviders.filter((item: InvoiceProviders) => item.key_invoice === invoice.key_invoice && item.provider._id === invoice.provider._id)
    array.forEach((invoice: InvoiceProviders) => {
      const divisa = this.divisas.find((item: Divisa) => item._id === invoice.divisa._id)
      if (divisa?.abbreviation_divisa === 'BOB') {
        if (invoice.movement_type.key_movement === '51') {
          total += 0
        }
        if (invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') {
          total += Number(invoice.invoice_total)
        }
        if (invoice.movement_type.key_movement != '14' && invoice.movement_type.key_movement != '15') {
          total -= Number(invoice.invoice_total)
        }
      } else {
        const exchange = this.exchanges.find((item: Exchange) => item.date_exchange === invoice.invoice_date);
        if (divisa && exchange) {
          if (invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') {
            total += Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          } else if (invoice.movement_type.key_movement === '51') {
            total += 0
          }
          else {
            total -= Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          }
        }
      }
    })
    return total
  }

  getTotalPayment(invoice: InvoiceProviders) {
    let total: number = 0
    const array = this.invoiceProviders.filter((item: InvoiceProviders) => item.key_invoice === invoice.key_invoice && item.provider._id === invoice.provider._id)
    array.forEach((invoice: InvoiceProviders) => {
      const divisa = this.divisas.find((item: Divisa) => item._id === invoice.divisa._id)
      if (divisa?.abbreviation_divisa === 'BOB') {
        if (invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') {
          total += Number(invoice.invoice_total)
        }
        if (invoice.movement_type.key_movement != '14' && invoice.movement_type.key_movement != '15') {
          total -= Number(invoice.invoice_total)
        }
      } else {
        const exchange = this.exchanges.find((item: Exchange) => item.date_exchange === invoice.invoice_date);
        if (divisa && exchange) {
          if (invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') {
            total += Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          } else {
            total -= Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          }
        }
      }
    })
    return total
  }

  public totalMN(invoice: any) {
    return this.getTotalPayment(invoice) * this.typeChange(invoice);
  }

  public typeChange(invoice: InvoiceProviders) {
    const divisa = invoice.divisa.abbreviation_divisa

    if (divisa === 'BOB') {
      return Number(1)
    } else {
      const exchange = this.exchanges.filter((item: Exchange) => {
        return (invoice.invoice_date === item.date_exchange)
      })
      const includes = exchange.find((item: Exchange) => {
        return item.type_exchange.includes(divisa!)
      })
      if (includes) {
        return Number(includes.exchange_rate_amount)
      } else {
        return Number(0);
      }
    }
  }

  async delete(invoice: InvoiceProviders) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar la factura ${invoice.key_invoice}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._invoiceProvidersService.deleteInvoiceProvider(invoice).subscribe(() => {
          this.getInvoiceProviders()
          this._spinner.hide()
          this._toastr.success(`Factura ${invoice.key_invoice} eliminada con exito`)
        })

      }
    })
  }

  goToEditInvoiceProvider(invoice: InvoiceProviders) {
    this._router.navigate(['/invoice-providers/edit-invoice-provider'],
      {
        queryParams: {
          invoice: invoice._id,
        }
      });
  }

  search(term: string) {
    if (term.length === 0) {
      return this.filterInvoiceProviders = this.invoices
    }
    this._searchService.search('invoiceProviders', term).subscribe((resp: any) => {
      console.log(this.invoiceProviders);
      this.filterInvoiceProviders = resp
    })
    return
  }

  createExcel() {
    const element = {
      data: this.filterInvoiceProviders,
      headers: [
        'EMPRESA',
        'CECO',
        'NO. PROVEEDOR',
        'NOMBRE PROVEEDOR',
        'NO FACTURA',
        'FECHA CARGA',
        'FECHA FACTURA',
        'FECHA VENCIMIENTO',
        'TOTAL FACTURA',
      ]
    }
    this._excelService.downloadExcel(element, 'FacturasProveedores', 'invoiceProviders')

  }
}
