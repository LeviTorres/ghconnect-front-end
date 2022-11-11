import { Component, OnInit } from '@angular/core';
import { Provider } from '../../../../models/Provider.model';
import { ProvidersService } from '../../../../services/providers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-providers',
  templateUrl: './table-providers.component.html',
  styleUrls: ['./table-providers.component.scss']
})
export class TableProvidersComponent implements OnInit {

  public providers: Provider[] = []
  public providersTemp: Provider[] = []

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _providersService: ProvidersService,
    private _spinner: NgxSpinnerService,
    private _searchService: SearchService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getProviders()
  }

  getProviders(){
    this._spinner.show()
    this._providersService.getProviders().subscribe((resp:any) => {
      this.providers = resp
      this.providersTemp = resp
      this._spinner.hide()
    })
  }
}
