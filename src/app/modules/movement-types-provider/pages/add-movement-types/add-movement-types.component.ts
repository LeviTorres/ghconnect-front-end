import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MovementsTypeProviderService } from '../../../../services/movements-type-provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-movement-types',
  templateUrl: './add-movement-types.component.html',
  styleUrls: ['./add-movement-types.component.scss']
})
export class AddMovementTypesComponent implements OnInit {

  public optionsType: any[] = [
    { name: 'CARGO'},
    { name: 'ABONO'}
  ]

  public form: FormGroup = new FormGroup({
    key_movement: new FormControl('', Validators.required),
    name_movement: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    status: new FormControl(false, Validators.required),
    invoice: new FormControl(false, Validators.required),
  })

  constructor(
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService,
    private _movementProviderService: MovementsTypeProviderService,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
  }

  addMovementType(){
    this._spinner.show()
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._spinner.hide()
      return
    }

    const element = {
      ...this.form.value
    }


    this._movementProviderService.createMovementTypeProvider(element).subscribe(() => {
      this._router.navigateByUrl('/movement-types-provider')
      this._toastr.success('Nuevo tipo de movimiento creado con exito')
      this._spinner.hide()
    },)

  }


}
