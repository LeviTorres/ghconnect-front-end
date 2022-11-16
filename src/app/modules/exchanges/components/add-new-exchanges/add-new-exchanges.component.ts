import { Component, OnInit, Inject } from '@angular/core';
import { Divisa } from '../../../../models/Divisa.model';
import { Exchange } from '../../../../models/Exchange.model';
import { Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExchangesService } from '../../../../services/exchanges.service';
import { DivisasService } from '../../../../services/divisas.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-exchanges',
  templateUrl: './add-new-exchanges.component.html',
  styleUrls: ['./add-new-exchanges.component.scss']
})
export class AddNewExchangesComponent implements OnInit {

  public national: Divisa[] = []
  public foreign: Divisa[] = []
  public exchanges: Exchange[] = []

  public exchangeValue: string = ''

  public sameCountries: boolean = true;

  public exchangeForm = this._fb.group({
    date_exchange: [ '', Validators.required ],
    exchange_rate_amount: ['', Validators.required]
  })

  constructor(
    private _fb:FormBuilder,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _exchangeService: ExchangesService,
    private _divisaService: DivisasService,
    private _dialogRef: MatDialogRef<AddNewExchangesComponent>,
    @Inject(MAT_DIALOG_DATA) public exchangeData: Exchange
  ) { }

  ngOnInit(): void {
    console.log(this.exchangeData);
    this.getExchanges()
    this.exchangeValue = `${this.exchangeData.national_currency.abbreviation_divisa} - ${this.exchangeData.foreign_currency.abbreviation_divisa}`
  }

  getExchanges(){
    this._spinner.show()
    this._exchangeService.getExchanges().subscribe((resp:Exchange[]) => {
      this.exchanges = resp
      this._spinner.hide()
    })
  }

  registerExchange(){
    this._spinner.show()
    if(this.exchangeForm.invalid){
      this._spinner.hide()
      return
    }
    const dateValue = new Date(this.exchangeForm.controls['date_exchange'].value!).getTime()

    const exchange_date = this.exchanges.some((exchange:Exchange) => {
      return exchange.date_exchange === dateValue
    })

    if(exchange_date){
      this._toastr.error('Selecciona otra fecha','Tipo de cambio previamente creado')
      this._spinner.hide()
      return
    }

    const element = {
      national_currency: this.exchangeData.national_currency._id,
      foreign_currency: this.exchangeData.foreign_currency._id,
      date_exchange: dateValue,
      exchange_rate_amount: Number(this.exchangeForm.controls['exchange_rate_amount'].value!),
      type_exchange: this.exchangeData.type_exchange
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
