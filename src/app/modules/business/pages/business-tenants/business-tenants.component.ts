import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountriesOpenService } from '../../../../services/countries-open.service';
import { Countryopen } from '../../../../models/Countryopen.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from '../../../../services/business.service';
import { UsersService } from '../../../../services/users.service';
import { Business } from '../../../../models/Business.model';
import { UploadFileService } from '../../../../services/upload-file.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../../services/login.service';
import { User } from '../../../../models/User.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddActivitiesComponent } from '../../components/add-activities/add-activities.component';

@Component({
  selector: 'app-business-tenants',
  templateUrl: './business-tenants.component.html',
  styleUrls: ['./business-tenants.component.scss']
})
export class BusinessTenantsComponent implements OnInit {

  public divisas: Countryopen[] = []
  public date: any
  public imageSelect: any
  public user!: any
  public imgView: any
  public flag: boolean = false
  public letterNames: string = ''
  public history: any [] = []

  public formActivity:FormControl = new FormControl('')

  public form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    name_short: new FormControl('', Validators.required),
    creation_date: new FormControl(''),
    key_business: new FormControl('', Validators.required),
    address_1: new FormControl('', Validators.required),
    street_1: new FormControl('', Validators.required),
    address_2: new FormControl(''),
    street_2: new FormControl(''),
    country: new FormControl('', Validators.required),
    polity: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    zip_code: new FormControl('', Validators.required),
    tax_identification_number: new FormControl('', Validators.required),
    phone_number: new FormControl('', Validators.required),
    mobile_number: new FormControl('', Validators.required),
    email: new FormControl('', [ Validators.required, Validators.email]),
    url_web: new FormControl(''),
    divisa: new FormControl('', Validators.required)
  })

  constructor(
    private _spinner: NgxSpinnerService,
    private _countryService: CountriesOpenService,
    private _businessService: BusinessService,
    private _loginService: LoginService,
    private _userService:UsersService,
    private _uploadService: UploadFileService,
    private _toastr: ToastrService,
    private _router: Router,
    private _dialog:MatDialog,
  ) {
    this._spinner.show()
    this.getCountryOpen()
    this.date = new Date();
    this.form.controls['creation_date'].setValue(this.date)
    this.user = _loginService.user
    this.letterNames = `${this.user.name.charAt(0).toUpperCase()}`;

  }

  ngOnInit(): void {

  }

  goToComment(){
    this.flag = !this.flag
  }

  openDialogAddActivity(){
    let dialogRef = this._dialog.open(AddActivitiesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe(() => {

    })
  }

  addActivity(){
    const value = this.formActivity.value.trim()
    console.log();

    if(value.length <= 0 ){
      this._toastr.warning('Es obligatorio escribir una nota')
      return
    }

    this.history.push({
      name: this.user.name,
      last_name: this.user.last_name,
      note: this.formActivity.value,
      date: new Date().getTime()
    })

    this.formActivity.setValue('')
  }

  addBusiness(){

    if(this.form.invalid){
      this.form.markAllAsTouched()
      return
    }



    if(!this.imageSelect){
      this._toastr.warning('Selecciona el logotipo de la empresa')
      return
    }
    const element: Business = {
      ...this.form.value,
      creation_date: new Date(this.form.controls['creation_date'].value).getTime(),
      activities: this.history
    }
    console.log(element);

    this._businessService.createBusiness(element).subscribe((resp: Business) => {
        this._uploadService.updateFile(this.imageSelect,'business',resp._id!).then((resp:any) => {})
        this.user.tenant.push({
          tenant_id: {
            divisa: resp.divisa,
            key_business: resp.key_business,
            name: resp.name,
            name_short: resp.name_short,
            user: resp.user,
            __v: 0,
            _id: resp._id
          }
        })
        const element = {
          name: this.user.name,
          last_name: this.user.last_name,
          tenant: this.user.tenant
        }
        this._userService.updateUser(element,this.user._id!).subscribe((resp) => {
          this.user.tenant = element.tenant
          this._router.navigateByUrl('/tenants')
        })
    })
  }

  changeImage(event: any){
    this.imageSelect = event.target.files[0]
    if(this.imageSelect){
      const reader = new FileReader();
      reader.onload = () => {
        this.imgView = reader.result as string;
      }
      reader.readAsDataURL(this.imageSelect)
    }
  }

  getCountryOpen(){
    this._countryService.getCountriesOpen().subscribe((resp: Countryopen[]) => {
      this.divisas = resp
      this._spinner.hide()
    })
  }

}
