import { Component, OnInit, Inject } from '@angular/core';
import { Country } from '../../../../models/Country.model';
import { Business } from '../../../../models/Business.model';
import { Validators, FormBuilder } from '@angular/forms';
import { CountriesService } from '../../../../services/countries.service';
import { BusinessService } from '../../../../services/business.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountriesOpenService } from '../../../../services/countries-open.service';

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.scss']
})
export class EditBusinessComponent implements OnInit {

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
    private _countriesOpenService:CountriesOpenService,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<EditBusinessComponent>,
    private _spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public businessData: Business
  ) { }

  ngOnInit(): void {
    this.initValuesForm()
    this.getCountriesOpen()
  }

  initValuesForm(){
    this.registerForm.patchValue({
      name: this.businessData.name,
      name_short: this.businessData.name_short,
      key_business: this.businessData.key_business,
      country: this.businessData.country?._id,
    })
  }

  getCountriesOpen(){
    this._spinner.show()
    this._countriesOpenService.getCountriesOpen().subscribe((resp:any) => {
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

      this._businessService.updateBusiness(this.registerForm.value,this.businessData._id!)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Empresa actualizada con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

}
