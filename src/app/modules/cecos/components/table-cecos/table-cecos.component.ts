import { Component, OnInit } from '@angular/core';
import { Ceco } from '../../../../models/Ceco.model';
import { CecosService } from '../../../../services/cecos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { ModalCecosComponent } from '../modal-cecos/modal-cecos.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-cecos',
  templateUrl: './table-cecos.component.html',
  styleUrls: ['./table-cecos.component.scss']
})
export class TableCecosComponent implements OnInit {

  public cecos: Ceco[] = []
  public cecosTemp: Ceco[] = []

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _cecosService: CecosService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getCecos()
  }

  openDialogModalCeco(){
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

  getCecos(){
    this._spinner.show()
    this._cecosService.getCecos().subscribe((resp:any) => {
      this.cecos = resp
      this.cecosTemp = resp
      this._spinner.hide()
    })
  }

  search(term:string){
    if(term.length === 0){
      return this.cecos = this.cecosTemp
    }
    this._searchService.search('cecos',term).subscribe( (resp: any) => {
      console.log('resp', resp);

      this.cecos = resp
    })
    return
  }

  delete(ceco: Ceco){
    console.log(ceco);

    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${ceco.name_short}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if(result.value){
        this._spinner.show()
        this._cecosService.deleteCecos(ceco).subscribe(() => {
          this.getCecos()
          this._spinner.hide()
          this._toastr.success(`Ceco ${ceco.name_short} eliminado con exito`)
        })

      }
    })
  }


}
