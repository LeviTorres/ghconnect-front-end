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
import { MatDialog } from '@angular/material/dialog';
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

  constructor(
    private _invoiceClientService: InvoiceClientsService,
    private _spinner: NgxSpinnerService,
    private _searchService: SearchService,
    private _toastr:ToastrService,
    private _divisaService: DivisasService,
    private _businessService: BusinessService,
    private _exchangeService: ExchangesService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getInvoiceClients()
    this.getDivisas()
    this.getBusiness()
    this.getExchanges()
  }

  getInvoiceClients(){
    this._spinner.show()
    this._invoiceClientService.getInvoiceClients().subscribe((resp:any) => {
      this.invoiceClients = resp
      this.filterInvoiceClients = this.invoiceClients.filter((item: InvoiceClient) => item.movement_type.key_movement === '14')
      this._spinner.hide()
    })
  }

  openDialogTracking(invoice: InvoiceClient){
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

  getDivisas(){
    this._spinner.show()
    this._divisaService.getDivisas().subscribe((resp:any) => {
      this.divisas = resp
      this._spinner.hide()
    })
  }

  getBusiness(){
    this._spinner.show()
    this._businessService.getBusiness().subscribe((resp:any) => {
      this.business = resp
      this._spinner.hide()
    })
  }

  getExchanges(){
    this._spinner.show()
    this._exchangeService.getExchanges().subscribe((resp:any) => {
      this.exchanges = resp
      this._spinner.hide()
    })
  }


  getBusin(id: any){
    const findBusiness = this.business.find((business:Business) => business._id === id)
    return findBusiness?.name_short
  }


  getTotal(invoice: InvoiceClient){
    let total:number = 0
      const array = this.invoiceClients.filter((item:InvoiceClient) => item.key_invoice === invoice.key_invoice)
      array.forEach((invoice:InvoiceClient) =>{
         const divisa = this.divisas.find((item:Divisa) => item._id === invoice.divisa._id)
        if(divisa?.abbreviation_divisa === 'BOB'){
          if(invoice.movement_type.key_movement === '51' && divisa?.abbreviation_divisa === 'BOB'){
            total += 0
          }
          if((invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15') && divisa?.abbreviation_divisa === 'BOB'){
              total += Number(invoice.invoice_total)
          }
          if(invoice.movement_type.key_movement != '14' && divisa?.abbreviation_divisa === 'BOB'){
            total -= Number(invoice.invoice_total)
          }
        }else{
          const exchange = this.exchanges.find((item:Exchange) => item.date_exchange === invoice.invoice_date);
          if(divisa && exchange){
            if(invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15' ){
              total += Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
            }else if(invoice.movement_type.key_movement === '51'){
              total += 0
            }
            else{
              total -= Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
            }
          }
        }
      })
      return total
  }

  getTotalPayment(invoice:InvoiceClient){
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

  public totalMN(invoice:any){
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
