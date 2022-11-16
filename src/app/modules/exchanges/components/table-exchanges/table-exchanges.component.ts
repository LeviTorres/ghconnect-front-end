import { Component, OnInit } from '@angular/core';
import { Exchange } from '../../../../models/Exchange.model';
import { ExchangesService } from '../../../../services/exchanges.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ModalExchangeComponent } from '../modal-exchange/modal-exchange.component';
import Swal from 'sweetalert2';
import { AddNewExchangesComponent } from '../../components/add-new-exchanges/add-new-exchanges.component';
import { EditExchangesComponent } from '../edit-exchanges/edit-exchanges.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-exchanges',
  templateUrl: './table-exchanges.component.html',
  styleUrls: ['./table-exchanges.component.scss']
})
export class TableExchangesComponent implements OnInit {

  public exchanges: Exchange[] = []
  public exchangesTemp: Exchange[] = []
  public filterExchanges: Exchange[] =[]

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _exchangeService: ExchangesService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _toastr:ToastrService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.getExchanges()
  }

  openDialogModalExchange(){
    let dialogRef = this._dialog.open(ModalExchangeComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
        this.getExchanges()
    })
  }

  openDialogNewExchange(exchange: Exchange){
    let dialogRef = this._dialog.open(AddNewExchangesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: exchange
    });
    dialogRef.beforeClosed().subscribe(() => {
        this.getExchanges()
    })
  }

  goToDetailsExchanges(exchage: Exchange){
    this._router.navigate(['/exchanges-divisas/details-exchanges'],
        {
          queryParams: {
            type: exchage.type_exchange,
          }
        });
  }

  openDialogEditExchange(exchange: Exchange){
    let dialogRef = this._dialog.open(EditExchangesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: exchange
    });
    dialogRef.beforeClosed().subscribe(() => {
        this.getExchanges()
    })
  }

  getExchanges(){
    this._spinner.show()
    this._exchangeService.getExchanges().subscribe((resp:any) => {
      this.exchanges = resp
      this.exchangesTemp = resp
      const array = this.exchanges.sort((a, b) => b.date_exchange - a.date_exchange);
      let hash: any = {};
      this.filterExchanges = array.filter((o: any) => hash[o.type_exchange] ? false : hash[o.type_exchange] = true);
      this._spinner.hide()
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
          this.getExchanges()
          this._spinner.hide()
          this._toastr.success(`Tipo de cambio eliminado con exito`)
        })

      }
    })
  }
}
