import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Workbook } from 'exceljs'
import * as fs from 'file-saver'

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private _workbook!: Workbook

  constructor(
    private _http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get tenant(): any{
    return localStorage.getItem('tenant')
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token,
        'tenant': this.tenant
      }
    }
  }


  downloadExcel(dataExcel: any, name: string, type: string) {
    this._workbook = new Workbook()
    this._workbook.creator = 'Digi'
    this._createTable(dataExcel, name, type)
    this._workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data])
      fs.saveAs(blob, `${name}.xlsx`)
    })
  }

  private _createTable(info: any, name: string, type: string) {
    const sheet = this._workbook.addWorksheet(name)
    const header = info.headers

    sheet.addRow(header)

    switch (type) {
      case 'invoiceProviders':
        sheet.columns = [
          { width: 30 }, { width: 15 }, { width: 15 }, { width: 35 }, { width: 15 },
          { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 15 },
          { width: 10 }, { width: 10 }, { width: 15 }, { width: 45 }
        ]

        const subheader = []
        for (let index = 0; index < info.data.length; index++) {
          subheader[1] = info.data[index].ceco.business.name_short
          subheader[2] = info.data[index].ceco.key_ceco_business
          subheader[3] = info.data[index].provider.key_provider
          subheader[4] = info.data[index].provider.name
          subheader[5] = info.data[index].key_invoice
          subheader[6] = new Date(info.data[index].upload_date)
          subheader[7] = new Date(info.data[index].invoice_date)
          subheader[8] = new Date(info.data[index].expiration_date)
          subheader[9] = info.data[index].total
          sheet.getColumn(9).numFmt = '$#,##0.00'
          subheader[10] = info.data[index].total_payment
          sheet.getColumn(10).numFmt = '$#,##0.00'
          subheader[11] = info.data[index].divisa.abbreviation_divisa
          subheader[12] = info.data[index].type_change
          subheader[13] = info.data[index].total_mn
          sheet.getColumn(13).numFmt = '$#,##0.00'
          subheader[14] = info.data[index].description
          sheet.addRow(subheader)
        }
        break;

      case 'invoiceClients':
        sheet.columns = [
          { width: 30 }, { width: 15 }, { width: 15 }, { width: 35 }, { width: 15 },
          { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 15 },
          { width: 10 }, { width: 10 }, { width: 15 }, { width: 45 }
        ]

        const subheaderC = []
        for (let index = 0; index < info.data.length; index++) {
          subheaderC[1] = info.data[index].ceco.business.name_short
          subheaderC[2] = info.data[index].ceco.key_ceco_business
          subheaderC[3] = info.data[index].client.key_client
          subheaderC[4] = info.data[index].client.name
          subheaderC[5] = info.data[index].key_invoice
          subheaderC[6] = new Date(info.data[index].upload_date)
          subheaderC[7] = new Date(info.data[index].invoice_date)
          subheaderC[8] = new Date(info.data[index].expiration_date)
          subheaderC[9] = info.data[index].total
          sheet.getColumn(9).numFmt = '$#,##0.00'
          subheaderC[10] = info.data[index].total_payment
          sheet.getColumn(10).numFmt = '$#,##0.00'
          subheaderC[11] = info.data[index].divisa.abbreviation_divisa
          subheaderC[12] = info.data[index].type_change
          subheaderC[13] = info.data[index].total_mn
          sheet.getColumn(13).numFmt = '$#,##0.00'
          subheaderC[14] = info.data[index].description
          sheet.addRow(subheaderC)
        }
        break;

      case 'providers':
        sheet.columns = [
          { width: 10 }, { width: 15 }, { width: 25 }, { width: 10 }, { width: 25 },
          { width: 20 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 20 },
          { width: 10 }
        ]
        const subheaderProvider = []
        for (let index = 0; index < info.data.length; index++) {
          subheaderProvider[1] = info.data[index].status
          subheaderProvider[2] = info.data[index].key_provider
          subheaderProvider[3] = info.data[index].name
          subheaderProvider[4] = info.data[index].nit
          subheaderProvider[5] = info.data[index].payment_conditions
          subheaderProvider[6] = info.data[index].third_type
          subheaderProvider[7] = info.data[index].society_type
          subheaderProvider[8] = info.data[index].provider_type
          subheaderProvider[9] = info.data[index].phone_number
          subheaderProvider[10] = info.data[index].mobile_number
          subheaderProvider[11] = info.data[index].email
          sheet.addRow(subheaderProvider)
        }
        break;

      case 'clients':
        sheet.columns = [
          { width: 10 }, { width: 15 }, { width: 20 }, { width: 10 }, { width: 25 },
          { width: 20 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 20 },
          { width: 10 }
        ]
        const subheaderClient = []
        for (let index = 0; index < info.data.length; index++) {
          subheaderClient[1] = info.data[index].status
          subheaderClient[2] = info.data[index].key_client
          subheaderClient[3] = info.data[index].name
          subheaderClient[4] = info.data[index].nit
          subheaderClient[5] = info.data[index].payment_conditions
          subheaderClient[6] = info.data[index].third_type
          subheaderClient[7] = info.data[index].society_type
          subheaderClient[8] = info.data[index].provider_type
          subheaderClient[9] = info.data[index].phone_number
          subheaderClient[10] = info.data[index].mobile_number
          subheaderClient[11] = info.data[index].email
          sheet.addRow(subheaderClient)
        }
        break;
      case 'TemplateInvoiceProviders':
        sheet.columns = [
          { width: 20 }, { width: 15 }, { width: 20 }, { width: 20 }, { width: 20 },
          { width: 20 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 20 }
        ]
        sheet.getCell('A1').note = 'Nombre o Clave de movimiento. Tipo de dato alfanumerico'
        sheet.getCell('B1').note = 'Tipo de dato Numerico'
        sheet.getCell('C1').note = 'Nombre o Clave de Proveedor. Tipo de dato alfanumerico'
        sheet.getCell('D1').note = 'Tipo de dato Texto'
        sheet.getCell('E1').note = 'Tipo de dato Texto'
        sheet.getCell('F1').note = 'Nombre o Clave de Ceco. Tipo de dato alfanumerico'
        sheet.getCell('G1').note = 'Tipo de dato numerico'
        sheet.getCell('H1').note = 'Abreviatura de Divisa. Tipo de dato alfanumerico'
        sheet.getCell('I1').note = 'Tipo de dato Texto'
        sheet.getCell('A2').value = '15'
        sheet.getCell('B2').value = 1
        sheet.getCell('C2').value = 'Juan Diaz'
        sheet.getCell('D2').value = '01-12-2023'
        sheet.getCell('E2').value = '20-12-2023'
        sheet.getCell('F2').value = '9923'
        sheet.getCell('G2').value = 902999
        sheet.getCell('H2').value = 'BOB'
        sheet.getCell('I2').value = 'Descripcion de prueba'
      break
      case 'TemplateInvoiceClients':
        sheet.columns = [
          { width: 20 }, { width: 15 }, { width: 20 }, { width: 20 }, { width: 20 },
          { width: 20 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 20 }
        ]
        sheet.getCell('A1').note = 'Nombre o Clave de movimiento. Tipo de dato alfanumerico'
        sheet.getCell('B1').note = 'Tipo de dato Numerico'
        sheet.getCell('C1').note = 'Nombre o Clave de Cliente. Tipo de dato alfanumerico'
        sheet.getCell('D1').note = 'Tipo de dato Texto'
        sheet.getCell('E1').note = 'Tipo de dato Texto'
        sheet.getCell('F1').note = 'Nombre o Clave de Ceco. Tipo de dato alfanumerico'
        sheet.getCell('G1').note = 'Tipo de dato numerico'
        sheet.getCell('H1').note = 'Abreviatura de Divisa. Tipo de dato alfanumerico'
        sheet.getCell('I1').note = 'Tipo de dato Texto'
        sheet.getCell('A2').value = '15'
        sheet.getCell('B2').value = 1
        sheet.getCell('C2').value = 'Juan Diaz'
        sheet.getCell('D2').value = '01-12-2023'
        sheet.getCell('E2').value = '20-12-2023'
        sheet.getCell('F2').value = '9923'
        sheet.getCell('G2').value = 902999
        sheet.getCell('H2').value = 'BOB'
        sheet.getCell('I2').value = 'Descripcion de prueba'
      break
      case 'TemplateClients':
        sheet.columns = [
          { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 20 },
          { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 30 }
        ]

        sheet.getCell('A1').note = 'Tipo de dato numerico'
        sheet.getCell('B1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('C1').note = 'Tipo de dato numerico'
        sheet.getCell('D1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('E1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('F1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('G1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('H1').note = 'Tipo de dato numerico'
        sheet.getCell('I1').note = 'Tipo de dato numerico'
        sheet.getCell('J1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('A2').value = 1
        sheet.getCell('B2').value = 'Fernando Herrera'
        sheet.getCell('C2').value = 9921
        sheet.getCell('D2').value = '2 meses'
        sheet.getCell('E2').value = 'Proveedor'
        sheet.getCell('F2').value = 'Natural'
        sheet.getCell('G2').value = 'Nacional'
        sheet.getCell('H2').value = 6647182002
        sheet.getCell('I2').value = 6092393285
        sheet.getCell('J2').value = 'fernando.herrera@gmail.com'
      break

      case 'TemplateProviders':
        sheet.columns = [
          { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 20 },
          { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 30 }
        ]

        sheet.getCell('A1').note = 'Tipo de dato numerico'
        sheet.getCell('B1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('C1').note = 'Tipo de dato numerico'
        sheet.getCell('D1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('E1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('F1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('G1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('H1').note = 'Tipo de dato numerico'
        sheet.getCell('I1').note = 'Tipo de dato numerico'
        sheet.getCell('J1').note = 'Tipo de dato alfanumerico'
        sheet.getCell('A2').value = 1
        sheet.getCell('B2').value = 'Fernando Herrera'
        sheet.getCell('C2').value = 9921
        sheet.getCell('D2').value = '2 meses'
        sheet.getCell('E2').value = 'Proveedor'
        sheet.getCell('F2').value = 'Natural'
        sheet.getCell('G2').value = 'Nacional'
        sheet.getCell('H2').value = 6647182002
        sheet.getCell('I2').value = 6092393285
        sheet.getCell('J2').value = 'fernando.herrera@gmail.com'
      break

      default:
        break;
    }

  }

  createExcel(formData: any) {
    return this._http.post(`${base_url}/excel`, formData, this.headers)
  }

}
