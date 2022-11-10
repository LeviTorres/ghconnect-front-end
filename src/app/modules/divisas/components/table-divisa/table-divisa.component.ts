import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modules/users/models/User.model';
import { UsersService } from '../../../../services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../../services/login.service';
import { ModalDivisaComponent } from '../modal-divisa/modal-divisa.component';
import Swal from 'sweetalert2';
import { Divisa } from '../../models/Divisa.model';
import { DivisasService } from '../../../../services/divisas.service';

@Component({
  selector: 'app-table-divisa',
  templateUrl: './table-divisa.component.html',
  styleUrls: ['./table-divisa.component.scss']
})
export class TableDivisaComponent implements OnInit {

  public divisas: Divisa[] = []
  public divisasTemp: Divisa[] = []

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _divisaService: DivisasService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getDivisas()
  }

  openDialogModalDivisa(){
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

  getDivisas(){
    this._spinner.show()
    this._divisaService.getDivisas().subscribe((resp:any) => {
      this.divisas = resp
      this.divisasTemp = resp
      this._spinner.hide()
    })
  }

  search(term:string){
    if(term.length === 0){
      return this.divisas = this.divisasTemp
    }
    this._searchService.search('divisas',term).subscribe( (resp: any) => {
      console.log('resp', resp);

      this.divisas = resp
    })
    return
  }

  delete(divisa:Divisa){
    console.log(divisa);

    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${divisa.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if(result.value){
        this._spinner.show()
        this._divisaService.deleteDivisa(divisa).subscribe(() => {
          this.getDivisas()
          this._spinner.hide()
          this._toastr.success(`Divisa ${divisa.name} eliminado con exito`)
        })

      }
    })
  }

}
