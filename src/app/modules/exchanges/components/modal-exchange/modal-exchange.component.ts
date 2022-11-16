import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExchangesService } from '../../../../services/exchanges.service';
import { Divisa } from '../../../../models/Divisa.model';
import { DivisasService } from '../../../../services/divisas.service';
import { Exchange } from '../../../../models/Exchange.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-exchange',
  templateUrl: './modal-exchange.component.html',
  styleUrls: ['./modal-exchange.component.scss']
})
export class ModalExchangeComponent implements OnInit {

  public national: Divisa[] = []
  public foreign: Divisa[] = []
  public exchanges: Exchange[] = []

  public sameCountries: boolean = true;

  public exchangeForm = this._fb.group({
    national_currency: ['', Validators.required ],
    foreign_currency: [ '', Validators.required ],
    date_exchange: [ '', Validators.required ],
    exchange_rate_amount: ['', Validators.required]
  })

  constructor(
    private _fb:FormBuilder,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _exchangeService: ExchangesService,
    private _divisaService: DivisasService,
    private _dialogRef: MatDialogRef<ModalExchangeComponent>,
  ) { }

  ngOnInit(): void {
    this.getDivisas()
  }

  getExchanges(){
    this._spinner.show()
    this._exchangeService.getExchanges().subscribe((resp:Exchange[]) => {
      this.exchanges = resp
      this._spinner.hide()
    })
  }

  getDivisas(){
    this._spinner.show()
    this._divisaService.getDivisas().subscribe((resp:Divisa[]) => {
      this.national = resp.filter((divisa:Divisa) => divisa.abbreviation_divisa != 'USD' && divisa.abbreviation_divisa != 'EUR')
      this.foreign = resp.filter((divisa:Divisa) => divisa.abbreviation_divisa === 'USD' || divisa.abbreviation_divisa === 'EUR')
      this.getExchanges()
      this._spinner.hide()
    })
  }

  registerExchange(){
    this._spinner.show()
    if(this.exchangeForm.invalid){
      this._spinner.hide()
      return
    }
    const valueNational: any = this.exchangeForm.controls['national_currency'].value
    const valueForeign: any = this.exchangeForm.controls['foreign_currency'].value
    const type: any = `${valueNational.abbreviation_divisa}-${valueForeign.abbreviation_divisa}`
    const validateFullCurrencys = this.exchanges.some((exchange:Exchange) => {
      return (exchange.type_exchange === type)
    })

    if(validateFullCurrencys){
      this._toastr.error('Selecciona otras monedas','Tipo de cambio previamente creado')
      this._spinner.hide()
      return
    }

    const element = {
      national_currency: valueNational._id,
      foreign_currency: valueForeign._id,
      date_exchange: new Date(this.exchangeForm.controls['date_exchange'].value!).getTime(),
      exchange_rate_amount: Number(this.exchangeForm.controls['exchange_rate_amount'].value!),
      type_exchange: type
    }
    this._exchangeService.createExchange(element)
        .subscribe(() => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Tipo de cambio registrado con Exito')
        }, (err:any) =>{
          this._spinner.hide()
          console.log(err)
          this._toastr.error(`${err.error.msg}`)
        })
  }
}
