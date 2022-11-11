import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../models/Client.model';
import { ClientsService } from '../../../../services/clients.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from '../../../../services/search.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['./table-clients.component.scss']
})
export class TableClientsComponent implements OnInit {

  public clients: Client[] = []
  public clientsTemp: Client[] = []

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _clientsService: ClientsService,
    private _spinner: NgxSpinnerService,
    private _searchService: SearchService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getClients()
  }

  getClients(){
    this._spinner.show()
    this._clientsService.getClients().subscribe((resp:any) => {
      this.clients = resp
      this.clientsTemp = resp
      this._spinner.hide()
    })
  }

}
