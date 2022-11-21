import { Component, OnInit } from '@angular/core';
import { InvoiceClient } from '../../../../models/InvoiceClients.model';
import { Divisa } from '../../../../models/Divisa.model';
import { Business } from '../../../../models/Business.model';
import { Exchange } from '../../../../models/Exchange.model';
import { InvoiceClientsService } from '../../../../services/invoice-clients.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { DivisasService } from '../../../../services/divisas.service';
import { BusinessService } from '../../../../services/business.service';
import { ExchangesService } from '../../../../services/exchanges.service';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ModalTrackingComponent } from '../modal-tracking/modal-tracking.component';

@Component({
  selector: 'app-table-invoice-clients',
  templateUrl: './table-invoice-clients.component.html',
  styleUrls: ['./table-invoice-clients.component.scss']
})
export class TableInvoiceClientsComponent implements OnInit {

  public invoiceClients: InvoiceClient[] = []
  public filterInvoiceClients: InvoiceClient[] = []
  public divisas: Divisa[] = []
  public business: Business[] = []
  public exchanges: Exchange[] = []

  public selectedValue: number = 5;
  public page!: number;

  public headersInvoiceClient: any[] = []
  public header_name: string = 'invoiceClients'

  public trackingControl: FormControl = new FormControl()
  public statusControl: FormControl = new FormControl()
  public flowIdControl: FormControl = new FormControl()
  public remesaControl: FormControl = new FormControl()
  public nameBusinessControl: FormControl = new FormControl()
  public cecoControl: FormControl = new FormControl()
  public keyClientControl: FormControl = new FormControl()
  public clientControl: FormControl = new FormControl()
  public keyInvoiceControl: FormControl = new FormControl()
  public uploadDateControl: FormControl = new FormControl()
  public invoiceDateControl: FormControl = new FormControl()
  public expirationDateControl: FormControl = new FormControl()
  public invoiceTotalControl: FormControl = new FormControl()
  public invoiceTotalPaymentControl: FormControl = new FormControl()
  public divisaControl: FormControl = new FormControl()
  public descriptionControl: FormControl = new FormControl()
  public contractControl: FormControl = new FormControl()
  public tcControl: FormControl = new FormControl()
  public totalMNControl: FormControl = new FormControl()
  public checkbookControl: FormControl = new FormControl()
  public payStatusControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  constructor(
    private _invoiceClientService: InvoiceClientsService,
    private _spinner: NgxSpinnerService,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _divisaService: DivisasService,
    private _businessService: BusinessService,
    private _exchangeService: ExchangesService,
    private _dialog: MatDialog,
    private _loginService: LoginService,
    private _headerService: HeadersService
  ) { }

  ngOnInit(): void {
    this.getInvoiceClients()
    this.getDivisas()
    this.getBusiness()
    this.getExchanges()
    this.getHeadersInvoiceClient()
  }

  getHeadersInvoiceClient() {
    this._spinner.show()
    this._headerService.getHeaders("invoiceClients").subscribe((resp: any) => {
      this.headersInvoiceClient = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  initValuesHeader() {
    const headerInvoiceClient = this.headersInvoiceClient.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerInvoiceClient) {
      this.trackingControl.setValue(headerInvoiceClient.tracking)
      this.statusControl.setValue(headerInvoiceClient.status)
      this.flowIdControl.setValue(headerInvoiceClient.flow_id)
      this.remesaControl.setValue(headerInvoiceClient.remesa)
      this.nameBusinessControl.setValue(headerInvoiceClient.name_business)
      this.cecoControl.setValue(headerInvoiceClient.ceco)
      this.keyClientControl.setValue(headerInvoiceClient.key_client)
      this.clientControl.setValue(headerInvoiceClient.client)
      this.keyInvoiceControl.setValue(headerInvoiceClient.key_invoice)
      this.uploadDateControl.setValue(headerInvoiceClient.upload_date)
      this.invoiceDateControl.setValue(headerInvoiceClient.invoice_date)
      this.expirationDateControl.setValue(headerInvoiceClient.expiration_date)
      this.invoiceTotalControl.setValue(headerInvoiceClient.invoice_total)
      this.invoiceTotalPaymentControl.setValue(headerInvoiceClient.invoice_total_payment)
      this.divisaControl.setValue(headerInvoiceClient.divisa)
      this.descriptionControl.setValue(headerInvoiceClient.description)
      this.contractControl.setValue(headerInvoiceClient.contract)
      this.tcControl.setValue(headerInvoiceClient.tc)
      this.totalMNControl.setValue(headerInvoiceClient.totalMN)
      this.checkbookControl.setValue(headerInvoiceClient.checkbook)
      this.payStatusControl.setValue(headerInvoiceClient.pay_status)
      this.actionsControl.setValue(headerInvoiceClient.actions)
    } else {
      this.trackingControl.setValue(true)
      this.statusControl.setValue(true)
      this.flowIdControl.setValue(true)
      this.remesaControl.setValue(true)
      this.nameBusinessControl.setValue(true)
      this.cecoControl.setValue(true)
      this.keyClientControl.setValue(true)
      this.clientControl.setValue(true)
      this.keyInvoiceControl.setValue(true)
      this.uploadDateControl.setValue(true)
      this.invoiceDateControl.setValue(true)
      this.expirationDateControl.setValue(true)
      this.invoiceTotalControl.setValue(true)
      this.invoiceTotalPaymentControl.setValue(true)
      this.divisaControl.setValue(true)
      this.descriptionControl.setValue(true)
      this.contractControl.setValue(true)
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
        key_client: true,
        client: true,
        key_invoice: true,
        upload_date: true,
        invoice_date: true,
        expiration_date: true,
        invoice_total: true,
        invoice_total_payment: true,
        divisa: true,
        description: true,
        contract: true,
        tc: true,
        totalMN: true,
        checkboock: true,
        pay_status: true,
        actions: true,
      }
      this._headerService.createHeaders(element, "invoiceClients").subscribe((item: any) => {
        this.getHeadersInvoiceClient()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerInvoiceClient = this.headersInvoiceClient.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      tracking: this.trackingControl.value,
      status: this.statusControl.value,
      flow_id: this.flowIdControl.value,
      remesa: this.remesaControl.value,
      name_business: this.nameBusinessControl.value,
      ceco: this.cecoControl.value,
      key_client: this.keyInvoiceControl.value,
      client: this.clientControl.value,
      key_invoice: this.keyInvoiceControl.value,
      upload_date: this.uploadDateControl.value,
      invoice_date: this.invoiceDateControl.value,
      expiration_date: this.expirationDateControl.value,
      invoice_total: this.invoiceTotalControl.value,
      invoice_total_payment: this.invoiceTotalControl.value,
      divisa: this.divisaControl.value,
      description: this.descriptionControl.value,
      contract: this.contractControl.value,
      tc: this.tcControl.value,
      totalMN: this.totalMNControl.value,
      checkbook: this.checkbookControl.value,
      pay_status: this.payStatusControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerInvoiceClient._id, "invoiceClients").subscribe(() => {

    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  getInvoiceClients() {
    this._spinner.show()
    this._invoiceClientService.getInvoiceClients().subscribe((resp: any) => {
      this.invoiceClients = resp
      this.filterInvoiceClients = this.invoiceClients.filter((item: InvoiceClient) => item.movement_type.key_movement === '14')
      this._spinner.hide()
    })
  }

  openDialogTracking(invoice: InvoiceClient) {
    let dialogRef = this._dialog.open(ModalTrackingComponent, {
      width: '1000px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: invoice
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getInvoiceClients()
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


  getTotal(invoice: InvoiceClient) {
    let total: number = 0
    const array = this.invoiceClients.filter((item: InvoiceClient) => item.key_invoice === invoice.key_invoice)
    array.forEach((invoice: InvoiceClient) => {
      const divisa = this.divisas.find((item: Divisa) => item._id === invoice.divisa._id)
      if (divisa?.abbreviation_divisa === 'BOB') {
        if (invoice.movement_type.key_movement === '51' && divisa?.abbreviation_divisa === 'BOB') {
          total += 0
        }
        if ((invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') && divisa?.abbreviation_divisa === 'BOB') {
          total += Number(invoice.invoice_total)
        }
        if (invoice.movement_type.key_movement != '14' && divisa?.abbreviation_divisa === 'BOB') {
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

  getTotalPayment(invoice: InvoiceClient) {
    let total: number = 0
    const array = this.invoiceClients.filter((item: InvoiceClient) => item.key_invoice === invoice.key_invoice)
    array.forEach((invoice: InvoiceClient) => {
      const divisa = this.divisas.find((item: Divisa) => item._id === invoice.divisa._id)
      if (divisa?.abbreviation_divisa === 'BOB') {
        if (invoice.movement_type.key_movement === '14' && divisa?.abbreviation_divisa === 'BOB') {
          total += Number(invoice.invoice_total)
        }
        if (invoice.movement_type.key_movement != '14' && divisa?.abbreviation_divisa === 'BOB') {
          total -= Number(invoice.invoice_total)
        }
      } else {
        const exchange = this.exchanges.find((item: Exchange) => item.date_exchange === invoice.invoice_date);
        if (divisa && exchange) {
          if (invoice.movement_type.key_movement === '14') {
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

  public typeChange(invoice: InvoiceClient) {
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

}
