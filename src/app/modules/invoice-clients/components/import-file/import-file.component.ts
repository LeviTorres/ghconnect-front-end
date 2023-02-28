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
import { ExcelService } from '../../../../services/excel.service';
import { BusinessService } from '../../../../services/business.service';
import { Business } from '../../../../models/Business.model';

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
  public business!: Business

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
    private _loginService: LoginService,
    private _excelService: ExcelService,
    private _businessService:BusinessService
  ) {
    this.tenant = localStorage.getItem('tenant');
    this.user = _loginService.user;
    this._businessService.getBusinessById(this.tenant).subscribe((resp:Business) => {
      this.business = resp
    })
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
      let workbook = XLSX.read(binaryData, { type: 'binary', cellDates: true });
      workbook.SheetNames.forEach((sheet) => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        data.forEach((element: any) => {
          const findKeyCeco = String(element.CECO).split('-')
          const findKeyBusinessCeco = findKeyCeco[0] === this.business.key_business
          if(!findKeyBusinessCeco){
            this._toastr.error('Clave ceco incorrecta');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findMovementType: any = this.movementTypes.find(
            (e: MovementTypeClient) =>
              e.key_movement.toLowerCase().trim() ===
              String(element.Movimiento).toLowerCase().trim()
          );
          if (!findMovementType) {
            this._toastr.error('Tipo de movimiento incorrecto');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findClient: any = this.clients.find(
            (e: Client) =>
              e.key_client.toLowerCase().trim() ===
              String(element.Cliente).toLowerCase().trim()
          );
          if (!findClient) {
            this._toastr.error('Cliente incorrecto');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findCeco: any = this.cecos.find(
            (e: Ceco) =>
              e.key_ceco.toLowerCase().trim() ===
              findKeyCeco[1].trim()
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
            const findKeyCeco = String(element.CECO).split('-')
            const findMovementType: any = this.movementTypes.find(
              (e: MovementTypeClient) =>
                e.key_movement.toLowerCase().trim() ===
                String(element.Movimiento).toLowerCase().trim()
            );
            const findClient: any = this.clients.find(
              (e: Client) =>
                e.key_client.toLowerCase().trim() ===
                String(element.Cliente).toLowerCase().trim()
            );
            const findCeco: any = this.cecos.find(
              (e: Ceco) =>
                e.key_ceco.toLowerCase().trim() ===
                findKeyCeco[1].trim()
            );
            const findDivisa: any = this.divisas.find(
              (e: Divisa) =>
                e.abbreviation_divisa.toLowerCase().trim() ===
                element.Divisa.toLowerCase().trim()
            );
            const date = String(element.Fecha_Factura).split('-')
            const dateCustom = `${date[1]}/${date[0]}/${date[2]}`
            const datos = {
              activities: this.history,
              tenant: this.tenant,
              movement_type: findMovementType._id,
              ceco: findCeco._id,
              client: findClient._id,
              key_invoice: element.No_Factura,
              upload_date: new Date().getTime(),
              invoice_date: new Date(dateCustom).getTime(),
              invoice_total: element.Monto_Factura,
              divisa: findDivisa._id,
              description: element.Descripcion,
            };
            this._invoiceClientService
              .createInvoiceClient(datos)
              .subscribe((resp: any) => {});
          });
        }
        this._dialogRef.close();
      });
    };
  }

  createExcel() {
    const element = {
      headers: [
        'Movimiento',
        'No_Factura',
        'Cliente',
        'Fecha_Factura',
        'CECO',
        'Monto_Factura',
        'Divisa',
        'Descripcion',
      ],
    };
    this._excelService.downloadExcel(
      element,
      'Facturas Clientes',
      'TemplateInvoiceClients'
    );
  }
}
