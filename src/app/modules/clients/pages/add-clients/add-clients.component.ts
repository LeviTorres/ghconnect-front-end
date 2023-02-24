import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ClientsService } from '../../../../services/clients.service';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.scss']
})
export class AddClientsComponent implements OnInit {

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
    key_client: [ '', Validators.required ],
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
    private _clientsService: ClientsService,
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

  registerClient(){
    this._spinner.show()
      if(this.providerForm.invalid){
        this._spinner.hide()
        return
      }

      this.history.push({
        user: this.user._id,
        note: `Cliente creado`,
        date: new Date().getTime(),
        type: 'note'
      })

      const element = {
        ...this.providerForm.value,
        activities: this.history,
      }

      this._clientsService.createClient(element)
        .subscribe(( res:any ) => {
          //this._router.navigateByUrl('/clients')
          console.log(res);

          this._router.navigate(['/clients/edit-client'],
            {
              queryParams: {
                client: res._id,
              }
            });
            this._spinner.hide();
          //this._toastr.success('Cliente registrado con Exito')
        }, (err:any) =>{
          this._spinner.hide()
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }


}
