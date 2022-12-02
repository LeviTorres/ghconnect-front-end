import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { BusinessService } from '../../../../services/business.service';
import { Business } from '../../../../models/Business.model';
import { User } from '../../../../models/User.model';
import { UsersService } from '../../../../services/users.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TravelRequestService } from '../../../../services/travel-request.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-travel-request',
  templateUrl: './add-travel-request.component.html',
  styleUrls: ['./add-travel-request.component.scss']
})
export class AddTravelRequestComponent implements OnInit {

  public business: Business[]=[]
  public authorizers: any[] = []

  public dynamicArray: Array<any> = []
  public newDynamic: any = {}
  public indice: number = 0

  public addUser: boolean = false

  public users: User[] = []

  public showOption: boolean = false;
  public filteredOptions: any[] = [];

  public travelForm: FormGroup = new FormGroup({
    travel_date: new FormControl('', Validators.required),
    key_employee: new FormControl('', Validators.required),
    name_applicant: new FormControl('', Validators.required),
    business: new FormControl('', Validators.required),
    cost_center: new FormControl('', Validators.required),
    departure_date: new FormControl('', Validators.required),
    return_date: new FormControl('', Validators.required),
    origin_city: new FormControl('', Validators.required),
    destination_city: new FormControl('', Validators.required),
    reason_trip: new FormControl('', Validators.required),
    lodging: new FormControl(false),
    vehicle: new FormControl(false),
    observations: new FormControl(),
  })

  public userForm: FormGroup = new FormGroup({
    user: new FormControl('', Validators.required),
    required: new FormControl(false),
    message: new FormControl('')
  })

  constructor(
    private _businessService:BusinessService,
    private _userService:UsersService,
    private _travelService:TravelRequestService,
    private _router: Router,
    private _toastr:ToastrService,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    const date = new Date()
    this.travelForm.controls['travel_date'].setValue(date)
    this.travelForm.controls['travel_date'].disable();
    this.getBusiness()
    this.getUsers()

  }

  displayFn(provider: any): string {
    return provider && `${provider.name}` ? `${provider.name} ${provider.last_name}` : '';
  }

  filterData(value: string){
    console.log(value);
   /* this.filteredOptions = this.users.filter(item =>  {
      this.displayFn(item)
      return  item.name.toLowerCase().indexOf(value) > -1 || item.last_name.toLowerCase().indexOf(value) > -1
    })*/
  }

  opcionSeleccionada($event:MatAutocompleteSelectedEvent){
    this.showOption = true;
  }

  getBusiness(){
    this._businessService.getBusiness().subscribe((business:Business[]) => {
      this.business = business
    })
  }

  getUsers(){
    this._userService.getUsers().subscribe((users:any) => {
      this.filteredOptions = users
    })
  }

  addRow(){
    this.addUser = true
  }
  registerUser(){
    this.authorizers.push({
      ...this.userForm.value
    })
    this.userForm.reset()
    this.addUser = false
  }

  registerTravel(){
    this._spinner.show()
    console.log(this.authorizers);

    const element = {
      ...this.travelForm.value,
      authorizers: this.authorizers,
      departure_date: new Date(this.travelForm.controls['departure_date'].value).getTime(),
      return_date: new Date(this.travelForm.controls['return_date'].value).getTime()
    }

    console.log(element);


    this._travelService.createTravelRequest(element)
    .subscribe(( res:any ) => {
      this._router.navigateByUrl('/approvals/approvals-travel')
      this._spinner.hide()
      this._toastr.success('Solicitud de viaje creada con Exito')
    }, (err:any) =>{
      this._spinner.hide()
      console.warn(err.error.msg)
      this._toastr.error(`${err.error.msg}`)
    })

  }

}
