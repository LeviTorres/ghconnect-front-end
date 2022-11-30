import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { BusinessService } from '../../../../services/business.service';
import { Business } from '../../../../models/Business.model';
import { User } from '../../../../models/User.model';
import { UsersService } from '../../../../services/users.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-travel-request',
  templateUrl: './add-travel-request.component.html',
  styleUrls: ['./add-travel-request.component.scss']
})
export class AddTravelRequestComponent implements OnInit {

  public business: Business[]=[]
  public authorizers: any[] = []

  public users: User[] = []

  public showOption: boolean = false;
  public filteredOptions: any[] = [];

  public userControl: FormControl = new FormControl('')
  public requiredControl: FormControl = new FormControl(false)

  public travelForm: FormGroup = new FormGroup({
    travel_date: new FormControl('', Validators.required )
  })

  constructor(
    private _fb:FormBuilder,
    private _businessService:BusinessService,
    private _userService:UsersService
  ) { }

  ngOnInit(): void {
    const date = new Date()
    this.travelForm.controls['travel_date'].setValue(date)
    this.travelForm.controls['travel_date'].disable();
    this.getBusiness()
    this.getUsers()

    this.userControl.valueChanges.subscribe((user: any) => {
      this.filterData(user)
    })
    this.requiredControl.valueChanges.subscribe((required: any) => {
      console.log(required);

    })
  }

  public displayFn(provider: any): string {
    return provider && `${provider.name}` ? `${provider.name}` : '';
  }

  public filterData(value: string){
    this.filteredOptions = this.users.filter(item =>  {
      this.displayFn(item)
      return  item.name.toLowerCase().indexOf(value) > -1
    })
  }

  public opcionSeleccionada($event:MatAutocompleteSelectedEvent){
    this.showOption = true;
  }

  getBusiness(){
    this._businessService.getBusiness().subscribe((business:Business[]) => {
      this.business = business
    })
  }

  getUsers(){
    this._userService.getUsers().subscribe((users:any) => {
      this.users = users
    })
  }

  addAuthorizer(){
    console.log(this.authorizers.length);

    if(this.authorizers.length <=  0){
      this.authorizers.push({
        name: '',
        required: false
      })
    }else{
      this.authorizers.push({
        name: '',
        required: false
      })
    }

    console.log(this.authorizers);

  }

  registerTravel(){

  }

}
