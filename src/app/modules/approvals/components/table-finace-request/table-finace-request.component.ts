import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinaceRequestService } from '../../../../services/finace-request.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-table-finace-request',
  templateUrl: './table-finace-request.component.html',
  styleUrls: ['./table-finace-request.component.scss']
})
export class TableFinaceRequestComponent implements OnInit {
  public finace_toSend: any[] = [];
  public finace_Send: any[] = [];
  public finace_passed: any[] = [];
  public finace_refused: any[] = [];
  public finace_cancelled: any[] = [];

  constructor(
    private _router: Router,
    private _finaceService: FinaceRequestService,
    private _spinner: NgxSpinnerService
  ) {//this._spinner.show()
  }

  ngOnInit(): void {
    this.getFinaceRequest();
  }

  getFinaceRequest() {
    this._finaceService.getFinaceRequest().subscribe((data: any) => {
      this.finace_toSend = data.filter(
        (finaces: any) => finaces.status === 'TOSEND'
      );
      this.finace_Send = data.filter(
        (finaces: any) => finaces.status === 'SEND'
      );

      this.finace_passed = data.filter(
        (finaces: any) => finaces.status === 'PASSED'
      );
      this.finace_refused = data.filter(
        (finaces: any) => finaces.status === 'REFUSED'
      );
      this.finace_cancelled = data.filter(
        (finaces: any) => finaces.status === 'CANCELLED'
      );
      //this._spinner.hide()
    });
  }

  goToMenuApprovals() {
    this._router.navigateByUrl(
      '/approvals/approvals-finace/add-finace-request'
    );
  }

}
