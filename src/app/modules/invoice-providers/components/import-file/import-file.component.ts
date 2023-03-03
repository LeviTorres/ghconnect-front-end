import { Component, OnInit } from '@angular/core';
import { InvoiceProviders } from '../../../../models/InvoiceProviders.model';
import { Provider } from '../../../../models/Provider.model';
import { Ceco } from '../../../../models/Ceco.model';
import { Divisa } from '../../../../models/Divisa.model';
import { MovementTypeProvider } from '../../../../models/MovementTypeProvider.model';
import { CecosService } from '../../../../services/cecos.service';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { MovementsTypeProviderService } from '../../../../services/movements-type-provider.service';
import { DivisasService } from '../../../../services/divisas.service';
import { LoginService } from '../../../../services/login.service';
import { ProvidersService } from '../../../../services/providers.service';
import { InvoiceProvidersService } from '../../../../services/invoice-providers.service';
import * as XLSX from 'xlsx';
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
  public invoiceProviders: InvoiceProviders[] = [];
  public providers: Provider[] = [];
  public cecos: Ceco[] = [];
  public divisas: Divisa[] = [];
  public movementTypes: MovementTypeProvider[] = [];
  public validateExcel: boolean = true;

  public history: any[] = [];
  public user: any;
  public business!: Business;

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
    private _providerService: ProvidersService,
    private _invoiceProviderService: InvoiceProvidersService,
    private _paymentConditionsService: PaymentConditionsService,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _dialogRef: MatDialogRef<ImportFileComponent>,
    private _movementTypeService: MovementsTypeProviderService,
    private _divisaService: DivisasService,
    private _loginService: LoginService,
    private _excelService: ExcelService,
    private _businessService: BusinessService
  ) {
    this.tenant = localStorage.getItem('tenant');
    this.user = _loginService.user;
    this._businessService
      .getBusinessById(this.tenant)
      .subscribe((resp: Business) => {
        this.business = resp;
      });
  }

  ngOnInit(): void {
    this.getInvoiceProviders();
    this.getProviders();
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
      .getMovementsTypeProvider()
      .subscribe((movementTypes: MovementTypeProvider[]) => {
        this.movementTypes = movementTypes;
      });
  }

  getCecos() {
    this._cecoService.getCecos().subscribe((cecos: Ceco[]) => {
      this.cecos = cecos;
    });
  }

  getProviders() {
    this._providerService.getProviders().subscribe((providers: Provider[]) => {
      this.providers = providers;
    });
  }

  getInvoiceProviders() {
    this._invoiceProviderService
      .getInvoiceProviders()
      .subscribe((invoiceProviders: any) => {
        this.invoiceProviders = invoiceProviders;
      });
  }

  fileUpload(event: any) {
    this._spinner.show();
    console.log('cecos', this.cecos);
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, { type: 'binary', cellDates: true });
      workbook.SheetNames.forEach((sheet) => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        data.forEach((element: any) => {
          const findKeyCeco = String(element.CECO).split('-');
          const findKeyBusinessCeco =
            findKeyCeco[0] === this.business.key_business;
          if (!findKeyBusinessCeco) {
            this._toastr.error('Clave ceco incorrecta');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findMovementType: any = this.movementTypes.find(
            (e: MovementTypeProvider) =>
              e.key_movement.toLowerCase().trim() ===
              String(element.Movimiento).toLowerCase().trim()
          );
          if (!findMovementType) {
            this._toastr.error('Tipo de movimiento incorrecto');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findProvider: any = this.providers.find(
            (e: Provider) =>
              e.key_provider.toLowerCase().trim() ===
              String(element.Proveedor).toLowerCase().trim()
          );
          if (!findProvider) {
            this._toastr.error('Proveedor incorrecto');
            this._spinner.hide();
            this.validateExcel = false;
            return;
          }
          const findCeco: any = this.cecos.find(
            (e: Ceco) =>
              e.key_ceco.toLowerCase().trim() === findKeyCeco[1].trim().toLowerCase()
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
            const findKeyCeco = String(element.CECO).split('-');
            const findMovementType: any = this.movementTypes.find(
              (e: MovementTypeProvider) =>
                e.key_movement.toLowerCase().trim() ===
                String(element.Movimiento).toLowerCase().trim()
            );
            const findProvider: any = this.providers.find(
              (e: Provider) =>
                e.key_provider.toLowerCase().trim() ===
                String(element.Proveedor).toLowerCase().trim()
            );
            const findCeco: any = this.cecos.find(
              (e: Ceco) =>
                e.key_ceco.toLowerCase().trim() === findKeyCeco[1].trim().toLowerCase()
            );
            const findDivisa: any = this.divisas.find(
              (e: Divisa) =>
                e.abbreviation_divisa.toLowerCase().trim() ===
                element.Divisa.toLowerCase().trim()
            );
            console.log('Fecha_Factura',String(element.Fecha_Factura));

            const dateCustom = `${
              new Date(String(element.Fecha_Factura)).getMonth() + 1
            }/${new Date(String(element.Fecha_Factura)).getDate()}/${new Date(
              String(element.Fecha_Factura)
            ).getFullYear()}`;
            console.log('dateCustom',dateCustom);

            const datos = {
              activities: this.history,
              tenant: this.tenant,
              movement_type: findMovementType._id,
              ceco: findCeco._id,
              provider: findProvider._id,
              key_invoice: element.No_Factura,
              upload_date: new Date().getTime(),
              invoice_date: new Date(dateCustom).getTime(),
              invoice_total: element.Monto_Factura,
              divisa: findDivisa._id,
              description: element.Descripcion,
            };
            console.log('data', datos);
            this._invoiceProviderService.createInvoiceProvider(datos).subscribe(
              (resp: any) => {},
              (err: any) => {
                this._spinner.hide();
                console.warn(err.error.msg);
                this._toastr.error(`${err.error.msg}`);
              }
            );
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
        'Proveedor',
        'Fecha_Factura',
        'CECO',
        'Monto_Factura',
        'Divisa',
        'Descripcion',
      ],
    };
    this._excelService.downloadExcel(
      element,
      'Facturas Proveedores',
      'TemplateInvoiceProviders'
    );
  }
}
