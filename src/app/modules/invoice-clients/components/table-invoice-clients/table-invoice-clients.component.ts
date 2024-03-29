import { Component, OnInit } from '@angular/core';
import { InvoiceClient } from '../../../../models/InvoiceClients.model';
import { Divisa } from '../../../../models/Divisa.model';
import { Exchange } from '../../../../models/Exchange.model';
import { InvoiceClientsService } from '../../../../services/invoice-clients.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { DivisasService } from '../../../../services/divisas.service';
import { ExchangesService } from '../../../../services/exchanges.service';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ModalTrackingComponent } from '../modal-tracking/modal-tracking.component';
import { BusinessService } from '../../../../services/business.service';
import { Business } from 'src/app/models/Business.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../services/excel.service';
import { ImportFileComponent } from '../import-file/import-file.component';

@Component({
  selector: 'app-table-invoice-clients',
  templateUrl: './table-invoice-clients.component.html',
  styleUrls: ['../../../../../styles.scss']
})
export class TableInvoiceClientsComponent implements OnInit {

  public invoiceClientsTemp: InvoiceClient[] = []

  public invoices: InvoiceClient[] = [];

  public invoiceClients: InvoiceClient[] = []
  public filterInvoiceClients: InvoiceClient[] = []
  public divisas: Divisa[] = []
  public exchanges: Exchange[] = []
  public business: any
  public selectedValue: number = 100;
  public page!: number;
  public newArray: any = []

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
  public movementTypeControl: FormControl = new FormControl()
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
    private _exchangeService: ExchangesService,
    private _dialog: MatDialog,
    private _loginService: LoginService,
    private _headerService: HeadersService,
    private _businessService: BusinessService,
    private _router: Router,
    private _excelService: ExcelService
  ) { this._spinner.show() }

  ngOnInit(): void {
    this.getInvoiceClients()
    this.getDivisas()
    this.getExchanges()
    this.getHeadersInvoiceClient()
  }

  getHeadersInvoiceClient() {
    this._headerService.getHeaders(this.header_name).subscribe((resp: any) => {
      this.headersInvoiceClient = resp
      this.initValuesHeader()
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
      this.movementTypeControl.setValue(headerInvoiceClient.movement_type)
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
        movement_type: true,
        tc: true,
        totalMN: true,
        checkboock: true,
        pay_status: true,
        actions: true,
      }
      this._headerService.createHeaders(element, this.header_name).subscribe((item: any) => {
        this.getHeadersInvoiceClient()
      }, () => {
        this._spinner.hide()
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
      movement_type: this.movementTypeControl.value,
      tc: this.tcControl.value,
      totalMN: this.totalMNControl.value,
      checkbook: this.checkbookControl.value,
      pay_status: this.payStatusControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerInvoiceClient._id, this.header_name).subscribe(() => {
    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  getInvoiceClients() {
    this._invoiceClientService.getInvoiceClients().subscribe((resp: any) => {
      this.invoiceClients = resp
      this.invoices = this.invoiceClients.filter((item: InvoiceClient) => item.movement_type.type === 'CARGO')
      this.filterInvoiceClients = this.invoiceClients.filter((item: InvoiceClient) => item.movement_type.type === 'CARGO')
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
    this._divisaService.getDivisas().subscribe((resp: any) => {
      this.divisas = resp
    })
  }

  getBusiness() {
    this._businessService.getBusiness().subscribe((resp: any) => {
      this.business = resp
    })
  }

  getExchanges() {
    this._exchangeService.getExchanges().subscribe((resp: any) => {
      this.exchanges = resp
    })
  }


  getBusin(id: any) {
    const findBusiness = this.business.find((business: Business) => business._id === id)
    return findBusiness?.name_short
  }


  getTotal(invoice: InvoiceClient) {
    let total: number = 0
    const array = this.invoiceClients.filter((item: InvoiceClient) => item.key_invoice === invoice.key_invoice && item.client._id === invoice.client._id)
    array.forEach((invoice: InvoiceClient) => {
      const divisa = this.divisas.find((item: Divisa) => item._id === invoice.divisa._id)
      if (divisa?.abbreviation_divisa === 'BOB') {
        if(invoice.movement_type.type === 'CARGO'){
          total += Number(invoice.invoice_total)
        }
        if(invoice.movement_type.type === 'ABONO'){
          total -= Number(invoice.invoice_total)
        }
        /* if (invoice.movement_type.key_movement === '51') {
          total += 0
        }
        if (invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') {
          total += Number(invoice.invoice_total)
        }
        if (invoice.movement_type.key_movement != '14' && invoice.movement_type.key_movement != '15') {
          total -= Number(invoice.invoice_total)
        } */
      } else {
        const exchange = this.exchanges.find((item: Exchange) => item.date_exchange === invoice.invoice_date);
      /*  if (divisa && exchange) {
          if (invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') {
            total += Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          } else if (invoice.movement_type.key_movement === '51') {
            total += 0
          }
          else {
            total -= Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          }
        }*/
      }
    })
    return total
  }

  getTotalPayment(invoice: InvoiceClient) {
    let total: number = 0
    const array = this.invoiceClients.filter((item: InvoiceClient) => item.key_invoice === invoice.key_invoice && item.client._id === invoice.client._id)
    array.forEach((invoice: InvoiceClient) => {
      const divisa = this.divisas.find((item: Divisa) => item._id === invoice.divisa._id)
      if (divisa?.abbreviation_divisa === 'BOB') {
        if(invoice.movement_type.type === 'CARGO'){
          total += Number(invoice.invoice_total)
        }
        if(invoice.movement_type.type === 'ABONO'){
          total -= Number(invoice.invoice_total)
        }
       /* if (invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') {
          total += Number(invoice.invoice_total)
        }
        if (invoice.movement_type.key_movement != '14' && invoice.movement_type.key_movement != '15') {
          total -= Number(invoice.invoice_total)
        } */
      } else {
        const exchange = this.exchanges.find((item: Exchange) => item.date_exchange === invoice.invoice_date);
       /* if (divisa && exchange) {
          if (invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') {
            total += Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          } else {
            total -= Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          }
        } */
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

  goToEditInvoiceClient(invoice: InvoiceClient) {
    this._router.navigate(['/invoice-clients/edit-invoice-client'],
      {
        queryParams: {
          invoice: invoice._id,
        }
      });
  }

  async delete(invoice: InvoiceClient) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar la factura ${invoice.key_invoice}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._invoiceClientService.deleteInvoiceClient(invoice).subscribe(() => {
          this.getInvoiceClients()
          this._spinner.hide()
          this._toastr.success(`Factura ${invoice.key_invoice} eliminada con exito`)
        })

      }
    })
  }

  search(term: string) {
    if (term.length === 0) {
      return this.filterInvoiceClients = this.invoices
    }
    this._searchService.search('invoiceClients', term).subscribe((resp: any) => {
      this.filterInvoiceClients = resp
    })
    return
  }

  createExcel() {
    for (let index = 0; index < this.filterInvoiceClients.length; index++) {
      this.newArray.push({
        ...this.filterInvoiceClients[index],
        total: this.getTotal(this.filterInvoiceClients[index]),
        total_payment: this.getTotalPayment(this.filterInvoiceClients[index]),
        type_change: this.typeChange(this.filterInvoiceClients[index]),
        total_mn: this.totalMN(this.filterInvoiceClients[index])
      })
    }
    const element = {
      data: this.newArray,
      headers: [
        'EMPRESA',
        'CECO',
        'NO. CLIENTE',
        'NOMBRE CLIENTE',
        'NO FACTURA',
        'FECHA CARGA',
        'FECHA FACTURA',
        'FECHA VENCIMIENTO',
        'TOTAL FACTURA',
        'A PAGAR',
        'DIVISA',
        'T.C.',
        'TOTAL M.N.',
        'DESCRIPCION'
      ]
    }
    this._excelService.downloadExcel(element, 'FacturasClientes', 'invoiceClients')
  }

  openDialogUploadExcel(){
    let dialogRef = this._dialog.open(ImportFileComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getInvoiceClients()
    })
  }

}
