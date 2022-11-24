import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../models/Client.model';
import { ClientsService } from '../../../../services/clients.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from '../../../../services/search.service';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['../../../../../styles.scss']
})
export class TableClientsComponent implements OnInit {

  public clients: Client[] = []
  public clientsTemp: Client[] = []

  public selectedValue: number = 100;
  public page!: number;

  public headersClient: any[] = []
  public header_name: string = 'clients'

  public statusControl: FormControl = new FormControl()
  public keyClientControl: FormControl = new FormControl()
  public nameControl: FormControl = new FormControl()
  public nitControl: FormControl = new FormControl()
  public paymentConditionsControl: FormControl = new FormControl()
  public societyTypeControl: FormControl = new FormControl()
  public thirdTypeControl: FormControl = new FormControl()
  public providerTypeControl: FormControl = new FormControl()
  public phoneNumberControl: FormControl = new FormControl()
  public mobileNumberControl: FormControl = new FormControl()
  public emailControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  constructor(
    private _clientsService: ClientsService,
    private _spinner: NgxSpinnerService,
    private _searchService: SearchService,
    private _toastr: ToastrService,
    private _loginService: LoginService,
    private _headerService: HeadersService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    this.getClients()
    this.getHeadersClient()
  }

  getHeadersClient() {
    this._spinner.show()
    this._headerService.getHeaders('clients').subscribe((resp: any) => {
      this.headersClient = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  initValuesHeader() {
    const headerClient = this.headersClient.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerClient) {
      this.statusControl.setValue(headerClient.status)
      this.keyClientControl.setValue(headerClient.key_client)
      this.nameControl.setValue(headerClient.name)
      this.nitControl.setValue(headerClient.nit)
      this.paymentConditionsControl.setValue(headerClient.payment_conditions)
      this.societyTypeControl.setValue(headerClient.society_type)
      this.thirdTypeControl.setValue(headerClient.third_type)
      this.providerTypeControl.setValue(headerClient.provider_type)
      this.phoneNumberControl.setValue(headerClient.phone_number)
      this.mobileNumberControl.setValue(headerClient.mobile_number)
      this.emailControl.setValue(headerClient.email)
      this.actionsControl.setValue(headerClient.actions)
    } else {
      this.statusControl.setValue(true)
      this.keyClientControl.setValue(true)
      this.nameControl.setValue(true)
      this.nitControl.setValue(true)
      this.paymentConditionsControl.setValue(true)
      this.societyTypeControl.setValue(true)
      this.thirdTypeControl.setValue(true)
      this.providerTypeControl.setValue(true)
      this.phoneNumberControl.setValue(true)
      this.mobileNumberControl.setValue(true)
      this.emailControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        status: true,
        key_client: true,
        name: true,
        nit: true,
        payment_conditions: true,
        society_type: true,
        third_type: true,
        provider_type: true,
        phone_number: true,
        mobile_number: true,
        email: true,
        actions: true,
      }
      this._headerService.createHeaders(element, 'clients').subscribe((item: any) => {
        this.getHeadersClient()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerClient = this.headersClient.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      status: this.statusControl.value,
      key_client: this.keyClientControl.value,
      name: this.nameControl.value,
      nit: this.nitControl.value,
      payment_conditions: this.paymentConditionsControl.value,
      society_type: this.societyTypeControl.value,
      third_type: this.thirdTypeControl.value,
      provider_type: this.providerTypeControl.value,
      phone_number: this.phoneNumberControl.value,
      mobile_number: this.mobileNumberControl.value,
      email: this.emailControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerClient._id, 'clients').subscribe(() => {

    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  getClients() {
    this._spinner.show()
    this._clientsService.getClients().subscribe((resp: any) => {
      this.clients = resp
      console.log(this.clients);

      this.clientsTemp = resp
      this._spinner.hide()
    })
  }

  goToEditClient(client: Client){
    this._router.navigate(['/clients/edit-client'],
    {
      queryParams: {
        client: client._id,
      }
    });
  }

  async delete(client: Client) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar el cliente ${client.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._clientsService.deleteClient(client).subscribe(() => {
          this.getClients()
          this._spinner.hide()
          this._toastr.success(`Cliente ${client.name} eliminado con exito`)
        })

      }
    })
  }

}
