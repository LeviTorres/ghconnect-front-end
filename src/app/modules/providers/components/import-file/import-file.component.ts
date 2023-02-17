import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { CecosService } from '../../../../services/cecos.service';
import { ProvidersService } from '../../../../services/providers.service';
import { PaymentConditionsService } from '../../../../services/payment-conditions.service';
import { PaymentConditions } from '../../../../models/PaymentConditions.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent implements OnInit {

  public tenant: any
  public paymentConditions: any[] = []
  public validateExcel: boolean = true
  constructor(
    private _cecoService: CecosService,
    private _providerService: ProvidersService,
    private _paymentConditionsService: PaymentConditionsService,
    private _spinner:NgxSpinnerService,
    private _toastr: ToastrService,
    private _dialogRef: MatDialogRef<ImportFileComponent>,
  ) {
    this.tenant = localStorage.getItem('tenant')
  }

  ngOnInit(): void {
    this.getPaymentConditions()
  }

  getPaymentConditions(){
    this._paymentConditionsService.getPaymentConditions().subscribe((payments:any) => {
      this.paymentConditions = payments
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
            this._toastr.error('Condiciones de pago incorrecto ')
            this._spinner.hide()
            this.validateExcel = false
            return
          }
        })

        if(this.validateExcel){
           data.forEach((element:any) => {
            const findPayment:any = this.paymentConditions.find((e:PaymentConditions) => e.name_payment.toLowerCase().trim() === element.Condiciones_de_pago.toLowerCase().trim())
            const datos = {
              tenant: this.tenant,
              key_provider: element.No_cliente,
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
            this._providerService.createProvider(datos).subscribe((resp:any) => {})
        });
        }


        this._dialogRef.close()
      })
    }

  }

}
