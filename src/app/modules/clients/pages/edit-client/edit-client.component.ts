import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvidersService } from '../../../../services/providers.service';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../../../../services/clients.service';
import { Client } from '../../../../models/Client.model';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {
  public client:any;

  public payment_conditions: any;

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
    private _activatedRoute: ActivatedRoute,
    private _clientService: ClientsService,
    private _fb: FormBuilder,
    private _paymentConditionsService: PaymentConditionsService,
    private _spinner: NgxSpinnerService,
    private _toastr:ToastrService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._spinner.show()
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this.getClients(params.client)
    })
    this.getPaymentConditions()
  }

  public initValuesForm(){
    this._spinner.show()
    this.providerForm.patchValue({
      key_client: this.client.key_client,
      name: this.client.name,
      nit: this.client.nit,
      third_type: this.client.third_type,
      society_type: this.client.society_type,
      phone_number: this.client.phone_number,
      mobile_number: this.client.mobile_number,
      email: this.client.email,
      provider_type: this.client.provider_type,
      payment_conditions: this.client.payment_conditions
    })
  }

  getPaymentConditions(){
    this._spinner.show()
    this._paymentConditionsService.getPaymentConditions().subscribe((item:any) => {
      this.payment_conditions = item
      this._spinner.hide()
    })
  }

  getClients(id: string){
    this._spinner.show()
    this._clientService.getClients().subscribe((clients:Client[]) => {
      this.client = clients.find((client: Client) => client._id === id)
      this.initValuesForm()
      this._spinner.hide()
    })
  }

  registerClient(){
    this._spinner.show()
      if(this.providerForm.invalid){
        this._spinner.hide()
        return
      }
      const element = {
        ...this.providerForm.value,
      }

      this._clientService.updateClient(element, this.client._id)
        .subscribe(( res:any ) => {
          this._router.navigateByUrl('/clients')
          this._spinner.hide()
          this._toastr.success('Cliente actualizado con Exito')
        }, (err:any) =>{
          this._spinner.hide()
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

}
