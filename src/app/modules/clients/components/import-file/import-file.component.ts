import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../models/Client.model';
import { CecosService } from '../../../../services/cecos.service';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from 'src/app/services/clients.service';
import * as XLSX from 'xlsx';
import { PaymentConditions } from '../../../../models/PaymentConditions.model';
import { ExcelService } from '../../../../services/excel.service';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent implements OnInit {

  public tenant: any
  public clients: Client[] = []
  public paymentConditions: any[] = []
  public validateExcel: boolean = true

  public history: any[] = [];
  public user: any;

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

  constructor(
    private _cecoService: CecosService,
    private _clientService: ClientsService,
    private _paymentConditionsService: PaymentConditionsService,
    private _spinner:NgxSpinnerService,
    private _toastr: ToastrService,
    private _dialogRef: MatDialogRef<ImportFileComponent>,
    private _excelService: ExcelService,
    private _loginService: LoginService
  ) {
    this.tenant = localStorage.getItem('tenant')
    this.user = _loginService.user;
  }

  ngOnInit(): void {
    this.getPaymentConditions()
    this.getClients()
  }

  getPaymentConditions(){
    this._paymentConditionsService.getPaymentConditions().subscribe((payments:any) => {
      this.paymentConditions = payments
    })
  }

  getClients(){
    this._clientService.getClients().subscribe((clients:any) => {
      this.clients = clients
    })
  }

  fileUpload(event:any){
    this._spinner.show()
    const selectedFile = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(selectedFile)
    fileReader.onload = (event) => {
      let binaryData = event.target?.result
      let workbook = XLSX.read(binaryData, { type: 'binary' })
      workbook.SheetNames.forEach(sheet => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
        data.forEach((element:any) => {
          const findPayment:any = this.paymentConditions.find((e:PaymentConditions) => e.name_payment.toLowerCase().trim() === element.Condiciones_de_pago.toLowerCase().trim())
          if(!findPayment){
            this._toastr.error('Condiciones de pago incorrecto')
            this._spinner.hide()
            this.validateExcel = false
            return
          }
          const findThirdType:any = this.third_types_array.find((e:any) => e.name.toLowerCase().trim() === element.Tipo_de_tercero.toLowerCase().trim())
          if(!findThirdType){
            this._toastr.error('Tipo de tercero incorrecto')
            this._spinner.hide()
            this.validateExcel = false
            return
          }
          const findSocietyType:any = this.society_types_array.find((e:any) => e.name.toLowerCase().trim() === element.Tipo_de_sociedad.toLowerCase().trim())
          if(!findSocietyType){
            this._toastr.error('Tipo de sociedad incorrecto')
            this._spinner.hide()
            this.validateExcel = false
            return
          }
          const findProviderType:any = this.provider_array.find((e:any) => e.name.toLowerCase().trim() === element.Tipo_de_proveedor.toLowerCase().trim())
          if(!findProviderType){
            this._toastr.error('Tipo de proveedor incorrecto')
            this._spinner.hide()
            this.validateExcel = false
            return
          }
        })

        if(this.validateExcel){
           data.forEach((element:any) => {
            const findPayment:any = this.paymentConditions.find((e:PaymentConditions) => e.name_payment.toLowerCase().trim() === element.Condiciones_de_pago.toLowerCase().trim())
            this.history.push({
              user: this.user._id,
              note: `Cliente creado`,
              date: new Date().getTime(),
              type: 'note',
            });
            const datos = {
              activities: this.history,
              tenant: this.tenant,
              key_client: element.No_cliente,
              name: element.Nombre_cliente,
              nit: element.NIT,
              third_type: element.Tipo_de_tercero,
              society_type: element.Tipo_de_sociedad,
              provider_type: element.Tipo_de_proveedor,
              phone_number: element.Telefono_local,
              mobile_number: element.Telefono_movil,
              email: element.Email,
              payment_conditions: findPayment?._id,
            }
            console.log('data', datos)
            this._clientService.createClient(datos).subscribe((resp:any) => {})
        });
        }
        this._dialogRef.close()
      })
    }

  }

  createExcel(){
    const element = {
      headers: [
        'No_cliente',
        'Nombre_cliente',
        'NIT',
        'Condiciones_de_pago',
        'Tipo_de_tercero',
        'Tipo_de_sociedad',
        'Tipo_de_proveedor',
        'Telefono_local',
        'Telefono_movil',
        'Email'
      ]
    }
    this._excelService.downloadExcel(element, 'Clientes', 'TemplateClients')
  }
}
