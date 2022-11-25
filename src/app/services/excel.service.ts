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

  downloadExcel(dataExcel:any, name:string): void{
    this._workbook = new Workbook()
    this._workbook.creator='Digi'
    this._createTable(dataExcel, name)
    this._workbook.xlsx.writeBuffer().then((data) =>{
      const blob = new Blob([data])
      fs.saveAs(blob,`${name}.xlsx`)
    })
  }

  private _createTable(data:any, name: string){
    const sheet = this._workbook.addWorksheet(name)
    const headerRow = sheet.getRow(1)
    console.log('data',data.headers);
    for (let index = 0; index < data.headers.length; index++) {
      headerRow.values = [data.headers[index]]
    }

  }

  createExcel(formData: any) {
    return this._http.post(`${base_url}/excel`, formData, this.headers)
  }

}
