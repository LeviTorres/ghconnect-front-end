import { Component, OnInit } from '@angular/core';
import { Business } from '../../../../models/Business.model';
import { Country } from '../../../../models/Country.model';
import { Validators, FormBuilder } from '@angular/forms';
import { CountriesService } from '../../../../services/countries.service';
import { DivisasService } from '../../../../services/divisas.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusinessService } from '../../../../services/business.service';

@Component({
  selector: 'app-modal-business',
  templateUrl: './modal-business.component.html',
  styleUrls: ['./modal-business.component.scss']
})
export class ModalBusinessComponent implements OnInit {

  public countries: Country[] = []

  public business: Business[] = []

  public registerForm = this._fb.group({
    name: ['', Validators.required ],
    name_short: ['', Validators.required ],
    key_business: [ '', Validators.required ],
    country: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _countriesService: CountriesService,
    private _businessService: BusinessService,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<ModalBusinessComponent>,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getCountries()
  }

  getCountries(){
    this._spinner.show()
    this._countriesService.getCountries().subscribe((resp:any) => {
      console.log(resp);
      this.countries = resp
      this._spinner.hide()
    })
  }

  registerBusiness() {
      this._spinner.show()
      if(this.registerForm.invalid ){
        this._spinner.hide()
        return
      }

      this._businessService.createBusiness(this.registerForm.value)
        .subscribe(( res:any ) => {
          console.log(res);
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Empresa registrada con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

}
