import { Component, OnInit } from '@angular/core';
import { Ceco } from '../../../../models/Ceco.model';
import { CecosService } from '../../../../services/cecos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { ModalCecosComponent } from '../modal-cecos/modal-cecos.component';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { HeadersService } from '../../../../services/headers.service';
import { LoginService } from '../../../../services/login.service';
import { EditCecosComponent } from '../edit-cecos/edit-cecos.component';

@Component({
  selector: 'app-table-cecos',
  templateUrl: './table-cecos.component.html',
  styleUrls: ['../../../../../styles.scss']
})
export class TableCecosComponent implements OnInit {

  public cecos: Ceco[] = []
  public cecosTemp: Ceco[] = []

  public headersCecos: any[] = []
  public header_name: string = 'cecos';

  public nameLargeControl: FormControl = new FormControl()
  public nameShortControl: FormControl = new FormControl()
  public keyCecoControl: FormControl = new FormControl()
  public keyCecoBusinessControl: FormControl = new FormControl()
  public businessControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  public selectedValue: number = 100;
  public page!: number;

  constructor(
    private _cecosService: CecosService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _loginService: LoginService,
    private _headerService: HeadersService
  ) {
    this.getCecos()
    this.getHeadersCecos()
  }

  ngOnInit(): void { }

  getHeadersCecos() {
    this._spinner.show()
    this._headerService.getHeaders('cecos').subscribe((resp: any) => {
      this.headersCecos = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  initValuesHeader() {
    const headerCeco = this.headersCecos.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerCeco) {
      this.nameLargeControl.setValue(headerCeco.name_large)
      this.nameShortControl.setValue(headerCeco.name_short)
      this.keyCecoControl.setValue(headerCeco.key_ceco)
      this.keyCecoBusinessControl.setValue(headerCeco.key_ceco_business)
      this.businessControl.setValue(headerCeco.business)
      this.actionsControl.setValue(headerCeco.actions)
    } else {
      this.nameLargeControl.setValue(true)
      this.nameShortControl.setValue(true)
      this.keyCecoControl.setValue(true)
      this.keyCecoBusinessControl.setValue(true)
      this.businessControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        name_large: true,
        name_short: true,
        key_ceco: true,
        key_ceco_business: true,
        business: true,
        actions: true,
      }
      this._headerService.createHeaders(element, 'cecos').subscribe((item: any) => {
        this.getHeadersCecos()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerCecos = this.headersCecos.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      name_large: this.nameLargeControl.value,
      name_short: this.nameShortControl.value,
      key_ceco: this.keyCecoControl.value,
      key_ceco_business: this.keyCecoBusinessControl.value,
      business: this.businessControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerCecos._id, 'cecos').subscribe(() => {
    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }


  openDialogModalCeco() {
    let dialogRef = this._dialog.open(ModalCecosComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getCecos()
    })
  }

  getCecos() {
    this._spinner.show()
    this._cecosService.getCecos().subscribe((resp: any) => {
      this.cecos = resp
      this.cecosTemp = resp
      this._spinner.hide()
    })
  }

  search(term: string) {
    if (term.length === 0) {
      return this.cecos = this.cecosTemp
    }
    this._searchService.search('cecos', term).subscribe((resp: any) => {
      this.cecos = resp
    })
    return
  }

  delete(ceco: Ceco) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${ceco.name_short}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._cecosService.deleteCecos(ceco).subscribe(() => {
          this.getCecos()
          this._spinner.hide()
          this._toastr.success(`Ceco ${ceco.name_short} eliminado con exito`)
        })

      }
    })
  }

  openDialogEditCeco(ceco: Ceco) {
    let dialogRef = this._dialog.open(EditCecosComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: ceco
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getCecos()
    })
  }

}
