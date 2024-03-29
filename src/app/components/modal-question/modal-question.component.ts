import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Business } from '../../models/Business.model';
import { BusinessService } from 'src/app/services/business.service';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Component({
  selector: 'app-modal-question',
  templateUrl: './modal-question.component.html',
  styleUrls: ['./modal-question.component.scss']
})
export class ModalQuestionComponent implements OnInit {
  public tenant:any
  public business:any
  public data: any

  constructor(
    private _dialogRef: MatDialogRef<ModalQuestionComponent>,
    private _spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private _loginService:LoginService,
    private _router:Router,
    private businessService:BusinessService
  ) {
    this.data = _loginService.business
    this.tenant = localStorage.getItem('tenant')
    this.businessService.getBusinessById(this.tenant).subscribe((resp:Business) => {
      this.business = resp
    })

  }

  ngOnInit(): void {

  }

  goToTenants(){
    this._spinner.show()
    this._dialogRef.close()
    this._router.navigateByUrl('/tenants')
  }

  close(){
    this._dialogRef.close()
  }

  goToEdit(){
    this._router.navigate(['/business/edit'],
          {
            queryParams: {
              id: this.business._id,
            }
          });
    this._dialogRef.close()
  }

  getImage(image: any){
    if(image) {
      return `${ base_url }/upload/business/${ image.img }`
    }else {
      return `${ base_url }/upload/business/image`
    }
  }

}
