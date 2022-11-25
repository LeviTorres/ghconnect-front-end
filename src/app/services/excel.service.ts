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

  private _workbook!:Workbook

  constructor(
    private _http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  downloadExcel(dataExcel:any, name:string, type: string): void{
    this._workbook = new Workbook()
    this._workbook.creator='Digi'
    this._createTable(dataExcel, name, type)
    this._workbook.xlsx.writeBuffer().then((data) =>{
      const blob = new Blob([data])
      fs.saveAs(blob,`${name}.xlsx`)
    })
  }

  private _createTable(info:any, name: string, type:string){
    const sheet = this._workbook.addWorksheet(name)
    const header = info.headers
    sheet.addRow(header)
    const subheader = []
    console.log(info.data);

    for(let index = 0; index < info.data.length; index++) {
      subheader[1] = info.data[index].ceco.business.name_short
      subheader[2] = info.data[index].ceco.key_ceco_business
      subheader[3] = info.data[index].provider.key_provider
      subheader[4] = info.data[index].provider.name
      subheader[5] = info.data[index].key_invoice
      subheader[6] = new Date(info.data[index].upload_date)
      sheet.addRow(subheader)
    }
  }

  createExcel(formData: any) {
    return this._http.post(`${base_url}/excel`, formData, this.headers)
  }

}
