import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExchangesService } from '../../../../services/exchanges.service';
import { Exchange } from '../../../../models/Exchange.model';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditExchangesComponent } from '../../../exchanges/components/edit-exchanges/edit-exchanges.component';

@Component({
  selector: 'app-details-exchanges',
  templateUrl: './details-exchanges.component.html',
  styleUrls: ['./details-exchanges.component.scss']
})
export class DetailsExchangesComponent implements OnInit {

  public type: string = ''
  public exchanges: Exchange[] = []
  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _activatedRoute:ActivatedRoute,
    private _exchangeService: ExchangesService,
    private _spinner: NgxSpinnerService,
    private _toastr:ToastrService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  this._activatedRoute.queryParams.subscribe((params:any) => {
    this.getExchanges(params.type)
  })
  }

  getExchanges(type:string){
    this._exchangeService.getExchanges().subscribe((exchanges: Exchange[]) => {
      this.exchanges = exchanges.filter((exchange: Exchange) => exchange.type_exchange === type)
    })
  }

  delete(exchange:Exchange){
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if(result.value){
        this._spinner.show()
        this._exchangeService.deleteExchange(exchange).subscribe(() => {
          this.getExchanges(exchange.type_exchange)
          this._spinner.hide()
          this._toastr.success(`Tipo de cambio eliminado con exito`)
        })

      }
    })
  }

  openDialogEditExchange(exchange:Exchange){
    let dialogRef = this._dialog.open(EditExchangesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: exchange
    });
    dialogRef.beforeClosed().subscribe(() => {
        this.getExchanges(exchange.type_exchange)
    })
  }

}
