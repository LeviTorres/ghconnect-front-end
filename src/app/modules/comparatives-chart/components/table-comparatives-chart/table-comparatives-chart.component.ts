import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Country } from '../../../../models/Country.model';
import { EditCountriesComponent } from '../../../countries/components/edit-countries/edit-countries.component';
import { ModalCountriesComponent } from '../../../countries/components/modal-countries/modal-countries.component';
import { FormControl } from '@angular/forms';
import { CountriesService } from '../../../../services/countries.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';

@Component({
  selector: 'app-table-comparatives-chart',
  templateUrl: './table-comparatives-chart.component.html',
  styleUrls: ['./table-comparatives-chart.component.scss']
})
export class TableComparativesChartComponent implements OnInit {

  public countries: Country[] = []
  public countriesTemp: Country[] = []

  public headersCountry: any[] = []
  public header_name: string = 'countries';

  public selectedValue: number = 5;
  public page!: number;

  public nameControl: FormControl = new FormControl()
  public nationalityControl: FormControl = new FormControl()
  public divisaControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  constructor(
    private _countriesService: CountriesService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _loginService: LoginService,
    private _headerService: HeadersService
  ) { }

  ngOnInit(): void {
    this.getCountries()
    this.getHeadersCountry()
  }

  getHeadersCountry() {
    this._spinner.show()
    this._headerService.getHeaders('countries').subscribe((resp: any) => {
      this.headersCountry = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  initValuesHeader() {
    const headerCountry = this.headersCountry.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerCountry) {
      this.nameControl.setValue(headerCountry.name)
      this.nationalityControl.setValue(headerCountry.nationality)
      this.divisaControl.setValue(headerCountry.divisa)
      this.actionsControl.setValue(headerCountry.actions)
    } else {
      this.nameControl.setValue(true)
      this.nationalityControl.setValue(true)
      this.divisaControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        name: true,
        nationality: true,
        divisa: true,
        actions: true,
      }
      this._headerService.createHeaders(element, 'countries').subscribe((item: any) => {
        this.getHeadersCountry()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerCountry = this.headersCountry.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      name: this.nameControl.value,
      nationality: this.nationalityControl.value,
      divisa: this.divisaControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerCountry._id, 'countries').subscribe(() => {

    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  openDialogModalCountry() {
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

  getCountries() {
    this._spinner.show()
    this._countriesService.getCountries().subscribe((resp: any) => {
      this.countries = resp
      this.countriesTemp = resp
      this._spinner.hide()
    })
  }

  search(term: string) {
    if (term.length === 0) {
      return this.countries = this.countriesTemp
    }
    this._searchService.search('countries', term).subscribe((resp: any) => {
      this.countries = resp
    })
    return
  }

  openDialogEditCountry(country: Country){
    let dialogRef = this._dialog.open(EditCountriesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: country
    });
    dialogRef.beforeClosed().subscribe(() => {
        this.getCountries()
    })
  }

  delete(country: Country) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar a ${country.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
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
