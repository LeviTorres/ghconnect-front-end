import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelRequestService } from '../../../../services/travel-request.service';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../models/User.model';
import { TravelRequest } from '../../../../models/TravelRequest.model';
import { TokensService } from '../../../../services/tokens.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-approvals-request',
  templateUrl: './approvals-request.component.html',
  styleUrls: ['./approvals-request.component.scss'],
})
export class ApprovalsRequestComponent implements OnInit {
  public id_user: string = '';
  public user!: User;
  public travelRequest!: TravelRequest;
  public activities: any;

  public token: string = '';
  public data: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _travelRequestService: TravelRequestService,
    private _userService: UsersService,
    private _tokenService: TokensService,
    private _router: Router,
    private _spinner: NgxSpinnerService
  ) {
    this._spinner.show();
    this._activatedRoute.params.subscribe((params: any) => {
      this.token = params.token;
      this._tokenService.getTokens().subscribe((tokens: any[]) => {
        const tokensDB = tokens.find(
          (token: any) => token.key_token === this.token
        );
        this.data = tokensDB;
        console.log(this.data);

        if (!tokensDB) {
          this._router.navigateByUrl('/home');
        } else {
          const info = JSON.parse(atob(params.token.split('.')[1]));
          // const date = new Date(info.exp)
          //const dateiat = new Date(info.iat)
          //console.log('date exp',date);
          //console.log('dateiat',dateiat);
          this.id_user = info.uid;
          this.getUser(info.uid);
          this.getTravelRequest(info.request);
          this._spinner.hide();
        }
      });
    });
  }

  getUser(id: string) {
    this._userService.getUsers().subscribe((users: any[]) => {
      this.user = users.find((user: User) => user._id === id);
    });
  }

  getTravelRequest(id: string) {
    this._travelRequestService
      .getTravelRequest()
      .subscribe((travelsRequest: any[]) => {
        this.travelRequest = travelsRequest.find(
          (travelRequest: TravelRequest) => travelRequest._id === id
        );
        console.log(this.travelRequest);
        this.activities = this.travelRequest.history;
      });
  }

  ngOnInit(): void {
    //this.getTravelRequest()
  }

  async updatedRequestAccept() {
    this._spinner.show();
    const findUser = this.travelRequest.authorizers.findIndex(
      (user: any) => user.user.email === this.user.email
    );
    console.log(findUser);
    this.travelRequest.authorizers[findUser].status = 'ACCEPTED';
    this.activities.push({
      action: `Aprobo solicitud`,
      date: new Date().getTime(),
      user: this.id_user,
    });
    const element = {
      ...this.travelRequest,
      business: this.travelRequest.business._id,
      authorizers: this.travelRequest.authorizers,
      history: this.activities,
    };
    console.log('element', element);
    this._travelRequestService
      .updateTravelRequest(element, this.travelRequest._id!)
      .subscribe(
        () => {
          this._tokenService.deleteToken(this.data).subscribe(
            () => {
              this._router.navigateByUrl('/approvals/approvals-request');
              this._travelRequestService.getUpdateTravelRequest(element);
            },
            (err) => {
              console.log(err);
              this._spinner.hide();
            }
          );
        },
        (err) => {
          console.log(err);
          this._spinner.hide();
        }
      );
  }

  updatedRequestDecline() {
    this._spinner.show();
    const findUser = this.travelRequest.authorizers.findIndex(
      (user: any) => user.user.email === this.user.email
    );
    this.travelRequest.authorizers[findUser].status = 'CANCELLED';
    this.activities.push({
      action: `Rechazo solicitud`,
      date: new Date().getTime(),
      user: this.id_user,
    });
    const element = {
      ...this.travelRequest,
      business: this.travelRequest.business._id,
      authorizers: this.travelRequest.authorizers,
      history: this.activities,
    };
    console.log('element', element);
    this._travelRequestService
      .updateTravelRequest(element, this.travelRequest._id!)
      .subscribe(
        () => {
          this._tokenService.deleteToken(this.data).subscribe(
            () => {
              this._router.navigateByUrl('/approvals/approvals-request');
              this._travelRequestService.getUpdateTravelRequest(element);
            },
            (err) => {
              console.log(err);
              this._spinner.hide();
            }
          );
        },
        (err) => {
          console.log(err);
          this._spinner.hide();
        }
      );
  }

  getStatus(status: string) {
    if (status === 'SEND') {
      return 'Enviado';
    } else if (status === 'PASSED') {
      return 'Aprobado';
    } else if (status === 'REFUSED') {
      return 'Rechazado';
    } else if (status === 'CANCELLED') {
      return 'Cancelado';
    }
    return;
  }
}
