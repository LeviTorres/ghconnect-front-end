import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { DivisasService } from '../../../../services/divisas.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Divisa } from '../../../../models/Divisa.model';

@Component({
  selector: 'app-edit-divisas',
  templateUrl: './edit-divisas.component.html',
  styleUrls: ['./edit-divisas.component.scss']
})
export class EditDivisasComponent implements OnInit {

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
    private _dialogRef: MatDialogRef<EditDivisasComponent>,
    private _spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public divisaData: Divisa
  ) { }

  ngOnInit(): void {
    this.initValuesForm()
  }

  initValuesForm(){
    this.registerForm.patchValue({
      name: this.divisaData.name,
      abbreviation_divisa: this.divisaData.abbreviation_divisa,
      symbol: this.divisaData.symbol,
    })
  }

  registerDivisa() {
      this._spinner.show()
      if(this.registerForm.invalid ){
        this._spinner.hide()
        return
      }

      this._divisaService.updateDivisa(this.registerForm.value,this.divisaData._id!)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Divisa actualizada con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

}
