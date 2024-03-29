import { Component, OnInit } from '@angular/core';
import { Ceco } from '../../../../models/Ceco.model';
import { Business } from '../../../../models/Business.model';
import { Validators, FormBuilder } from '@angular/forms';
import { CecosService } from '../../../../services/cecos.service';
import { BusinessService } from '../../../../services/business.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal-cecos',
  templateUrl: './modal-cecos.component.html',
  styleUrls: ['./modal-cecos.component.scss']
})
export class ModalCecosComponent implements OnInit {

  public cecos: Ceco[] = []

  public tenant_id: string = ''

  public business: Business[] = []

  public registerForm = this._fb.group({
    name_large: ['', Validators.required ],
    name_short: ['', Validators.required ],
    key_ceco: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _cecosService: CecosService,
    private _businessService: BusinessService,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<ModalCecosComponent>,
    private _spinner: NgxSpinnerService
  ) {
    this.tenant_id = this._cecosService.tenant
  }

  ngOnInit(): void {
    this.getBusiness()
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
      const findBusiness = this.business.find((business:Business) => business._id === this.tenant_id)
      const element: any = {
        name_large: this.registerForm.controls['name_large'].value?.trim(),
        name_short: this.registerForm.controls['name_short'].value?.trim(),
        key_ceco: this.registerForm.controls['key_ceco'].value?.trim(),
        business: findBusiness?._id,
        key_ceco_business: `${findBusiness?.key_business}-${this.registerForm.controls['key_ceco'].value?.trim()}`
      }

      this._cecosService.createCeco(element)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Ceco registrado con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
          this._spinner.hide()
        })
  }

}
