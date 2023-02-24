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
import { EditActivitiesComponent } from '../../components/edit-activities/edit-activities.component';

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
  public flagNote: boolean = false
  public letterNames: string = ''
  public history: any[] = []
  public business!: Business
  public dateForm:any
  public nameBusiness:any
  public followers: any[] = []
  public users: any[] = []
  public activitiesPlan: any[] = []

  public inputChangeImage: boolean = false

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
    polity: new FormControl(''),
    city: new FormControl('', Validators.required),
    zip_code: new FormControl(''),
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
    this.getUsers()
    this.user = _loginService.user
    this.letterNames = `${this.user.name.charAt(0).toUpperCase()}`;
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this._businessService.getBusinessById(params.id).subscribe((resp:any) => {
        this.business = resp
        this.initValuesForm()
        this.viewActivitiesPlan()
      })
    })
  }

  openDialogAddFollower(){
    let dialogRef = this._dialog.open(AddFollowersComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: {
        followers: this.followers,
        name_business: this.business.name
      }
    });
    dialogRef.beforeClosed().subscribe((resp:any) => {
      console.log('resp after dialog', resp);
      if(resp){
        const element = {
          followers: [ ...this.followers, resp],
        }
        this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {
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
    this.dateForm = new Date(this.business.creation_date).getTime()

    this.nameBusiness = this.business.name

    this.imageSelect = `${ base_url }/upload/business/${ this.business.img }`
    console.log(this.imageSelect);

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
      divisa: this.business.divisa?._id,
    })

    this.history = [ ...this.business.activities ]
    this.followers = [...this.business.followers! ]

  }

  goToComment() {
    this.flag = !this.flag
  }

  viewNote(){
    this.flagNote = !this.flagNote
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
        const element1 = {
          ...resp
        }
        this.history.push(element1)
        console.log('this.history',this.history);
        const element = {
          activities: [
            ...this.history
          ]
        }

        this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {})
        this.viewActivitiesPlan()
      }
    })
  }

  viewActivitiesPlan(){
    let findActivity:any
    findActivity = this.history.filter((element:any) => {
      return element.type === 'activity' && element.status === 'DRAFT'
    })

    if(findActivity){
      this.activitiesPlan = findActivity
    }
  }

  markActivityDone(data:any){

    const findActivity = this.history.findIndex((element:any) => element._id === data._id)
    const element1 = {
      ...data,
      status: 'DONE',
      date: new Date().getTime(),
      user: this.user._id
    }
    this.history[findActivity] = element1
    const element = {
      activities: [
       ...this.history,
     ]
    }
    this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {
      this.history = [...resp.activities]
    })
    this.viewActivitiesPlan()
  }

  cancelActivity(data: any){
    const findActivity = this.history.findIndex((element:any) => element._id === data._id)
    this.history.splice(findActivity,1)
    const element = {
      activities: [
       ...this.history
     ]
    }
    this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {
      this.history = [...resp.activities]
    })
    this.viewActivitiesPlan()
  }

  goToEditActivity(id: string){
    console.log(id);
    let dialogRef = this._dialog.open(EditActivitiesComponent, {
      width: '550px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: id
    })
    dialogRef.beforeClosed().subscribe((resp:any) => {
      console.log('resp after dialog', resp);
      if(resp){
        const element1 = {
          ...resp
        }

        const findIndexActivity = this.history.findIndex((element:any) => element._id === element1._id)

        this.history[findIndexActivity] = element1

        const element = {
          activities: [
           ...this.history
         ]
        }

        this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {
          this.history = [...resp.activities]
        })
        this.viewActivitiesPlan()
      }
    })
  }


  addNote() {
    const value = this.formActivity.value.trim()

    if (value.length <= 0) {
      this._toastr.warning('Es obligatorio escribir una nota')
      return
    }

    this.history.push({
      note: this.formActivity.value,
      date: new Date().getTime(),
      type: 'note',
      user: this.user._id
    })

    const element = {
      activities: [
        ...this.history
      ]
    }

    this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {

    })

    this.formActivity.setValue('')
  }

  addBusiness() {

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const element: Business = {
      ...this.form.value
    }
    console.log(element);

    this._businessService.updateBusiness(element, this.business._id!).subscribe((resp: Business) => {
      if(this.imageSelect){
        this._uploadService.updateFile(this.imageSelect, 'business', resp._id!).then((resp: any) => { })
        this._router.navigateByUrl('/tenants')
        this._toastr.success('Empresa actualizada con exito')
      }
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

  getUsers(){
    this._userService.getUsers().subscribe((resp: User[]) => {
      this.users = resp
    })
  }

  getUser(id:any){
    const findUser:any = this.users.find((user: any) => user._id === id)
    return {
      name: findUser?.name,
      last_name: findUser?.last_name
    }
  }
  getUserInitial(id:any){
    const findUser:any = this.users.find((user: any) => user._id === id)
    return findUser?.name.charAt(0).toUpperCase()
  }

}
