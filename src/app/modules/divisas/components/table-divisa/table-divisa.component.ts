import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { UsersService } from '../../../../services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../../services/login.service';
import { ModalDivisaComponent } from '../modal-divisa/modal-divisa.component';
import Swal from 'sweetalert2';
import { Divisa } from '../../../../models/Divisa.model';
import { DivisasService } from '../../../../services/divisas.service';
import { FormControl } from '@angular/forms';
import { HeadersService } from '../../../../services/headers.service';
import { EditDivisasComponent } from '../edit-divisas/edit-divisas.component';

@Component({
  selector: 'app-table-divisa',
  templateUrl: './table-divisa.component.html',
  styleUrls: ['./table-divisa.component.scss']
})
export class TableDivisaComponent implements OnInit {

  public divisas: Divisa[] = []
  public divisasTemp: Divisa[] = []

  public headersDivisa: any[] = []
  public header_name: string = 'divisas'

  public selectedValue: number = 5;
  public page!: number;

  public nameControl: FormControl = new FormControl()
  public abbreviationControl: FormControl = new FormControl()
  public symbolControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  constructor(
    private _divisaService: DivisasService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _loginService: LoginService,
    private _headerService: HeadersService
  ) { }

  ngOnInit(): void {
    this.getDivisas()
    this.getHeadersDivisa()
  }

  getHeadersDivisa() {
    this._spinner.show()
    this._headerService.getHeaders('divisas').subscribe((resp: any) => {
      this.headersDivisa = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  initValuesHeader() {
    const headerDivisa = this.headersDivisa.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerDivisa) {
      this.nameControl.setValue(headerDivisa.name)
      this.abbreviationControl.setValue(headerDivisa.abbreviation_divisa)
      this.symbolControl.setValue(headerDivisa.symbol)
      this.actionsControl.setValue(headerDivisa.actions)
    } else {
      this.nameControl.setValue(true)
      this.abbreviationControl.setValue(true)
      this.symbolControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        name: true,
        symbol: true,
        abbreviation_divisa: true,
        actions: true,
      }
      this._headerService.createHeaders(element, 'divisas').subscribe((item: any) => {
        this.getHeadersDivisa()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerDivisa = this.headersDivisa.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      name: this.nameControl.value,
      abbreviation_divisa: this.abbreviationControl.value,
      symbol: this.symbolControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerDivisa._id, 'divisas').subscribe(() => {

    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  openDialogModalDivisa() {
    let dialogRef = this._dialog.open(ModalDivisaComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getDivisas()
    })
  }

  getDivisas() {
    this._spinner.show()
    this._divisaService.getDivisas().subscribe((resp: any) => {
      this.divisas = resp
      this.divisasTemp = resp
      this._spinner.hide()
    })
  }

  search(term: string) {
    if (term.length === 0) {
      return this.divisas = this.divisasTemp
    }
    this._searchService.search('divisas', term).subscribe((resp: any) => {
      this.divisas = resp
    })
    return
  }

  delete(divisa: Divisa) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${divisa.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._divisaService.deleteDivisa(divisa).subscribe(() => {
          this.getDivisas()
          this._spinner.hide()
          this._toastr.success(`Divisa ${divisa.name} eliminado con exito`)
        })

      }
    })
  }

  openDialogEditDivisa(divisa: Divisa) {
    let dialogRef = this._dialog.open(EditDivisasComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: divisa
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getDivisas()
    })
  }
}
