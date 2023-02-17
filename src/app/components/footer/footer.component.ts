import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ModalQuestionComponent } from '../modal-question/modal-question.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public userTenant: any

  constructor(
    private _loginService: LoginService,
    private _dialog: MatDialog
  ) {
    this.userTenant = _loginService.business
  }

  ngOnInit(): void {
  }

  changeTenant() {
    this._dialog.open(ModalQuestionComponent, {
      width: '640px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: this._loginService.business._id
    });
  }

}
