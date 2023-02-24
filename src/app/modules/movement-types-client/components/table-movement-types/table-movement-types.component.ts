import { Component, OnInit } from '@angular/core';
import { MovementTypeClient } from '../../../../models/MovementTypeClient.model';
import { FormControl } from '@angular/forms';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';
import { ToastrService } from 'ngx-toastr';
import { MovementsTypeClientService } from '../../../../services/movements-type-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SearchService } from '../../../../services/search.service';
import Swal from 'sweetalert2';
import { InvoiceClient } from '../../../../models/InvoiceClients.model';
import { InvoiceClientsService } from '../../../../services/invoice-clients.service';


@Component({
  selector: 'app-table-movement-types',
  templateUrl: './table-movement-types.component.html',
  styleUrls: ['./table-movement-types.component.scss']
})
export class TableMovementTypesComponent implements OnInit {

  public movements: MovementTypeClient[] = []
  public movementsTemp: MovementTypeClient[] = []
  public filterMovementsType: MovementTypeClient[] = []
  public invoiceClients: InvoiceClient[] = []

  public selectedValue: number = 100;
  public page!: number;

  public keyMovementControl: FormControl = new FormControl()
  public nameMovementControl: FormControl = new FormControl()
  public typeControl: FormControl = new FormControl()
  public invoiceControl: FormControl = new FormControl()
  public statusControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  public headersMovementTypes: any[] = []
  public header_name: string = 'movementTypesClient'

  constructor(
    private _loginService: LoginService,
    private _headerService: HeadersService,
    private _toastr: ToastrService,
    private _movementClientService: MovementsTypeClientService,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _searchService: SearchService,
    private _invoiceClientService: InvoiceClientsService
  ) { this._spinner.show() }

  ngOnInit(): void {
    this.getMovementTypes()
    this.getInvoiceClients()
    this.getHeadersMovementType()
  }

  getHeadersMovementType() {
    this._headerService.getHeaders(this.header_name).subscribe((resp: any) => {
      this.headersMovementTypes = resp
      this.initValuesHeader()
    })
  }

  initValuesHeader() {
    const headerProvider = this.headersMovementTypes.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerProvider) {
      this.keyMovementControl.setValue(headerProvider.key_movement)
      this.nameMovementControl.setValue(headerProvider.name_movement)
      this.typeControl.setValue(headerProvider.type)
      this.invoiceControl.setValue(headerProvider.invoice)
      this.statusControl.setValue(headerProvider.status)
      this.actionsControl.setValue(headerProvider.actions)
      this._spinner.hide()
    } else {
      this.keyMovementControl.setValue(true)
      this.nameMovementControl.setValue(true)
      this.typeControl.setValue(true)
      this.invoiceControl.setValue(true)
      this.statusControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        key_movement: true,
        name_movement: true,
        type: true,
        invoice: true,
        status: true,
        actions: true,
      }
      this._headerService.createHeaders(element, this.header_name).subscribe((item: any) => {
        this.getHeadersMovementType()
        this._spinner.hide()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerProvider = this.headersMovementTypes.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      key_movement: this.keyMovementControl.value,
      name_movement: this.nameMovementControl.value,
      type: this.typeControl.value,
      invoice: this.invoiceControl.value,
      status: this.statusControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerProvider._id, this.header_name).subscribe(() => {

    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  goToEditMovementTypes(movement: MovementTypeClient) {
    this._router.navigate(['/movement-types-client/edit-movement-type'],
      {
        queryParams: {
          movement: movement._id,
        }
      });
  }

  getInvoiceClients(){
    this._invoiceClientService.getInvoiceClients().subscribe((resp: InvoiceClient[]) => {
      this.invoiceClients = resp
    })
  }

  getMovementTypes() {
    this._movementClientService.getMovementsTypeClient().subscribe((movements: MovementTypeClient[]) => {
      this.movements = movements
      this.movementsTemp = movements
    })
  }

  updateStatus(data: any){
    const element = {
      ...data,
      status: !data.status
    }
    this._movementClientService.updateMovementTypeClient(element, data._id).subscribe((resp:any) => {})
  }

  search(term: string) {
    if (term.length === 0) {
      return this.movements = this.movementsTemp
    }
    this._searchService.search('movementTypesClient', term).subscribe((resp: any) => {
      this.movements = resp
    })
    console.log(this.movements);
    return
  }

  async delete(movement: MovementTypeClient) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar el tipo de movimiento ${movement.name_movement}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        const findInvoiceClient = this.invoiceClients.find((element:any) => element.movement_type._id === movement._id)
        if(findInvoiceClient){
          this._spinner.hide()
          this._toastr.error('No se puede eliminar movimiento porque tiene al menos una factura relacionada')
          return
        }
        this._movementClientService.deleteMovementTypeClient(movement).subscribe(() => {
          this.getMovementTypes()
          this._spinner.hide()
          this._toastr.success(`Tipo de movimiento ${movement.name_movement} eliminado con exito`)
        })

      }
    })
  }

}
