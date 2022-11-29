import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-travel-request',
  templateUrl: './add-travel-request.component.html',
  styleUrls: ['./add-travel-request.component.scss']
})
export class AddTravelRequestComponent implements OnInit {

  public travelForm: FormGroup = new FormGroup({
    travel_date: new FormControl('', Validators.required )
  })

  constructor(
    private _fb:FormBuilder
  ) { }

  ngOnInit(): void {
    const date = new Date()
    console.log(date);
    this.travelForm.controls['travel_date'].setValue(date)
    this.travelForm.controls['travel_date'].disable();
  }

  registerTravel(){

  }

}
