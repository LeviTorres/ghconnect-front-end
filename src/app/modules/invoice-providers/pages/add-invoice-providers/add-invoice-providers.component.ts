import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceProvidersService } from '../../../../services/invoice-providers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProvidersService } from '../../../../services/providers.service';
import { CecosService } from '../../../../services/cecos.service';
import { DivisasService } from '../../../../services/divisas.service';
import { MovementsTypeService } from 'src/app/services/movements-type.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Divisa } from '../../../../models/Divisa.model';
import { MovementType } from 'src/app/models/MovementType.model';
import { Provider } from '../../../../models/Provider.model';
import { Ceco } from '../../../../models/Ceco.model';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-add-invoice-providers',
  templateUrl: './add-invoice-providers.component.html',
  styleUrls: ['./add-invoice-providers.component.scss']
})
export class AddInvoiceProvidersComponent implements OnInit {

  public divisas: Divisa[] = []
  public movements: MovementType[] = []
  public providers: Provider[] = []
  public cecos: Ceco[] = []

  public filteredOptions: any[] = [];
  public filteredOptionsCeco: any[] = [];

  public showOption: boolean = false;
  public history: any[] = []
  public user:any

  public invoiceForm = this._fb.group({
    ceco: ['', Validators.required ],
    provider: ['', Validators.required],
    key_invoice: ['', Validators.required],
    upload_date: ['', Validators.required],
    invoice_date: ['', Validators.required],
    expiration_date: ['', Validators.required],
    invoice_total: ['', Validators.required],
    divisa: ['', Validators.required],
    description: ['', Validators.required],
    movement_type: ['', Validators.required]
  })

  constructor(
    private _router:Router,
    private _invoiceProvidersService: InvoiceProvidersService,
    private _spinner: NgxSpinnerService,
    private _providersService: ProvidersService,
    private _cecosService: CecosService,
    private _divisasService: DivisasService,
    private _movementsService: MovementsTypeService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _loginService: LoginService
  ) {
    this.user = _loginService.user
  }

  ngOnInit(): void {
    this.getCecos()
    this.getMovements()
    this.getDivisas()
    this.getProviders()
    this.invoiceForm.controls['provider'].valueChanges.subscribe((inputValue: any) => {
      this.filterData(inputValue)
    })
    this.invoiceForm.controls['ceco'].valueChanges.subscribe((inputValue: any) => {
      this.filterDataCeco(inputValue)
    })
  }

  public displayFn(provider: any): string {
    return provider && `${provider.name}` ? `${provider.name}` : '';
  }

  public displayFnCeco(ceco: any): string {
    return ceco && `${ceco.name_short}` ? `${ceco.name_short}` : '';
  }

  public filterData(value: string){
    this.filteredOptions = this.providers.filter(item =>  {
      this.displayFn(item)
      return  item.name.toLowerCase().indexOf(value) > -1 || item.key_provider.toLowerCase().indexOf(value) > -1
    })
  }

  public filterDataCeco(value: string){
    this.filteredOptionsCeco = this.cecos.filter(item =>  {
      this.displayFnCeco(item)
      return  item.name_short.toLowerCase().indexOf(value) > -1 ||
              item.key_ceco_business.toLowerCase().indexOf(value) > -1
    })
  }

  public opcionSeleccionada($event:MatAutocompleteSelectedEvent){
    this.showOption = true;
  }

  getMovements(){
    this._spinner.show()
    this._movementsService.getMovementsType().subscribe((item:any) => {
      this.movements = item
      this._spinner.hide()
    })
  }

  getCecos(){
    this._spinner.show()
    this._cecosService.getCecos().subscribe((item: any) => {
      this.cecos = item
      this._spinner.hide()
    })
  }

  getDivisas() {
    this._spinner.show()
    this._divisasService.getDivisas().subscribe((item:any) => {
      this.divisas = item
      this._spinner.hide()
    })
  }

  getProviders(){
    this._spinner.show()
    this._providersService.getProviders().subscribe((item:any)  => {
      this.providers = item
      this._spinner.hide()
    })
  }

  registerInvoice(){

  this._spinner.show()
   if(this.invoiceForm.invalid){
      this._spinner.hide()
      return
   }
   let provider:any;
   const providerSelect: any = this.invoiceForm.controls['provider'].value
   if(providerSelect._id){
    provider = providerSelect;
   }else {
    const findProvider = this.providers.find((provider:Provider) => provider.key_provider.trim().toLowerCase() === this.invoiceForm.controls['provider'].value?.trim().toLowerCase() || provider.name.toLowerCase().trim() === this.invoiceForm.controls['provider'].value?.trim().toLowerCase())
    provider = findProvider
   }
   if(!provider){
      this._spinner.hide()
      this._toastr.error('No se ha seleccionado un proveedor correctamente')
      return
   }

   let ceco:any;
   const cecoSelect: any = this.invoiceForm.controls['ceco'].value
   if(cecoSelect._id){
    ceco = cecoSelect;
   }else {
    const findCeco = this.cecos.find((ceco:Ceco) => ceco.key_ceco_business.trim().toLowerCase() === this.invoiceForm.controls['ceco'].value?.trim().toLowerCase() || ceco.name_short.toLowerCase().trim() === this.invoiceForm.controls['ceco'].value?.trim().toLowerCase())
    ceco = findCeco
   }
   if(!ceco){
      this._spinner.hide()
      this._toastr.error('No se ha seleccionado un ceco correctamente')
      return
   }

   this.history.push({
      user: this.user._id,
      note: `Factura creada`,
      date: new Date().getTime(),
      type: 'note'
    })

    const element = {
      activities: this.history,
      ceco: ceco._id,
      provider: provider._id,
      key_invoice: this.invoiceForm.controls['key_invoice'].value,
      upload_date: new Date(this.invoiceForm.controls['upload_date'].value!).getTime(),
      invoice_date: new Date(this.invoiceForm.controls['invoice_date'].value!).getTime(),
      expiration_date: new Date(this.invoiceForm.controls['expiration_date'].value!).getTime(),
      invoice_total: this.invoiceForm.controls['invoice_total'].value,
      divisa: this.invoiceForm.controls['divisa'].value,
      description: this.invoiceForm.controls['description'].value,
      movement_type: this.invoiceForm.controls['movement_type'].value,
      status: 'draft'
    }

    this._invoiceProvidersService.createInvoiceProvider(element)
    .subscribe(( res:any ) => {
      //this._router.navigateByUrl('/invoice-providers')
      this._router.navigate(['/invoice-providers/edit-invoice-provider'],
            {
              queryParams: {
                invoice: res._id,
              }
            });
      this._spinner.hide()
      //this._toastr.success('Factura creada con Exito')
    }, (err:any) =>{
      this._spinner.hide()
      console.warn(err.error.msg)
      this._toastr.error(`${err.error.msg}`)
    })


  }

}
