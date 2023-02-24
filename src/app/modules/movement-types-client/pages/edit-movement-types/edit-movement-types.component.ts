import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovementsTypeClientService } from '../../../../services/movements-type-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MovementTypeClient } from '../../../../models/MovementTypeClient.model';

@Component({
  selector: 'app-edit-movement-types',
  templateUrl: './edit-movement-types.component.html',
  styleUrls: ['./edit-movement-types.component.scss']
})
export class EditMovementTypesComponent implements OnInit {

  public optionsType: any[] = [
    { name: 'CARGO'},
    { name: 'ABONO'}
  ]

  public movement!: any

  public form: FormGroup = new FormGroup({
    key_movement: new FormControl('', Validators.required),
    name_movement: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    invoice: new FormControl(false, Validators.required)
  })

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _movementClientService:MovementsTypeClientService,
    private _spinner: NgxSpinnerService,
    private _toastr:ToastrService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._spinner.show()
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this.getMovementTypes(params.movement)
    })
  }

  getMovementTypes(id: string){
    this._spinner.show()
    this._movementClientService.getMovementsTypeClient().subscribe((movements:MovementTypeClient[]) => {
      this.movement = movements.find((movement: MovementTypeClient) => movement._id === id)
      this.initValuesForm()
      this._spinner.hide()
    })
  }

  initValuesForm(){
   // this._spinner.show()
    this.form.patchValue({
      key_movement: this.movement.key_movement,
      name_movement: this.movement.name_movement,
      type: this.movement.type,
      invoice: this.movement.invoice
    })
  }

  editMovementType(){
    this._spinner.show()
    if(this.form.invalid){
      this.form.markAllAsTouched()
      this._spinner.hide()
      return
    }

    const element = {
      ...this.form.value,
      key_movement: Number(this.form.controls['key_movement'].value)
    }

    this._movementClientService.updateMovementTypeClient(element, this.movement._id).subscribe(() => {
          this._router.navigateByUrl('/movement-types-client')
          this._spinner.hide()
          this._toastr.success('Tipo de movimiento actualizado con Exito')
    })
  }

}
