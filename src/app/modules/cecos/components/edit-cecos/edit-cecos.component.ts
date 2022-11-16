import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Ceco } from '../../../../models/Ceco.model';
import { Business } from '../../../../models/Business.model';
import { CecosService } from '../../../../services/cecos.service';
import { BusinessService } from '../../../../services/business.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-cecos',
  templateUrl: './edit-cecos.component.html',
  styleUrls: ['./edit-cecos.component.scss']
})
export class EditCecosComponent implements OnInit {

  public cecos: Ceco[] = []

  public business: Business[] = []

  public registerForm = this._fb.group({
    name_large: ['', Validators.required ],
    name_short: ['', Validators.required ],
    key_ceco: [ '', Validators.required ],
    business: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _cecosService: CecosService,
    private _businessService: BusinessService,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<EditCecosComponent>,
    private _spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public cecoData: Ceco
  ) { }

  ngOnInit(): void {
    this.initValuesForm()
    this.getBusiness()
  }

  initValuesForm(){
    this.registerForm.patchValue({
      name_large: this.cecoData.name_large,
      name_short: this.cecoData.name_short,
      key_ceco: this.cecoData.key_ceco,
      business: this.cecoData.business?._id,
    })
  }

  getBusiness(){
    this._spinner.show()
    this._businessService.getBusiness().subscribe((resp:any) => {
      this.business = resp
      this._spinner.hide()
    })
  }

  registerCeco() {
      this._spinner.show()
      if(this.registerForm.invalid ){
        this._spinner.hide()
        return
      }

      const busin:any = this.registerForm.controls['business'].value

      const filterBusin = this.business.find((business: Business) => business._id === busin)

      const element: any = {
        name_large: this.registerForm.controls['name_large'].value?.trim(),
        name_short: this.registerForm.controls['name_short'].value?.trim(),
        key_ceco: this.registerForm.controls['key_ceco'].value?.trim(),
        business: busin,
        key_ceco_business: `${filterBusin?.key_business}-${this.registerForm.controls['key_ceco'].value?.trim()}`
      }

      this._cecosService.updateCeco(element, this.cecoData._id!)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Ceco actualizado con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
          this._spinner.hide()
        })
  }

}
