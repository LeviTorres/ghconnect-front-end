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

  get headers() {
    return {
      headers: {
        'x-token': this.token
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

      default:
        break;
    }

  }

  createExcel(formData: any) {
    return this._http.post(`${base_url}/excel`, formData, this.headers)
  }

}
