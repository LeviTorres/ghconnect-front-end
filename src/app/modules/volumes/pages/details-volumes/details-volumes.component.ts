import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Volume } from '../../../../models/Volume.model';
import { MatDialog } from '@angular/material/dialog';
import { VolumesService } from '../../../../services/volumes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-volumes',
  templateUrl: './details-volumes.component.html',
  styleUrls: ['./details-volumes.component.scss']
})
export class DetailsVolumesComponent implements OnInit {

  public volumeData!: Volume;
  public selectedValue: number = 5;
  public page!: number;

  public volumes: Volume[] = []
  public filterVolumes: Volume[] = []

  public insumo: string = ''

  constructor(
    private _dialog:MatDialog,
    private _volumeService: VolumesService,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _router:Router,
    private _activatedRoute:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this.getVolumes(params.insumo)
      this.insumo = params.insumo
    })
  }

  getVolumes( insumo:string){
    this._spinner.show()
    this._volumeService.getVolumes().subscribe((volumes: Volume[]) => {
      this.volumes = volumes.filter((volume: Volume) => volume.insumo === insumo)
      this.volumeData = this.volumes[0]
      this._spinner.hide()
    })
  }

  getProjectVolume(indexTable:number){
    let total: number = 0
    let suma: number = 0
    let resta: number = 0
    this.volumes.forEach(function(element, index, array) {
      if(index <= indexTable){
        if(element.type === 'plus'){
          suma += element.project_volume
          resta += element.units_purchased
          total = suma - resta
        }else {
          suma -= element.project_volume
          resta += element.units_purchased
          total = suma - resta
        }
      }
    })
    return total
  }

  getPendingBuy(indexTable : number){
    let total: number = 0
    let suma: number = 0
    let resta: number = 0
    this.volumes.forEach(function(element, index, array) {
      if(index <= indexTable){
        if(element.type === 'plus'){
          suma += element.project_volume
          resta += element.units_purchased
          total = suma - resta
        }else if(element.type === 'minus'){
          suma -= element.project_volume
          resta += element.units_purchased
          total = suma - resta
        }else if(element.type === 'initial'){
          suma += element.project_volume
          resta += element.units_purchased
          total = suma - resta
        }
      }
    })
    return total
  }

  delete(volume:Volume){
    return Swal.fire({
      title: 'Estas seguro que deseas continuar?',
      text: `Esta a punto de eliminar`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if(result.value){
        this._spinner.show()
        this._volumeService.deleteVolume(volume).subscribe(() => {
          this.getVolumes(volume.insumo)
          this._spinner.hide()
          this._toastr.success(`Volumen eliminado con exito`)
        })

      }
    })
  }

}
