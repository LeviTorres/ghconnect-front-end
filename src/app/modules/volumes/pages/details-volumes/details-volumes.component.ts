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

  public selectedValue: number = 5;
  public page!: number;

  public volumes: Volume[] = []
  public filterVolumes: Volume[] = []

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
    })
  }

  getVolumes( insumo:string){
    this._spinner.show()
    this._volumeService.getVolumes().subscribe((volumes: Volume[]) => {
      this.volumes = volumes.filter((volume: Volume) => volume.insumo === insumo)
      this._spinner.hide()
    })
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
