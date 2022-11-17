import { Component, OnInit, Inject } from '@angular/core';
import { InvoiceClient } from '../../../../models/InvoiceClients.model';
import { Exchange } from '../../../../models/Exchange.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceClientsService } from '../../../../services/invoice-clients.service';
import { ExchangesService } from '../../../../services/exchanges.service';

@Component({
  selector: 'app-modal-tracking',
  templateUrl: './modal-tracking.component.html',
  styleUrls: ['./modal-tracking.component.scss']
})
export class ModalTrackingComponent implements OnInit {

  public invoiceClients: InvoiceClient[] = []
  public exchanges: Exchange[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public invoiceData: InvoiceClient,
    private _invoiceService: InvoiceClientsService,
    private _exchangeService: ExchangesService
  ) { }

  ngOnInit(): void {
    this.getInvoiceClients()
    this.getExchanges()
  }

  getInvoiceClients(){
    this._invoiceService.getInvoiceClients().subscribe((resp:InvoiceClient[]) => {
      this.invoiceClients = resp.filter((invoice:InvoiceClient) => invoice.key_invoice === this.invoiceData.key_invoice)
    })
  }

  getExchanges(){
    this._exchangeService.getExchanges().subscribe((resp:Exchange[]) => {
      this.exchanges = resp
    })
  }

  getTotal(invoice:InvoiceClient){
    const divisa = invoice.divisa
    if(divisa?.abbreviation_divisa === 'BOB'){
      if(invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15' ){
        return invoice.invoice_total
      }else {
        return Number(invoice.invoice_total) * -1
      }
    }else{
      const exchange = this.exchanges.find((item:Exchange) => item.date_exchange === invoice.invoice_date);
      if(exchange){
        if(divisa && exchange){
          if(invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15'){
            return Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
          }else {
            return (Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)) * -1
          }
        }else {
          return 0
        }
      }else{
        return 0
      }
    }
  }

  getTotalMN(){
    let total:number = 0
      this.invoiceClients.forEach((invoice:InvoiceClient) =>{
        const divisa = invoice.divisa
        if(divisa?.abbreviation_divisa === 'BOB'){
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
            }else {
              total -= Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
            }
          }
        }
      });
      return total
  }

}
