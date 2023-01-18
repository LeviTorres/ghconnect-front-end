import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountriesService } from '../../../../services/countries.service';
import { Country } from '../../../../models/Country.model';
import { BusinessService } from '../../../../services/business.service';
import { UsersService } from '../../../../services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Business } from '../../../../models/Business.model';
import { User } from '../../../../models/User.model';
import { CountriesOpenService } from '../../../../services/countries-open.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  public hide: boolean = true

  public samePassword: boolean = true

  public password: string = ''

  public repeatPassword: string = ''

  public countries:Country[] = []

  public business: Business[] = []

  public users: User[] = []

  public tenants: any[] = []

  public user_created: any
  public business_created:any

  public user_updated:any
  public business_updated:any

  public workspaceForm = this._fb.group({
    email: [ '', [ Validators.required, Validators.email ] ],
    name: [ '', Validators.required ],
    last_name: [ '', Validators.required ],
    business: [ '', Validators.required ],
    business_short: [ '', Validators.required ],
    key_business: [ '', Validators.required ],
    country: [ '', Validators.required ],
    password: [ '', Validators.required ],
    password2: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _countryService: CountriesService,
    private _businessService: BusinessService,
    private _userService: UsersService,
    private _countriesOpenService: CountriesOpenService,
    private _toastr:ToastrService,
    private _router: Router,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getCountriesOpen()
    this.getBusiness()
    this.getUsers()
    this.workspaceForm.controls['password2'].valueChanges.subscribe((inputPassword2) => {
      this.repeatPassword = inputPassword2!.trim();
      this.comparePassword();
    })
    this.workspaceForm.controls['email'].valueChanges.subscribe(() => {
      this.validateEmail()
    })
    this.workspaceForm.controls['password'].valueChanges.subscribe((inputPassword) => {
      this.password = inputPassword!.trim();
      this.comparePassword();
    })
  }

  createWorkspace(){
    this._spinner.show()

    if(this.workspaceForm.invalid || !this.samePassword ){
      this._spinner.hide()
      return
    }

    const findNameBusiness = this.business.find((business: Business) => business.name?.trim() === this.workspaceForm.controls['business'].value?.trim())
    if(findNameBusiness){
      this._spinner.hide()
      this._toastr.error('Nombre de empresa ya registrado');
      return
    }

    const findNameShortBusiness = this.business.find((business: Business) => business.name_short.trim() === this.workspaceForm.controls['business_short'].value?.trim())
    if(findNameShortBusiness){
      this._spinner.hide()
      this._toastr.error('Nombre corto de empresa ya registrado');
      return
    }

    const findKeyBusiness = this.business.find((business: Business) => business.key_business.trim() === this.workspaceForm.controls['key_business'].value?.trim())
    if(findKeyBusiness){
      this._spinner.hide()
      this._toastr.error('Clave de empresa ya registrada');
      return
    }

    const findEmail = this.users.find((users: User) => users.email?.trim() === this.workspaceForm.controls['email'].value?.trim())

    if(!findEmail){
      const elementUser = {
        name: this.workspaceForm.controls['name'].value,
        last_name: this.workspaceForm.controls['last_name'].value,
        email: this.workspaceForm.controls['email'].value,
        password: this.workspaceForm.controls['password'].value,
      }

      const elementBusiness = {
        name: this.workspaceForm.controls['business'].value,
        name_short: this.workspaceForm.controls['business_short'].value,
        key_business: this.workspaceForm.controls['key_business'].value,
        country: this.workspaceForm.controls['country'].value
      }

      this._userService.createUserWorspace(elementUser).subscribe((user:any) => {
        this.user_created = user
        this._businessService.createBusiness(elementBusiness).subscribe((business) => {
          console.log('business creado', business);
          this.business_created = business
          this.tenants.push({
            tenant_id: business._id
          })
          const updatedUser = {
            ...user,
            tenant: this.tenants
          }
          this._userService.updateUser(updatedUser,this.user_created._id).subscribe(() => {
            this._router.navigateByUrl('/home')
          },(error:any) => {
            this._userService.deleteUser(this.user_created).subscribe(()=> {})
            this._spinner.hide();
            console.warn(error.error.msg);
            this._toastr.error(`${error.error.msg}`);
          })
        },(error:any) =>{
          this._userService.deleteUser(this.user_created).subscribe(()=> {})
          this._spinner.hide();
          console.warn(error.error.msg);
          this._toastr.error(`${error.error.msg}`);
        })
      },(error:any) =>{
        this._spinner.hide();
        console.warn(error.error.msg);
        this._toastr.error(`${error.error.msg}`);
      })

    }else {

      const elementUser = {
        name: this.workspaceForm.controls['name'].value,
        last_name: this.workspaceForm.controls['last_name'].value,
        email: this.workspaceForm.controls['email'].value,
        role: findEmail.role,
      }

      const elementBusiness = {
        name: this.workspaceForm.controls['business'].value,
        name_short: this.workspaceForm.controls['business_short'].value,
        key_business: this.workspaceForm.controls['key_business'].value,
        country: this.workspaceForm.controls['country'].value
      }

      this._userService.updateUserWorkspace(elementUser, findEmail._id!).subscribe((user:any) => {
        this.user_updated = user
        console.log('elementUser',elementUser);
        this._businessService.createBusiness(elementBusiness).subscribe((business: any) => {
          this.business_updated = business
          this.user_updated.tenant.push({
            tenant_id: business._id
          })
          const updatedUser = {
            ...user,
            tenant: this.user_updated.tenant
          }
          console.log('updatedUser',updatedUser);

          this._userService.updateUser(updatedUser, findEmail._id!).subscribe(() => {
            this._router.navigateByUrl('/tenants')
            this._spinner.hide();
          })
        },(error:any) =>{
          this._userService.deleteUser(this.user_updated).subscribe(()=> {})
          this._spinner.hide();
          console.warn(error.error.msg);
          this._toastr.error(`${error.error.msg}`);
        })
      },(error:any) =>{
        this._spinner.hide();
        console.warn(error.error.msg);
        this._toastr.error(`${error.error.msg}`);
      })

    }
  }

  getCountriesOpen(){
    this._countriesOpenService.getCountriesOpen().subscribe((countries:Country[]) => {
      this.countries = countries
    })
  }

  getBusiness(){
    this._businessService.getBusiness().subscribe((business: Business[]) => {
      this.business = business
    })
  }

  getUsers(){
    this._userService.getUsers().subscribe((users: User[]) => {
      this.users = users
    })
  }


  comparePassword() {
    if(this.password === this.repeatPassword) {
      this.samePassword = true;
    }else {
      this.samePassword = false;
    }
  }

  validateEmail(){
    const valueEmail = this.workspaceForm.controls['email'].value
    const findEmail = this.users.find((user: User) => user.email === valueEmail)

    if(findEmail){
      this.workspaceForm.controls['name'].setValue(findEmail.name)
      this.workspaceForm.controls['last_name'].setValue(findEmail.last_name)
    }
  }

}
