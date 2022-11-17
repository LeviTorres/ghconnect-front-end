import { Component, OnInit } from '@angular/core';
import { Divisa } from '../../../../models/Divisa.model';
import { MovementType } from '../../../../models/MovementType.model';
import { Client } from '../../../../models/Client.model';
import { Ceco } from '../../../../models/Ceco.model';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceClientsService } from '../../../../services/invoice-clients.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientsService } from '../../../../services/clients.service';
import { CecosService } from '../../../../services/cecos.service';
import { DivisasService } from '../../../../services/divisas.service';
import { MovementsTypeService } from '../../../../services/movements-type.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-invoice-clients',
  templateUrl: './add-invoice-clients.component.html',
  styleUrls: ['./add-invoice-clients.component.scss']
})
export class AddInvoiceClientsComponent implements OnInit {

  public divisas: Divisa[] = []
  public movements: MovementType[] = []
  public clients: Client[] = []
  public cecos: Ceco[] = []

  public invoiceForm = this._fb.group({
    ceco: ['', Validators.required ],
    client: ['', Validators.required],
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
    private _invoiceClientService: InvoiceClientsService,
    private _spinner: NgxSpinnerService,
    private _clientService: ClientsService,
    private _cecosService: CecosService,
    private _divisasService: DivisasService,
    private _movementsService: MovementsTypeService,
    private _fb: FormBuilder,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCecos()
    this.getMovements()
    this.getDivisas()
    this.getClients()
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

  getClients(){
    this._spinner.show()
    this._clientService.getClients().subscribe((item:any)  => {
      this.clients = item
      this._spinner.hide()
    })
  }

  registerInvoice(){

      this._spinner.show()
    if(this.invoiceForm.invalid){
      this._spinner.hide()
      return
    }

    const element = {
      ceco: this.invoiceForm.controls['ceco'].value,
      client: this.invoiceForm.controls['client'].value,
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

    this._invoiceClientService.createInvoiceClient(element)
    .subscribe(( res:any ) => {
      this._router.navigateByUrl('/invoice-clients')
      this._spinner.hide()
      this._toastr.success('Factura creada con Exito')
    }, (err:any) =>{
      this._spinner.hide()
      console.warn(err.error.msg)
      this._toastr.error(`${err.error.msg}`)
    })
  }
}
