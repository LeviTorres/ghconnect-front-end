import { Component, OnInit } from '@angular/core';
import { Country } from '../../../../models/Country.model';
import { Validators, FormBuilder } from '@angular/forms';
import { CountriesService } from '../../../../services/countries.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { DivisasService } from '../../../../services/divisas.service';
import { Divisa } from '../../../../models/Divisa.model';

@Component({
  selector: 'app-modal-countries',
  templateUrl: './modal-countries.component.html',
  styleUrls: ['./modal-countries.component.scss']
})
export class ModalCountriesComponent implements OnInit {

  public country: Country[] = []

  public divisas: Divisa[] = []

  public registerForm = this._fb.group({
    name: ['', Validators.required ],
    nationality: [ '', Validators.required ],
    divisa: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _countriesService: CountriesService,
    private _divisaService:DivisasService,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<ModalCountriesComponent>,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getDivisas()
  }

  getDivisas(){
    this._spinner.show()
    this._divisaService.getDivisas().subscribe((resp:any) => {
      this.divisas = resp
      this._spinner.hide()
    })
  }

  registerCountry() {
      this._spinner.show()
      if(this.registerForm.invalid ){
        this._spinner.hide()
        return
      }

      this._countriesService.createCountry(this.registerForm.value)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Pais registrado con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }
}
