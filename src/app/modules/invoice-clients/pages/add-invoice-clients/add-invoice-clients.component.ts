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
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-invoice-clients',
  templateUrl: './add-invoice-clients.component.html',
  styleUrls: ['./add-invoice-clients.component.scss'],
})
export class AddInvoiceClientsComponent implements OnInit {
  public divisas: Divisa[] = [];
  public movements: MovementType[] = [];
  public clients: Client[] = [];
  public cecos: Ceco[] = [];

  public filteredOptions: any[] = [];
  public filteredOptionsCeco: any[] = [];

  public showOption: boolean = false;

  public invoiceForm = this._fb.group({
    ceco: ['', Validators.required],
    client: ['', Validators.required],
    key_invoice: ['', Validators.required],
    upload_date: ['', Validators.required],
    invoice_date: ['', Validators.required],
    expiration_date: ['', Validators.required],
    invoice_total: ['', Validators.required],
    divisa: ['', Validators.required],
    description: ['', Validators.required],
    movement_type: ['', Validators.required],
  });

  constructor(
    private _router: Router,
    private _invoiceClientService: InvoiceClientsService,
    private _spinner: NgxSpinnerService,
    private _clientService: ClientsService,
    private _cecosService: CecosService,
    private _divisasService: DivisasService,
    private _movementsService: MovementsTypeService,
    private _fb: FormBuilder,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCecos();
    this.getMovements();
    this.getDivisas();
    this.getClients();
    this.invoiceForm.controls['client'].valueChanges.subscribe(
      (inputValue: any) => {
        this.filterData(inputValue);
      }
    );
    this.invoiceForm.controls['ceco'].valueChanges.subscribe(
      (inputValue: any) => {
        this.filterDataCeco(inputValue);
      }
    );
  }

  public displayFn(client: any): string {
    return client && `${client.name}` ? `${client.name}` : '';
  }

  public displayFnCeco(ceco: any): string {
    return ceco && `${ceco.name_short}` ? `${ceco.name_short}` : '';
  }

  public filterData(value: string) {
    this.filteredOptions = this.clients.filter((item) => {
      this.displayFn(item);
      return (
        item.name.toLowerCase().indexOf(value) > -1 ||
        item.key_client.toLowerCase().indexOf(value) > -1
      );
    });
  }

  public filterDataCeco(value: string) {
    this.filteredOptionsCeco = this.cecos.filter((item) => {
      this.displayFnCeco(item);
      return (
        item.name_short.toLowerCase().indexOf(value) > -1 ||
        item.key_ceco_business.toLowerCase().indexOf(value) > -1
      );
    });
  }

  public opcionSeleccionada($event: MatAutocompleteSelectedEvent) {
    this.showOption = true;
  }

  getMovements() {
    this._spinner.show();
    this._movementsService.getMovementsType().subscribe((item: any) => {
      this.movements = item;
      this._spinner.hide();
    });
  }

  getCecos() {
    this._spinner.show();
    this._cecosService.getCecos().subscribe((item: any) => {
      this.cecos = item;
      this._spinner.hide();
    });
  }

  getDivisas() {
    this._spinner.show();
    this._divisasService.getDivisas().subscribe((item: any) => {
      this.divisas = item;
      this._spinner.hide();
    });
  }

  getClients() {
    this._spinner.show();
    this._clientService.getClients().subscribe((item: any) => {
      this.clients = item;
      this._spinner.hide();
    });
  }

  registerInvoice() {
    this._spinner.show();
    if (this.invoiceForm.invalid) {
      this._spinner.hide();
      return;
    }

    let client: any;
    const clientSelect: any = this.invoiceForm.controls['client'].value;
    if (clientSelect._id) {
      client = clientSelect;
    } else {
      const findClient = this.clients.find(
        (client: Client) =>
          client.key_client.trim().toLowerCase() ===
            this.invoiceForm.controls['client'].value?.trim().toLowerCase() ||
          client.name.toLowerCase().trim() ===
            this.invoiceForm.controls['client'].value?.trim().toLowerCase()
      );
      client = findClient;
    }
    if (!client) {
      this._spinner.hide();
      this._toastr.error('No se ha seleccionado un cliente correctamente');
      return;
    }

    let ceco: any;
    const cecoSelect: any = this.invoiceForm.controls['ceco'].value;
    if (cecoSelect._id) {
      ceco = cecoSelect;
    } else {
      const findCeco = this.cecos.find(
        (ceco: Ceco) =>
          ceco.key_ceco_business.trim().toLowerCase() ===
            this.invoiceForm.controls['ceco'].value?.trim().toLowerCase() ||
          ceco.name_short.toLowerCase().trim() ===
            this.invoiceForm.controls['ceco'].value?.trim().toLowerCase()
      );
      ceco = findCeco;
    }
    if (!ceco) {
      this._spinner.hide();
      this._toastr.error('No se ha seleccionado un ceco correctamente');
      return;
    }

    const element = {
      ceco: ceco._id,
      client: client._id,

      key_invoice: String(this.invoiceForm.controls['key_invoice'].value),
      upload_date: new Date(
        this.invoiceForm.controls['upload_date'].value!
      ).getTime(),
      invoice_date: new Date(
        this.invoiceForm.controls['invoice_date'].value!
      ).getTime(),
      expiration_date: new Date(
        this.invoiceForm.controls['expiration_date'].value!
      ).getTime(),
      invoice_total: this.invoiceForm.controls['invoice_total'].value,
      divisa: this.invoiceForm.controls['divisa'].value,
      description: this.invoiceForm.controls['description'].value,
      movement_type: this.invoiceForm.controls['movement_type'].value,
      status: 'draft',
    };
    console.log(element);

    this._invoiceClientService.createInvoiceClient(element).subscribe(
      (res: any) => {
        this._router.navigateByUrl('/invoice-clients');
        this._spinner.hide();
        this._toastr.success('Factura creada con Exito');
      },
      (err: any) => {
        this._spinner.hide();
        console.warn(err.error.msg);
        this._toastr.error(`${err.error.msg}`);
      }
    );
  }
}
