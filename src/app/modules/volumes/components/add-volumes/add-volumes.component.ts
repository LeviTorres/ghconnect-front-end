import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Country } from '../../../../models/Country.model';
import { Divisa } from '../../../../models/Divisa.model';
import { CountriesService } from '../../../../services/countries.service';
import { DivisasService } from '../../../../services/divisas.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { VolumesService } from '../../../../services/volumes.service';

@Component({
  selector: 'app-add-volumes',
  templateUrl: './add-volumes.component.html',
  styleUrls: ['./add-volumes.component.scss']
})
export class AddVolumesComponent implements OnInit {

  public divisas: Divisa[] = []

  public registerForm = this._fb.group({
    insumo: ['', Validators.required ],
    front: [ '', Validators.required ],
    departure: ['', Validators.required],
    card: [ '', Validators.required ],
    description: [ '', Validators.required ],
    measure: [ '', Validators.required ],
    project_volume: [ '', Validators.required ],
    units_purchased: [ '', Validators.required ],
    price_proforma: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<AddVolumesComponent>,
    private _spinner: NgxSpinnerService,
    private _volumeService: VolumesService
  ) { }

  ngOnInit(): void {
  }

  registerCountry() {
      this._spinner.show()
      if(this.registerForm.invalid ){
        this._spinner.hide()
        return
      }

      this._volumeService.createVolume(this.registerForm.value)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Volumen registrado con Exito')
        }, (err:any) =>{
          this._spinner.hide()
          console.warn(err.error.msg)
          this._toastr.error(`${err.error.msg}`)
        })
  }

}
