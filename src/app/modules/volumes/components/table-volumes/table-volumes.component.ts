import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddVolumesComponent } from '../add-volumes/add-volumes.component';
import { VolumesService } from '../../../../services/volumes.service';
import { Volume } from 'src/app/models/Volume.model';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddNewVolumeComponent } from '../add-new-volume/add-new-volume.component';

@Component({
  selector: 'app-table-volumes',
  templateUrl: './table-volumes.component.html',
  styleUrls: ['./table-volumes.component.scss']
})
export class TableVolumesComponent implements OnInit {

  public volumes: Volume[]=[]
  public filterVolumes: Volume[] = []

  public selectedValue: number = 5;
  public page!: number;

  constructor(
    private _dialog:MatDialog,
    private _volumeService: VolumesService,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    this.getVolumes()
  }

  getVolumes(){
    this._spinner.show()
    this._volumeService.getVolumes().subscribe((volumes: Volume[]) => {
      this.volumes = volumes
      const array = this.volumes.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
      let hash: any = {};
      this.filterVolumes = array.filter((o: Volume) => hash[o.insumo] ? false : hash[o.insumo] = true);
      this._spinner.hide()
    })
  }

  openDialogModalVolume(){
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

  openDialogAddNewVolume(volume: Volume){
    let dialogRef = this._dialog.open(AddNewVolumeComponent, {
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
          this.getVolumes()
          this._spinner.hide()
          this._toastr.success(`Volumen eliminado con exito`)
        })

      }
    })
  }

  goToDetailsVolumes(volume:Volume){
    this._router.navigate(['/volumes/details-volumes'],
    {
      queryParams: {
        insumo: volume.insumo,
      }
    });
  }

}
