import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Divisa } from '../../../../models/Divisa.model';
import { DivisasService } from '../../../../services/divisas.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal-divisa',
  templateUrl: './modal-divisa.component.html',
  styleUrls: ['./modal-divisa.component.scss']
})
export class ModalDivisaComponent implements OnInit {

  public sameName: boolean = false;

  public divisa: Divisa[] = []

  public registerForm = this._fb.group({
    name: ['', Validators.required ],
    abbreviation_divisa: [ '', Validators.required ],
    symbol: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _divisaService: DivisasService,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<ModalDivisaComponent>,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

  }

  registerDivisa() {
      this._spinner.show()
      if(this.registerForm.invalid ){
        this._spinner.hide()
        return
      }

      this._divisaService.createDivisa(this.registerForm.value)
        .subscribe(( res:any ) => {
          console.log(res);
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Divisa registrado con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }
}
