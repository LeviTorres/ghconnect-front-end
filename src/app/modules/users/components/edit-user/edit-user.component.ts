import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../../../models/User.model';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Business } from '../../../../models/Business.model';
import { BusinessService } from '../../../../services/business.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public tenants: any[] = []

  public users: User[] = []

  public business: Business[] = []

  public addTenant: boolean = false
  public validateBusiness: boolean = false

  public filteredOptions: any[] = [];

  public registerForm:FormGroup = new FormGroup({
    name: new FormControl('', Validators.required ),
    last_name: new FormControl('', Validators.required ),
    email: new FormControl('', [Validators.required, Validators.email] )
  })

  public tenantForm: FormGroup = new FormGroup({
    business: new FormControl('', Validators.required)
  })

  constructor(
    private _dialogRef: MatDialogRef<EditUserComponent>,
    private _fb: FormBuilder,
    private _userService: UsersService,
    private _businessService: BusinessService,
    private _toastr:ToastrService,
    private _spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public userData: User
  ) { }

  ngOnInit(): void {
    this.initValuesForm()
    this.getBusiness()
    this.tenantForm.controls['business'].valueChanges.subscribe((inputValue: any) => {
      this.filterData(inputValue)
    })
  }

  getBusiness(){
    this._businessService.getBusiness().subscribe((business: Business[]) => {
      this.business = business
    })
  }

  initValuesForm(){
    this.tenants = this.userData.tenant
    this.registerForm.patchValue({
      email: this.userData.email,
      name: this.userData.name,
      last_name: this.userData.last_name
    })
  }

  registerUser() {
      this._spinner.show()

      if(this.registerForm.invalid){
        this._spinner.hide()
        return
      }

      if(this.tenants.length <= 0){
        this._spinner.hide()
        this._toastr.warning('Selecciona al menos una empresa')
        return
      }

      const element ={
        name: this.registerForm.controls['name'].value,
        last_name: this.registerForm.controls['last_name'].value,
        email: this.registerForm.controls['email'].value,
        tenant: this.tenants
      }

      this._userService.updateUser(element, this.userData._id!)
        .subscribe(( res:any ) => {
          this._spinner.hide()
          this._dialogRef.close()
          this._toastr.success('Usuario actualizado con Exito')
        }, (err:any) =>{
          console.warn(err.error.msg)
          this._spinner.hide()
          this._toastr.error(`${err.error.msg}`)
        })
  }

  delete(index: number){
    this.tenants.splice(index, 1);
  }

  registerTenant(){
    if (this.tenantForm.invalid) {
      return
    }
    let business:any
    const businessSelect = this.tenantForm.controls['business'].value
    if(businessSelect._id){
      business = businessSelect
      this.validateBusiness = true
    }else {
      const findBusiness = this.business.find((business: Business) => business.name.trim().toLowerCase() === businessSelect.trim().toLowerCase())
      if(findBusiness){
        this.validateBusiness = true
        business = findBusiness
      }else{
        this.validateBusiness = false
      }
    }
    if (!this.validateBusiness) {
      this._toastr.warning('Empresa no existe', 'Seleccione una empresa existente')
      return
    }

    const repeatBusiness = this.tenants.find((data:any) => data.tenant_id.name === business.name)
    if(repeatBusiness){
      this._toastr.warning('Empresa previamente seleccionada', 'Seleccione una empresa distinta')
      return
    }
    this.tenants.push({
      tenant_id: {
        country: business.country,
        key_business: business.key_business,
        name: business.name,
        name_short: business.name_short,
        user: business.user,
        __v: 0,
        _id: business._id
      }
    })
    this.tenantForm.reset()
    this.addTenant = false
  }

  addBusiness(){
    this.addTenant = true
  }

  displayFn(business:Business): string {
    return business && `${business.name}`
      ? `${business.name}`
      : '';
  }

  filterData(value: string) {
    this.filteredOptions = this.business.filter((item: any) => {
      this.displayFn(item);
      return (
        item.name.toLowerCase().indexOf(value) > -1 || item.name.indexOf(value) > -1
      );
    });
  }

  returnTable(){
    this.addTenant = false;
    this.tenantForm.reset()
  }

}
