import { Component, OnInit } from '@angular/core';
import { Business } from '../../../../models/Business.model';
import { BusinessService } from '../../../../services/business.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { ModalBusinessComponent } from '../modal-business/modal-business.component';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { HeadersService } from '../../../../services/headers.service';
import { LoginService } from '../../../../services/login.service';
import { EditBusinessComponent } from '../edit-business/edit-business.component';

@Component({
  selector: 'app-table-business',
  templateUrl: './table-business.component.html',
  styleUrls: ['./table-business.component.scss']
})
export class TableBusinessComponent implements OnInit {

  public business: Business[] = []
  public businessTemp: Business[] = []

  public headersBusiness: any[] = []
  public header_name: string = 'business';

  public nameControl: FormControl = new FormControl()
  public nameShortControl: FormControl = new FormControl()
  public keyBusinessControl: FormControl = new FormControl()
  public countryControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _businessService: BusinessService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _loginService: LoginService,
    private _headerService: HeadersService
  ) { }

  ngOnInit(): void {
    this.getBusiness()
    this.getHeadersBusiness()
  }

  getHeadersBusiness() {
    this._spinner.show()
    this._headerService.getHeaders('business').subscribe((resp: any) => {
      this.headersBusiness = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  initValuesHeader() {
    const headerBusiness = this.headersBusiness.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerBusiness) {
      this.nameControl.setValue(headerBusiness.name)
      this.nameShortControl.setValue(headerBusiness.name_short)
      this.keyBusinessControl.setValue(headerBusiness.key_business)
      this.countryControl.setValue(headerBusiness.country)
      this.actionsControl.setValue(headerBusiness.actions)
    } else {
      this.nameControl.setValue(true)
      this.nameShortControl.setValue(true)
      this.keyBusinessControl.setValue(true)
      this.countryControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        name: true,
        name_short: true,
        key_business: true,
        country: true,
        actions: true,
      }
      this._headerService.createHeaders(element, 'business').subscribe((item: any) => {
        this.getHeadersBusiness()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerBusiness = this.headersBusiness.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      name: this.nameControl.value,
      name_short: this.nameShortControl.value,
      key_business: this.keyBusinessControl.value,
      country: this.countryControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerBusiness._id, 'business').subscribe(() => {
    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  openDialogModalBusiness() {
    let dialogRef = this._dialog.open(ModalBusinessComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getBusiness()
    })
  }

  getBusiness() {
    this._spinner.show()
    this._businessService.getBusiness().subscribe((resp: any) => {
      this.business = resp
      this.businessTemp = resp
      this._spinner.hide()
    })
  }

  search(term: string) {
    if (term.length === 0) {
      return this.business = this.businessTemp
    }
    this._searchService.search('business', term).subscribe((resp: any) => {
      this.business = resp
    })
    return
  }

  delete(business: Business) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${business.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._businessService.deleteBusiness(business).subscribe(() => {
          this.getBusiness()
          this._spinner.hide()
          this._toastr.success(`Empresa ${business.name} eliminado con exito`)
        })

      }
    })
  }

  openDialogEditBusiness(busines: Business){
    let dialogRef = this._dialog.open(EditBusinessComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: busines
    });
    dialogRef.beforeClosed().subscribe(() => {
        this.getBusiness()
    })
  }

}
