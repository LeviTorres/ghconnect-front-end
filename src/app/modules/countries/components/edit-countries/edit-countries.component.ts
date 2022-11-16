import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Divisa } from '../../../../models/Divisa.model';
import { Country } from '../../../../models/Country.model';
import { CountriesService } from '../../../../services/countries.service';
import { DivisasService } from '../../../../services/divisas.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-countries',
  templateUrl: './edit-countries.component.html',
  styleUrls: ['./edit-countries.component.scss']
})
export class EditCountriesComponent implements OnInit {

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
    private _dialogRef: MatDialogRef<EditCountriesComponent>,
    private _spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public countryData: Country
  ) { }

  ngOnInit(): void {
    this.initValuesForm()
    this.getDivisas()
  }

  initValuesForm(){
   this.registerForm.patchValue({
    name: this.countryData.name,
    nationality: this.countryData.nationality,
    divisa: this.countryData.divisa?._id
   })
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

      this._countriesService.updateCountry(this.registerForm.value, this.countryData._id!)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Pais actualizado con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

}
