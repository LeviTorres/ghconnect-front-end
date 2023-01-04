import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountriesService } from '../../../../services/countries.service';
import { Country } from '../../../../models/Country.model';
import { BusinessService } from '../../../../services/business.service';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  public hide: boolean = true;

  public countries:Country[] = []

  public workspaceForm = this._fb.group({
    email: [ '', [ Validators.required, Validators.email ] ],
    name: [ '', Validators.required ],
    last_name: [ '', Validators.required ],
    business: [ '', Validators.required ],
    business_short: [ '', Validators.required ],
    key_business: [ '', Validators.required ],
    country: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _countryService: CountriesService,
    private _businessService: BusinessService,
    private _userService: UsersService,
    private _toastr:ToastrService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.getCountries()
  }

  createWorkspace(){

  }

  getCountries(){
    this._countryService.getCountries().subscribe((countries:Country[]) => {
      this.countries = countries
    })
  }

  loginn(){

  }

}
