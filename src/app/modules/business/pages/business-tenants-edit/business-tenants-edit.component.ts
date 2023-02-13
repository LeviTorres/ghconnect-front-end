import { Component, OnInit } from '@angular/core';
import { Countryopen } from '../../../../models/Countryopen.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountriesOpenService } from '../../../../services/countries-open.service';
import { BusinessService } from '../../../../services/business.service';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { UploadFileService } from '../../../../services/upload-file.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddActivitiesComponent } from '../../components/add-activities/add-activities.component';
import { Business } from '../../../../models/Business.model';
import { environment } from '../../../../../environments/environment.prod';
import { AddFollowersComponent } from '../../components/add-followers/add-followers.component';
import { User } from '../../../../models/User.model';

const base_url = environment.base_url

@Component({
  selector: 'app-business-tenants-edit',
  templateUrl: './business-tenants-edit.component.html',
  styleUrls: ['./business-tenants-edit.component.scss']
})
export class BusinessTenantsEditComponent implements OnInit {

  public divisas: Countryopen[] = []
  public date: any
  public imageSelect: any
  public user!: any
  public imgView: any
  public flag: boolean = false
  public letterNames: string = ''
  public history: any[] = []
  public business!: Business
  public dateForm:any
  public nameBusiness:any
  public followers: any[] = []

  public formActivity: FormControl = new FormControl('')

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
    email: new FormControl('', [Validators.required, Validators.email]),
    url_web: new FormControl(''),
    divisa: new FormControl('', Validators.required)
  })

  constructor(
    private _spinner: NgxSpinnerService,
    private _activatedRoute: ActivatedRoute,
    private _countryService: CountriesOpenService,
    private _businessService: BusinessService,
    private _loginService: LoginService,
    private _userService: UsersService,
    private _uploadService: UploadFileService,
    private _toastr: ToastrService,
    private _router: Router,
    private _dialog: MatDialog,
  ) {
    this._spinner.show()
    this.getCountryOpen()
    this.user = _loginService.user
    this.letterNames = `${this.user.name.charAt(0).toUpperCase()}`;
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this._businessService.getBusinessById(params.id).subscribe((resp:any) => {
        this.business = resp
        this.initValuesForm()
      })

    })
  }

  openDialogAddFollower(){
    let dialogRef = this._dialog.open(AddFollowersComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: this.followers
    });
    dialogRef.beforeClosed().subscribe((resp:any) => {
      console.log('resp after dialog', resp);
      if(resp){
        const element = {
          followers: [ ...this.followers, resp],
        }
        //this.followers.push(element)
        console.log(element);

        this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {
          console.log('respuesta exitosa',resp);
          this.followers = [...resp.followers!]
        })
      }
    })
  }

  deleteFollower(index:any){
    this.followers.splice(index, 1);
    const element = {
      followers: [ ...this.followers],
    }
    this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {
      this.followers = [...resp.followers!]
    })
  }

  initValuesForm(){
    this.dateForm = new Date(this.business.creation_date)
    this.nameBusiness = this.business.name
    console.log(this.business);

    //this.imageSelect = `${ base_url }/upload/business/${ this.business.img }`
    //console.log(this.imageSelect)

    this.form.patchValue({
      name: this.business.name,
      name_short: this.business.name_short,
      key_business: this.business.key_business,
      address_1: this.business.address_1,
      street_1: this.business.street_1,
      address_2: this.business.address_2,
      street_2: this.business.street_2,
      country: this.business.country,
      polity: this.business.polity,
      city: this.business.city,
      zip_code: this.business.zip_code,
      tax_identification_number: this.business.tax_identification_number,
      phone_number: this.business.phone_number,
      mobile_number: this.business.mobile_number,
      email: this.business.email,
      url_web: this.business.url_web,
      divisa: this.business.divisa
    })
    console.log();

    this.history = [ ...this.business.activities ]
    this.followers = [...this.business.followers! ]
    /*for (
      let index = 0;
      index < this.business.activities.length;
      index++
    ) {
      this.history.push({
        note: this.business.activities[index].note,
        date: this.business.activities[index].date,
        name: this.business.activities[index].name,
        last_name: this.business.activities[index].last_name,
        type_activity: this.business.activities[index].type_activity,
        date_expiration: this.business.activities[index].date_expiration,
        assignment: this.business.activities[index].assignment,
        summary: this.business.activities[index].summary,
        type: this.business.activities[index].type,
      });
    } */

  }

  goToComment() {
    this.flag = !this.flag
  }

  openDialogAddActivity() {
    let dialogRef = this._dialog.open(AddActivitiesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.beforeClosed().subscribe((resp:any) => {
      console.log('resp after dialog', resp);
      if(resp){
        const element = {
          ...resp,
          name: this.user.name,
          last_name: this.user.last_name,
        }
        this.history.push(element)
      }
    })
  }

  addActivity() {
    const value = this.formActivity.value.trim()

    if (value.length <= 0) {
      this._toastr.warning('Es obligatorio escribir una nota')
      return
    }

    this.history.push({
      name: this.user.name,
      last_name: this.user.last_name,
      note: this.formActivity.value,
      date: new Date().getTime(),
      type: 'note'
    })

    const element = {
      ...this.form.value,
      activities: [
        ...this.business.activities,
        ...this.history
      ]
    }
    this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {})
    this.formActivity.setValue('')
  }

  addBusiness() {

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    if (!this.imageSelect) {
      this._toastr.warning('Selecciona el logotipo de la empresa')
      return
    }
    const element: Business = {
      ...this.form.value
    }
    console.log(element);

    this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {
      this._uploadService.updateFile(this.imageSelect, 'business', resp._id!).then((resp: any) => { })
        this._router.navigateByUrl('/tenants')
        this._toastr.success('Empresa actualizada con exito')
    })
  }

  changeImage(event: any) {
    this.imageSelect = event.target.files[0]
    if (this.imageSelect) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imgView = reader.result as string;
      }
      reader.readAsDataURL(this.imageSelect)
    }
  }

  getCountryOpen() {
    this._countryService.getCountriesOpen().subscribe((resp: Countryopen[]) => {
      this.divisas = resp
      this._spinner.hide()
    })
  }

  getUser(id:string){
   // console.log(id);
    let user:any
    let users:any
    this._userService.getUsers().subscribe((resp: User[]) => {
      console.log(resp);

      // user = resp.find((element:User) => element._id === id)
    })
   // console.log(user);


    return id
  }

}
