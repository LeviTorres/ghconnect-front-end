import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvidersService } from '../../../../services/providers.service';
import { Provider } from '../../../../models/Provider.model';
import { Validators, FormBuilder } from '@angular/forms';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.scss']
})
export class EditProviderComponent implements OnInit {

  public provider:any;

  public payment_conditions: any;

  public providerForm = this._fb.group({
    key_provider: [ '', Validators.required ],
    name: [ '', Validators.required ],
    nit: ['', Validators.required ],
    third_type: ['', Validators.required ],
    society_type: ['', Validators.required ],
    provider_type: ['', Validators.required ],
    phone_number: ['', Validators.required ],
    mobile_number: ['', Validators.required ],
    email: ['', [ Validators.required, Validators.email ] ],
    payment_conditions: ['', Validators.required ],
  })

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _providerService:ProvidersService,
    private _fb:FormBuilder,
    private _paymentConditionsService: PaymentConditionsService,
    private _spinner: NgxSpinnerService,
    private _toastr:ToastrService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._spinner.show()
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this.getProviders(params.provider)
    })
    this.getPaymentConditions()
  }

  public initValuesForm(){
    this._spinner.show()
    this.providerForm.patchValue({
      key_provider: this.provider.key_provider,
      name: this.provider.name,
      nit: this.provider.nit,
      third_type: this.provider.third_type,
      society_type: this.provider.society_type,
      phone_number: this.provider.phone_number,
      mobile_number: this.provider.mobile_number,
      email: this.provider.email,
      provider_type: this.provider.provider_type,
      payment_conditions: this.provider.payment_conditions._id
    })
  }

  getPaymentConditions(){
    this._spinner.show()
    this._paymentConditionsService.getPaymentConditions().subscribe((item:any) => {
      this.payment_conditions = item
      this._spinner.hide()
    })
  }

  getProviders(id: string){
    this._spinner.show()
    this._providerService.getProviders().subscribe((providers:Provider[]) => {
      this.provider = providers.find((provider: Provider) => provider._id === id)
      this.initValuesForm()
      this._spinner.hide()
    })
  }

  registerProvider(){
    this._spinner.show()
      if(this.providerForm.invalid){
        this._spinner.hide()
        return
      }
      const element = {
        ...this.providerForm.value,
      }

      this._providerService.updateProvider(element, this.provider._id)
        .subscribe(( res:any ) => {
          this._router.navigateByUrl('/providers')
          this._spinner.hide()
          this._toastr.success('Proveedor actualizado con Exito')
        }, (err:any) =>{
          this._spinner.hide()
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }
}
