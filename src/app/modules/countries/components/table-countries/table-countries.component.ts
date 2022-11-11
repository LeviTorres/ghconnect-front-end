import { Component, OnInit } from '@angular/core';
import { Country } from '../../../../models/Country.model';
import { CountriesService } from '../../../../services/countries.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { ModalCountriesComponent } from '../modal-countries/modal-countries.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-countries',
  templateUrl: './table-countries.component.html',
  styleUrls: ['./table-countries.component.scss']
})
export class TableCountriesComponent implements OnInit {

  public countries: Country[] = []
  public countriesTemp: Country[] = []

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _countriesService: CountriesService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getCountries()
  }

  openDialogModalCountry(){
    let dialogRef = this._dialog.open(ModalCountriesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
        this.getCountries()
    })
  }

  getCountries(){
    this._spinner.show()
    this._countriesService.getCountries().subscribe((resp:any) => {
      this.countries = resp
      this.countriesTemp = resp
      this._spinner.hide()
    })
  }

  search(term:string){
    if(term.length === 0){
      return this.countries = this.countriesTemp
    }
    this._searchService.search('countries',term).subscribe( (resp: any) => {
      this.countries = resp
    })
    return
  }

  delete(country: Country){
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${country.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if(result.value){
        this._spinner.show()
        this._countriesService.deleteCountry(country).subscribe(() => {
          this.getCountries()
          this._spinner.hide()
          this._toastr.success(`Pais ${country.name} eliminado con exito`)
        })

      }
    })
  }


}
