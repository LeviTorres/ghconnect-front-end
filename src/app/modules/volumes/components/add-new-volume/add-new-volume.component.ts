import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { VolumesService } from '../../../../services/volumes.service';
import { Divisa } from '../../../../models/Divisa.model';
import { Volume } from '../../../../models/Volume.model';

@Component({
  selector: 'app-add-new-volume',
  templateUrl: './add-new-volume.component.html',
  styleUrls: ['./add-new-volume.component.scss']
})
export class AddNewVolumeComponent implements OnInit {

  public insumoValue: string = ''
  public frontValue: string = ''
  public departureValue: string = ''
  public cardValue: string = ''
  public descriptionValue: string = ''
  public measureValue: string = ''
  public unitsPurchasedValue: number = 0
  public priceProformValue: number = 0

  public registerForm = this._fb.group({
    project_volume: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _toastr:ToastrService,
    private _dialogRef: MatDialogRef<AddNewVolumeComponent>,
    private _spinner: NgxSpinnerService,
    private _volumeService: VolumesService,
    @Inject(MAT_DIALOG_DATA) public volumeData: Volume
  ) { }

  ngOnInit(): void {
    this.insumoValue = this.volumeData.insumo
    this.frontValue = this.volumeData.front
    this.departureValue = this.volumeData.departure
    this.cardValue = this.volumeData.card
    this.descriptionValue = this.volumeData.description
    this.measureValue = this.volumeData.measure
    this.unitsPurchasedValue = this.volumeData.units_purchased
    this.priceProformValue = this.volumeData.price_proforma
  }

  registerCountry() {
      this._spinner.show()
      if(this.registerForm.invalid ){
        this._spinner.hide()
        return
      }

      const element = {
        ...this.registerForm.value,
        insumo: this.volumeData.insumo,
        front: this.volumeData.front,
        departure: this.volumeData.departure,
        card: this.volumeData.card,
        description: this.volumeData.description,
        measure: this.volumeData.measure,
        units_purchased: this.volumeData.units_purchased,
        price_proforma: this.volumeData.price_proforma
      }
      console.log(element);

      this._volumeService.createVolume(element)
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
