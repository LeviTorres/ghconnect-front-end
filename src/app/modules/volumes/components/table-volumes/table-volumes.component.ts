import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddVolumesComponent } from '../add-volumes/add-volumes.component';
import { VolumesService } from '../../../../services/volumes.service';
import { LoginService } from '../../../../services/login.service';
import { HeadersService } from '../../../../services/headers.service';
import { Volume } from 'src/app/models/Volume.model';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddNewVolumeComponent } from '../add-new-volume/add-new-volume.component';
import { EditVolumeComponent } from '../edit-volume/edit-volume.component';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-table-volumes',
  templateUrl: './table-volumes.component.html',
  styleUrls: ['../.../../../../../../styles.scss']
})
export class TableVolumesComponent implements OnInit {

  public volumes: Volume[] = []
  public filterVolumes: Volume[] = []

  public selectedValue: number = 10;
  public page!: number;

  public headersVolume: any[] = []
  public header_name: string = 'volumes'

  public insumoControl: FormControl = new FormControl()
  public frontControl: FormControl = new FormControl()
  public departureControl: FormControl = new FormControl()
  public cardControl: FormControl = new FormControl()
  public descriptionControl: FormControl = new FormControl()
  public measureControl: FormControl = new FormControl()
  public projectVolumeControl: FormControl = new FormControl()
  public unitsPurchasedControl: FormControl = new FormControl()
  public pendingBuyControl: FormControl = new FormControl()
  public priceProformaControl: FormControl = new FormControl()
  public actionsControl: FormControl = new FormControl()

  constructor(
    private _dialog: MatDialog,
    private _volumeService: VolumesService,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _router: Router,
    private _loginService: LoginService,
    private _headerService: HeadersService
  ) { }

  ngOnInit(): void {
    this.getVolumes()
    this.getHeadersVolume()
  }

  getHeadersVolume() {
    this._spinner.show()
    this._headerService.getHeaders('volumes').subscribe((resp: any) => {
      this.headersVolume = resp
      this.initValuesHeader()
      this._spinner.hide()
    })
  }

  initValuesHeader() {
    const headerVolume = this.headersVolume.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    if (headerVolume) {
      this.insumoControl.setValue(headerVolume.insumo)
      this.frontControl.setValue(headerVolume.front)
      this.departureControl.setValue(headerVolume.departure)
      this.cardControl.setValue(headerVolume.card)
      this.descriptionControl.setValue(headerVolume.description)
      this.measureControl.setValue(headerVolume.measure)
      this.projectVolumeControl.setValue(headerVolume.project_volume)
      this.unitsPurchasedControl.setValue(headerVolume.units_purchased)
      this.pendingBuyControl.setValue(headerVolume.pending_to_buy)
      this.priceProformaControl.setValue(headerVolume.price_proforma)
      this.actionsControl.setValue(headerVolume.actions)
    } else {
      this.insumoControl.setValue(true)
      this.frontControl.setValue(true)
      this.departureControl.setValue(true)
      this.cardControl.setValue(true)
      this.descriptionControl.setValue(true)
      this.measureControl.setValue(true)
      this.projectVolumeControl.setValue(true)
      this.unitsPurchasedControl.setValue(true)
      this.pendingBuyControl.setValue(true)
      this.priceProformaControl.setValue(true)
      this.actionsControl.setValue(true)
      const element = {
        key_header: `${this._loginService.uid}-${this.header_name}`,
        insumo: true,
        front: true,
        departure: true,
        card: true,
        description: true,
        measure: true,
        project_volume: true,
        units_purchased: true,
        pending_to_buy: true,
        price_proforma: true,
        actions: true,
      }
      this._headerService.createHeaders(element, 'volumes').subscribe((item: any) => {
        this.getHeadersVolume()
      }, () => {
        this._toastr.error('Error al cargar los headers')
      })
    }
  }

  updateHeader() {
    const headerVolume = this.headersVolume.find((item: any) => item.key_header === `${this._loginService.uid}-${this.header_name}`)
    const element = {
      insumo: this.insumoControl.value,
      front: this.frontControl.value,
      departure: this.departureControl.value,
      card: this.cardControl.value,
      description: this.descriptionControl.value,
      measure: this.measureControl.value,
      project_volume: this.projectVolumeControl.value,
      units_purchased: this.unitsPurchasedControl.value,
      pending_to_buy: this.pendingBuyControl.value,
      price_proforma: this.priceProformaControl.value,
      actions: this.actionsControl.value
    }
    this._headerService.updateHeaders(element, headerVolume._id, 'volumes').subscribe(() => {

    }, () => {
      this._toastr.error('Error al actualizar los headers')
    })
  }

  getVolumes() {
    this._spinner.show()
    this._volumeService.getVolumes().subscribe((volumes: Volume[]) => {
      this.volumes = volumes

      const array = this.volumes.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
      let hash: any = {};
      this.filterVolumes = array.filter((o: Volume) => hash[o.insumo] ? false : hash[o.insumo] = true);
      this._spinner.hide()
    })
  }

  openDialogModalVolume() {
    let dialogRef = this._dialog.open(AddVolumesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getVolumes()
    })
  }

  openDialogAddNewVolumePlus(volume: Volume) {
    let dialogRef = this._dialog.open(AddNewVolumeComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: {
        ...volume,
        type: 'plus'
      }
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getVolumes()
    })
  }

  openDialogAddNewVolumeMinus(volume: Volume) {
    let dialogRef = this._dialog.open(AddNewVolumeComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: {
        ...volume,
        type: 'minus'
      }
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getVolumes()
    })
  }

  getProjectValue(volumeTable: Volume) {
    const initialPlusValue = 0
    const initialMinusValue = 0
    const arraPlus = this.volumes.filter((volume: Volume) => volume.insumo === volumeTable.insumo && volume.type === 'plus')
    const arrayMinus = this.volumes.filter((volume: Volume) => volume.insumo === volumeTable.insumo && volume.type === 'minus')
    const sumPlusArray = arraPlus.reduce((previousValue, currentValue) => previousValue + currentValue.project_volume, initialPlusValue)
    const minusPlusArray = arrayMinus.reduce((previousValue, currentValue) => previousValue + currentValue.project_volume, initialMinusValue)
    return sumPlusArray - minusPlusArray
  }

  getPendingBuy(volumeTable: Volume) {
    return this.getProjectValue(volumeTable) - volumeTable.units_purchased
  }

  openDialogEditVolume(volume: Volume) {
    let dialogRef = this._dialog.open(EditVolumeComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: volume
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.getVolumes()
    })
  }

  async delete(volume: Volume) {
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.value) {
        this._spinner.show()
        this._volumeService.deleteVolume(volume).subscribe(() => {
          this.getVolumes()
          this._spinner.hide()
          this._toastr.success(`Volumen eliminado con exito`)
        })

      }
    })
  }

  goToDetailsVolumes(volume: Volume) {
    this._router.navigate(['/volumes/details-volumes'],
      {
        queryParams: {
          insumo: volume.insumo,
        }
      });
  }

}
