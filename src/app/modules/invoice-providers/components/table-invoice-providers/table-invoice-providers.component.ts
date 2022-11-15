import { Component, OnInit } from '@angular/core';
import { InvoiceProvidersService } from '../../../../services/invoice-providers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { InvoiceProviders } from '../../../../models/InvoiceProviders.model';
import { Divisa } from '../../../../models/Divisa.model';
import { DivisasService } from '../../../../services/divisas.service';

@Component({
  selector: 'app-table-invoice-providers',
  templateUrl: './table-invoice-providers.component.html',
  styleUrls: ['./table-invoice-providers.component.scss']
})
export class TableInvoiceProvidersComponent implements OnInit {

  public invoiceProviders: InvoiceProviders[] = []
  public invoiceProvidersTemp: InvoiceProviders[] = []
  public divisas: Divisa[] = []

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _invoiceProvidersService: InvoiceProvidersService,
    private _spinner: NgxSpinnerService,
    private _searchService: SearchService,
    private _toastr:ToastrService,
    private _divisaService: DivisasService
  ) { }

  ngOnInit(): void {
    this.getInvoiceProviders()
    this.getDivisas()
  }

  getInvoiceProviders(){
    this._spinner.show()
    this._invoiceProvidersService.getInvoiceProviders().subscribe((resp:any) => {
      this.invoiceProviders = resp
      this.invoiceProvidersTemp = resp
      this._spinner.hide()
    })
  }

  getDivisas(){
    this._spinner.show()
    this._divisaService.getDivisas().subscribe((resp:any) => {
      this.divisas = resp
      this._spinner.hide()
    })
  }
/*
  getTotal(invoice: InvoiceProviders){
    let total:number = 0
      const array = this.data.filter((item:InoviceProviders) => item.key_invoice === invoice.key_invoice)
      array.forEach((invoice:InvoiceProviders) =>{
         const divisa = this.divisas.find((item:Divisa) => item._id === invoice.divisa)
        if(divisa?.abbreviation_divisa === 'BOB'){
          if(invoice.movement_type === '5' && divisa?.abbreviation_divisa === 'BOB'){
            total += 0
          }
          if((invoice.movement_type === '1' || invoice.movement_type === '2') && divisa?.abbreviation_divisa === 'BOB'){
              total += invoice.invoice_total
          }
          if(invoice.movement_type != '1' && divisa?.abbreviation_divisa === 'BOB'){
            total -= invoice.invoice_total
          }
        }else{
          const exchange = this.exchanges_data.find((item:Exchange) => item.date_exchange === invoice.invoice_date);
          if(divisa && exchange){
            if(invoice.movement_type === '1' || invoice.movement_type === '2' ){
              total += Number(exchange.exchange_rate_amount) * invoice.invoice_total
            }else if(invoice.movement_type === '5'){
              total += 0
            }
            else{
              total -= Number(exchange.exchange_rate_amount) * invoice.invoice_total
            }
          }
        }
      })
      return total
  }

  getTotalPayment(invoice:InvoiceProviders){
    let total: number = 0
    const array = this.data.filter((item: InvoiceProviders) => item.key_invoice === invoice.key_invoice)
    array.forEach((invoice: InvoiceProviders) => {
      const divisa = this.divisas.find((item: Divisa) => item._id === invoice.divisa)
      if (divisa?.abbreviation_divisa === 'BOB') {
        if (invoice.movement_type === '1' && divisa?.abbreviation_divisa === 'BOB') {
          total += invoice.invoice_total
        }
        if (invoice.movement_type != '1' && divisa?.abbreviation_divisa === 'BOB') {
          total -= invoice.invoice_total
        }
      } else {
        const exchange = this.exchanges_data.find((item: Exchange) => item.date_exchange === invoice.invoice_date);
        if (divisa && exchange) {
          if (invoice.movement_type === '1') {
            total += Number(exchange.exchange_rate_amount) * invoice.invoice_total
          } else {
            total -= Number(exchange.exchange_rate_amount) * invoice.invoice_total
          }
        }
      }
    })
    return total
  }

  public totalMN(invoice:any){
    return this.getTotalPayment(invoice) * this.typeChange(invoice);
  }

  public typeChange(invoice: InvoiceProviders) {
    const divisa = invoice.divisa.abbreviation_divisa

    if (divisa === 'BOB') {
      return Number(1)
    } else {
      const exchange = this.exchanges_data.filter((item: Exchange) => {
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
  } */
}
