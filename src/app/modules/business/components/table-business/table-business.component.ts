import { Component, OnInit } from '@angular/core';
import { Business } from '../../../../models/Business.model';
import { BusinessService } from '../../../../services/business.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { ModalBusinessComponent } from '../modal-business/modal-business.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-business',
  templateUrl: './table-business.component.html',
  styleUrls: ['./table-business.component.scss']
})
export class TableBusinessComponent implements OnInit {

  public business: Business[] = []
  public businessTemp: Business[] = []

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _businessService: BusinessService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getBusiness()
  }

  openDialogModalBusiness(){
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

  getBusiness(){
    this._spinner.show()
    this._businessService.getBusiness().subscribe((resp:any) => {
      this.business = resp
      this.businessTemp = resp
      this._spinner.hide()
    })
  }

  search(term:string){
    if(term.length === 0){
      return this.business = this.businessTemp
    }
    this._searchService.search('business',term).subscribe( (resp: any) => {
      this.business = resp
    })
    return
  }

  delete(business: Business){
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${business.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if(result.value){
        this._spinner.show()
        this._businessService.deleteBusiness(business).subscribe(() => {
          this.getBusiness()
          this._spinner.hide()
          this._toastr.success(`Empresa ${business.name} eliminado con exito`)
        })

      }
    })
  }


}
