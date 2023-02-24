import { Component, OnInit } from '@angular/core';
import { MovementTypeProvider } from '../../../../models/MovementTypeProvider.model';
import { FormControl } from '@angular/forms';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';
import { ToastrService } from 'ngx-toastr';
import { MovementsTypeProviderService } from '../../../../services/movements-type-provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SearchService } from '../../../../services/search.service';
import Swal from 'sweetalert2';
import { InvoiceProviders } from '../../../../models/InvoiceProviders.model';
import { InvoiceProvidersService } from '../../../../services/invoice-providers.service';

@Component({
  selector: 'app-table-movement-types',
  templateUrl: './table-movement-types.component.html',
  styleUrls: ['./table-movement-types.component.scss']
})
export class TableMovementTypesComponent implements OnInit {
  public movements: MovementTypeProvider[] = []
  public movementsTemp: MovementTypeProvider[] = []
  public filterMovementsType: MovementTypeProvider[] = []
  public invoiceProviders: InvoiceProviders[] = []

  public selectedValue: number = 100;
  public page!: number;

  public keyMovementControl: FormControl = new FormControl()
  public nameMovementControl: FormControl = new FormControl()
  public typeControl: FormControl = new FormControl()
  public invoiceControl: FormControl = new FormControl()
  public statusControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  public headersMovementTypes: any[] = []
  public header_name: string = 'movementTypesProvider'


  constructor(
    private _loginService: LoginService,
    private _headerService: HeadersService,
    private _toastr: ToastrService,
    private _movementProviderService: MovementsTypeProviderService,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _searchService: SearchService,
    private _invoiceProviderService: InvoiceProvidersService
  ) { this._spinner.show() }

  ngOnInit(): void {
    this.getMovementTypes()
    this.getInvoiceProviders()
    this.getHeadersMovementType()
  }

  updateStatus(data: any){
    const element = {
      ...data,
      status: !data.status
    }
    this._movementProviderService.updateMovementTypeProvider(element, data._id).subscribe((resp:any) => {})
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

  goToEditMovementTypes(movement: MovementTypeProvider) {
    this._router.navigate(['/movement-types-provider/edit-movement-type'],
      {
        queryParams: {
          movement: movement._id,
        }
      });
  }

  getInvoiceProviders(){
    this._invoiceProviderService.getInvoiceProviders().subscribe((resp: InvoiceProviders[]) => {
      this.invoiceProviders = resp
    })
  }

  getMovementTypes() {
    this._movementProviderService.getMovementsTypeProvider().subscribe((movements: MovementTypeProvider[]) => {
      this.movements = movements
      this.movementsTemp = movements
      console.log(this.movements);
    })
  }

  search(term: string) {
    if (term.length === 0) {
      return this.movements = this.movementsTemp
    }
    this._searchService.search('movementTypesProvider', term).subscribe((resp: any) => {
      this.movements = resp
    })
    console.log(this.movements);
    return
  }

  async delete(movement: MovementTypeProvider) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar el tipo de movimiento ${movement.name_movement}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        const findInvoiceProvider = this.invoiceProviders.find((element:any) => element.movement_type._id === movement._id)
        if(findInvoiceProvider){
          this._spinner.hide()
          this._toastr.error('No se puede eliminar movimiento porque tiene al menos una factura relacionada')
          return
        }
        this._movementProviderService.deleteMovementTypeProvider(movement).subscribe(() => {
          this.getMovementTypes()
          this._spinner.hide()
          this._toastr.success(`Tipo de movimiento ${movement.name_movement} eliminado con exito`)
        })

      }
    })
  }

}
