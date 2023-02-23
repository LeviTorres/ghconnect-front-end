import { Component, OnInit, Inject } from '@angular/core';
import { InvoiceClient } from '../../../../models/InvoiceClients.model';
import { Exchange } from '../../../../models/Exchange.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceClientsService } from '../../../../services/invoice-clients.service';
import { ExchangesService } from '../../../../services/exchanges.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private _exchangeService: ExchangesService,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this._spinner.show()
    this.getInvoiceClients()
    this.getExchanges()
    this._spinner.hide()
  }

  getInvoiceClients() {
    this._spinner.show()
    this._invoiceService.getInvoiceClients().subscribe((resp: InvoiceClient[]) => {
      this.invoiceClients = resp.filter((invoice: InvoiceClient) => invoice.key_invoice === this.invoiceData.key_invoice)
      this._spinner.hide()
    })
  }

  getExchanges() {
    this._spinner.show()
    this._exchangeService.getExchanges().subscribe((resp: Exchange[]) => {
      this.exchanges = resp
      this._spinner.hide()
    })
  }

  getTotal(invoice:InvoiceClient){
    const divisa = invoice.divisa
    if(divisa?.abbreviation_divisa === 'BOB'){
      if(invoice.movement_type.type === 'CARGO'){
        return invoice.invoice_total
      }
      if(invoice.movement_type.type === 'ABONO'){
        return Number(invoice.invoice_total) * -1
      }
      return 0
    /* if(invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15' ){
        return invoice.invoice_total
      }else {
        return Number(invoice.invoice_total) * -1
      } */
    }else{

      return 0
      //const exchange = this.exchanges.find((item:Exchange) => item.date_exchange === invoice.invoice_date);
     /* if(exchange){
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
      } */

    }
  }

  getTotalMN(){
    let total:number = 0
      this.invoiceClients.forEach((invoice:InvoiceClient) =>{
        const divisa = invoice.divisa
        if(divisa?.abbreviation_divisa === 'BOB'){
          if(invoice.movement_type.type === 'CARGO'){
            total += Number(invoice.invoice_total)
          }
          if(invoice.movement_type.type === 'ABONO'){
            total -= Number(invoice.invoice_total)
          }

        /* if((invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15')){
              total += Number(invoice.invoice_total)
          }
          if(invoice.movement_type.key_movement != '14' && invoice.movement_type.key_movement != '15' ){
            total -= Number(invoice.invoice_total)
          } */
        }else{
          const exchange = this.exchanges.find((item:Exchange) => item.date_exchange === invoice.invoice_date);
         /* if(divisa && exchange){
            if(invoice.movement_type.key_movement === '14' || invoice.movement_type.key_movement === '15' ){
              total += Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
            }else {
              total -= Number(exchange.exchange_rate_amount) * Number(invoice.invoice_total)
            }
          } */
        }
      });
      return total
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
        this._invoiceService.deleteInvoiceClient(invoice).subscribe(() => {
          this.getInvoiceClients()
          this._spinner.hide()
          this._toastr.success(`Factura ${invoice.key_invoice} eliminada con exito`)
        })

      }
    })
  }

}
