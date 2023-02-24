import { Component, OnInit } from '@angular/core';
import { ProvidersService } from '../../../../services/providers.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-add-providers',
  templateUrl: './add-providers.component.html',
  styleUrls: ['./add-providers.component.scss']
})
export class AddProvidersComponent implements OnInit {

  public payment_conditions: any;

  public history: any[] = []
  public user:any

  public third_types_array: any[] = [
    { name: 'Proveedor' },
    { name: 'Intercompañia' },
    { name: 'Empleado' }
  ]

  public society_types_array: any[] = [
    { name: 'Natural' },
    { name: 'Unipersonal' },
    { name: 'Juridica' }
  ]

  public provider_array: any[] = [
    { name: 'Nacional' },
    { name: 'Extranjero' }
  ]

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
    private _providerService: ProvidersService,
    private _paymentConditionsService: PaymentConditionsService,
    private _toastr:ToastrService,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _fb:FormBuilder,
    private _loginService: LoginService
  ) {
    this.user = _loginService.user
   }

  ngOnInit(): void {
    this.getPaymentConditions()
  }

  getPaymentConditions(){
    this._paymentConditionsService.getPaymentConditions().subscribe((item:any) => {
      this.payment_conditions = item
    })
  }

  registerProvider(){
    this._spinner.show()
      if(this.providerForm.invalid){
        this._spinner.hide()
        return
      }
      this.history.push({
        user: this.user._id,
        note: `Proveedor creado`,
        date: new Date().getTime(),
        type: 'note'
      })


      const element = {
        ...this.providerForm.value,
        activities: this.history,
      }

      this._providerService.createProvider(element)
        .subscribe(( res:any ) => {
          //this._router.navigateByUrl('/providers')
          this._router.navigate(['/providers/edit-provider'],
            {
              queryParams: {
                provider: res._id,
              }
            });
          this._spinner.hide()
          //this._toastr.success('Proveedor registrado con Exito')
        }, (err:any) =>{
          this._spinner.hide()
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

}
