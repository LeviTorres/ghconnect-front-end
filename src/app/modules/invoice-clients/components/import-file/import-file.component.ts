import { Component, OnInit } from '@angular/core';
import { InvoiceClient } from '../../../../models/InvoiceClients.model';
import { CecosService } from '../../../../services/cecos.service';
import { ClientsService } from '../../../../services/clients.service';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { InvoiceClientsService } from '../../../../services/invoice-clients.service';
import * as XLSX from 'xlsx';
import { PaymentConditions } from '../../../../models/PaymentConditions.model';
import { MovementsTypeClientService } from '../../../../services/movements-type-client.service';
import { DivisasService } from '../../../../services/divisas.service';
import { Client } from '../../../../models/Client.model';
import { Ceco } from '../../../../models/Ceco.model';
import { Divisa } from '../../../../models/Divisa.model';
import { MovementTypeClient } from '../../../../models/MovementTypeClient.model';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss'],
})
export class ImportFileComponent implements OnInit {
  public tenant: any;
  public invoiceClients: InvoiceClient[] = [];
  public clients: Client[] = [];
  public cecos: Ceco[] = [];
  public divisas: Divisa[] = [];
  public movementTypes: MovementTypeClient[] = [];
  public validateExcel: boolean = true;

  public history: any[] = [];
  public user: any;

  public third_types_array: any[] = [
    { name: 'Proveedor' },
    { name: 'Intercompañia' },
    { name: 'Empleado' },
  ];

  public society_types_array: any[] = [
    { name: 'Natural' },
    { name: 'Unipersonal' },
    { name: 'Juridica' },
  ];

  public provider_array: any[] = [{ name: 'Nacional' }, { name: 'Extranjero' }];

  constructor(
    private _cecoService: CecosService,
    private _clientService: ClientsService,
    private _invoiceClientService: InvoiceClientsService,
    private _paymentConditionsService: PaymentConditionsService,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _dialogRef: MatDialogRef<ImportFileComponent>,
    private _movementTypeService: MovementsTypeClientService,
    private _divisaService: DivisasService,
    private _loginService: LoginService
  ) {
    this.tenant = localStorage.getItem('tenant');
    this.user = _loginService.user;
  }

  ngOnInit(): void {
    this.getInvoiceClients();
    this.getClients();
    this.getCecos();
    this.getMovementTypes();
    this.getDivisas();
  }

  getDivisas() {
    this._divisaService.getDivisas().subscribe((divisas: Divisa[]) => {
      this.divisas = divisas;
    });
  }

  getMovementTypes() {
    this._movementTypeService
      .getMovementsTypeClient()
      .subscribe((movementTypes: MovementTypeClient[]) => {
        this.movementTypes = movementTypes;
      });
  }

  getCecos() {
    this._cecoService.getCecos().subscribe((cecos: Ceco[]) => {
      this.cecos = cecos;
    });
  }

  getClients() {
    this._clientService.getClients().subscribe((clients: Client[]) => {
      this.clients = clients;
    });
  }

  getInvoiceClients() {
    this._invoiceClientService
      .getInvoiceClients()
      .subscribe((invoiceClients: any) => {
        this.invoiceClients = invoiceClients;
      });
  }

  fileUpload(event: any) {
    this._spinner.show();
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      workbook.SheetNames.forEach((sheet) => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        data.forEach((element: any) => {
          const findMovementType: any = this.movementTypes.find(
            (e: MovementTypeClient) =>
              e.name_movement.toLowerCase().trim() ===
                element.Tipo_de_movimiento.toLowerCase().trim() ||
              e.key_movement.toLowerCase().trim() ===
                element.Tipo_de_movimiento.toLowerCase().trim()
          );
          if (!findMovementType) {
            this._toastr.error('Tipo de movimiento incorrecto');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findClient: any = this.clients.find(
            (e: Client) =>
              e.name.toLowerCase().trim() ===
                element.Cliente.toLowerCase().trim() ||
              e.key_client.toLowerCase().trim() ===
                element.Cliente.toLowerCase().trim()
          );
          if (!findClient) {
            this._toastr.error('Cliente incorrecto');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findCeco: any = this.cecos.find(
            (e: Ceco) =>
              e.name_short.toLowerCase().trim() ===
                element.Ceco_corto.toLowerCase().trim() ||
              e.key_ceco.toLowerCase().trim() ===
                element.Ceco_corto.toLowerCase().trim() ||
              e.key_ceco_business.toLowerCase().trim() ===
                element.Ceco_corto.toLowerCase().trim()
          );
          if (!findCeco) {
            this._toastr.error('Ceco incorrecto');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findDivisa: any = this.divisas.find(
            (e: Divisa) =>
              e.abbreviation_divisa.toLowerCase().trim() ===
              element.Divisa.toLowerCase().trim()
          );
          if (!findDivisa) {
            this._toastr.error('Divisa incorrecto');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
        });

        if (this.validateExcel) {
          this.history.push({
            user: this.user._id,
            note: `Factura creada`,
            date: new Date().getTime(),
            type: 'note',
          });
          data.forEach((element: any) => {
            const findMovementType: any = this.movementTypes.find(
              (e: MovementTypeClient) =>
                e.name_movement.toLowerCase().trim() ===
                  element.Tipo_de_movimiento.toLowerCase().trim() ||
                e.key_movement.toLowerCase().trim() ===
                  element.Tipo_de_movimiento.toLowerCase().trim()
            );
            const findClient: any = this.clients.find(
              (e: Client) =>
                e.name.toLowerCase().trim() ===
                  element.Cliente.toLowerCase().trim() ||
                e.key_client.toLowerCase().trim() ===
                  element.Cliente.toLowerCase().trim()
            );
            const findCeco: any = this.cecos.find(
              (e: Ceco) =>
                e.name_short.toLowerCase().trim() ===
                  element.Ceco_corto.toLowerCase().trim() ||
                e.key_ceco.toLowerCase().trim() ===
                  element.Ceco_corto.toLowerCase().trim() ||
                e.key_ceco_business.toLowerCase().trim() ===
                  element.Ceco_corto.toLowerCase().trim()
            );
            const findDivisa: any = this.divisas.find(
              (e: Divisa) =>
                e.abbreviation_divisa.toLowerCase().trim() ===
                element.Divisa.toLowerCase().trim()
            );
            const datos = {
              activities: this.history,
              tenant: this.tenant,
              movement_type: findMovementType._id,
              ceco: findCeco._id,
              client: findClient._id,
              key_invoice: element.No_factura,
              upload_date: new Date(element.Fecha_carga).getTime(),
              invoice_date: new Date(element.Fecha_factura).getTime(),
              expiration_date: new Date(element.Fecha_vencimiento).getTime(),
              invoice_total: element.Total_factura,
              divisa: findDivisa._id,
              description: element.Descripcion,
            };
            console.log('data', datos);
            this._invoiceClientService
              .createInvoiceClient(datos)
              .subscribe((resp: any) => {});
          });
        }
        this._dialogRef.close();
      });
    };
  }
}