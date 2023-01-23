import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { UploadFileService } from '../../../../services/upload-file.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public imageSelect: any
  public user: any

  constructor(
    private _router: Router,
    private _spinner: NgxSpinnerService,
    private _loginService: LoginService,
    private _fileUpload: UploadFileService
  ) {
    this._spinner.show()
    this.user = _loginService.user
    this._spinner.hide()
  }

  ngOnInit(): void {

  }

  changeImage(event: any){
    this.imageSelect = event.target.files[0]
    if(this.imageSelect){
      this._fileUpload.updateFile(this.imageSelect, 'users',this.user._id)
      .then(resp => {
        this.user.img = resp.nameFile
      })
    }
  }

  getRole(role: string) {
    if (role === 'ADMIN_ROLE') {
      return 'Administrador'
    }
    return
  }

  logOut() {
    this._loginService.logout()
    this._router.navigateByUrl('/login')
  }
}
