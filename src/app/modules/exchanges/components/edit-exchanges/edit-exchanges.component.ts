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
  selector: 'app-edit-exchanges',
  templateUrl: './edit-exchanges.component.html',
  styleUrls: ['./edit-exchanges.component.scss']
})
export class EditExchangesComponent implements OnInit {

  public dateValue: any
  public nationalValue:any
  public foreignValue:any
  public mountValue:any

  public exchangeForm = this._fb.group({
    exchange_rate_amount: ['', Validators.required]
  })

  constructor(
    private _fb:FormBuilder,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _exchangeService: ExchangesService,
    private _divisaService: DivisasService,
    private _dialogRef: MatDialogRef<EditExchangesComponent>,
    @Inject(MAT_DIALOG_DATA) public exchangeData: Exchange
  ) { }

  ngOnInit(): void {
    this.initValueForm()
    this.nationalValue = this.exchangeData.national_currency.name
    this.foreignValue = this.exchangeData.foreign_currency.name
    this.dateValue = new Date(this.exchangeData.date_exchange)
    this.mountValue = this.exchangeData.exchange_rate_amount
  }

  initValueForm(){
    this.exchangeForm.controls['exchange_rate_amount'].setValue(String(this.exchangeData.exchange_rate_amount))
  }

  registerExchange(){
    this._spinner.show()
    if(this.exchangeForm.invalid){
      this._spinner.hide()
      return
    }

    const element = {
      ...this.exchangeData,
      foreign_currency: this.exchangeData.foreign_currency._id,
      national_currency: this.exchangeData.national_currency._id,
      exchange_rate_amount: Number(this.exchangeForm.controls['exchange_rate_amount'].value!),
    }
    this._exchangeService.updateExchange(element, this.exchangeData._id!)
        .subscribe(() => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Tipo de cambio actualizado con Exito')
        }, (err:any) =>{
          this._spinner.hide()
          console.log(err)
          this._toastr.error(`${err.error.msg}`)
        })
  }

}
