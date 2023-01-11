import { Component, OnInit } from '@angular/core';
import { FinaceRequestService } from '../../../../../services/finace-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../../../services/users.service';
import { TokensService } from '../../../../../services/tokens.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../../../../models/User.model';
import { FinaceRequest } from '../../../../../models/FinaceRequest.model';
import { ProvidersService } from '../../../../../services/providers.service';
import { Provider } from '../../../../../models/Provider.model';
import { Client } from '../../../../../models/Client.model';
import { Business } from '../../../../../models/Business.model';
import { ClientsService } from 'src/app/services/clients.service';
import { BusinessService } from '../../../../../services/business.service';


@Component({
  selector: 'app-approvals-finace-request',
  templateUrl: './approvals-finace-request.component.html',
  styleUrls: ['./approvals-finace-request.component.scss']
})
export class ApprovalsFinaceRequestComponent implements OnInit {
  public id_user: string = '';
  public user!: User;
  public finaceRequest!: FinaceRequest;
  public activities: any;

  public token: string = '';
  public data: any;

  public arrays: (Provider | Client | Business)[] = [];
  public providers: Provider[] = [];
  public clients: Client[] = [];
  public business: Business[] = [];
  public payer: Provider | Client | Business | null = null;

  constructor(
    private _providerService: ProvidersService,
    private _clientService: ClientsService,
    private _businessService: BusinessService,
    private _activatedRoute: ActivatedRoute,
    private _finaceService: FinaceRequestService,
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
        this.data = tokensDB
        if (!tokensDB) {
          this._router.navigateByUrl('/home');
        } else {
          const info = JSON.parse(atob(params.token.split('.')[1]))
          this.id_user = info.uid;
          this.getUser(info.uid);
          this.getProviders();
          this.getClients();
          this.getBusiness();
          this.getFinaceRequest(info.request);
        }
      });
    });
  }

  getUser(id: string) {
    this._userService.getUsers().subscribe((users: any[]) => {
      this.user = users.find((user: User) => user._id === id);
    });
  }

  getProviders() {
    this._providerService.getProviders().subscribe((providers: Provider[]) => {
      this.providers = providers
      this.arrays = [...this.clients, ...this.providers, ...this.business];
      console.log(this.arrays);
    })
  }

  getBusiness() {
    this._businessService.getBusiness().subscribe((business: Business[]) => {
      this.business = business;
      console.log('this.business', this.business);

    });
  }

  getClients() {
    this._clientService.getClients().subscribe((clients: Client[]) => {
      this.clients = clients
      console.log('this.clients', this.clients);
      this.arrays = [...this.clients, ...this.providers, ...this.business]
      console.log(this.arrays);
    })
  }

  getFinaceRequest(id: string) {
    this._finaceService
      .getFinaceRequest()
      .subscribe((finacesRequest: any[]) => {
        this.finaceRequest = finacesRequest.find(
          (finaceRequest: FinaceRequest) => finaceRequest._id === id,
        );
        this.activities = this.finaceRequest.history;
        this.FindPayer(this.finaceRequest);
        this._spinner.hide()
      });
  }

  FindPayer(finaceRequest: FinaceRequest) {
    this.payer = this.arrays.find((element) => element._id === finaceRequest.payer) as (Provider | Client | Business | null);
  }

  ngOnInit(): void {
    //this.getTravelRequest()
  }

  async updatedRequestAccept() {
    this._spinner.show();
    const findUser = this.finaceRequest.authorizers.findIndex(
      (user: any) => user.user.email === this.user.email
    );
    this.finaceRequest.authorizers[findUser].status = 'ACCEPTED';
    this.activities.push({
      action: `Aprobo solicitud`,
      date: new Date().getTime(),
      user: this.id_user,
    });
    const element = {
      ...this.finaceRequest,
      business: this.finaceRequest.business._id,
      ceco: this.finaceRequest.ceco._id,
      divisa_guaranteed_sum: this.finaceRequest.divisa_guaranteed_sum._id,
      divisa_main_value: this.finaceRequest.divisa_main_value._id,
      authorizers: this.finaceRequest.authorizers,
      history: this.activities,
    };
    this._finaceService
      .updateFinaceRequest(element, this.finaceRequest._id!)
      .subscribe(
        () => {
          this._tokenService.deleteToken(this.data).subscribe(
            () => {
              this._router.navigateByUrl('/approvals/approvals-finace');
              this._finaceService.getUpdateFinaceRequest(element);
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
    const findUser = this.finaceRequest.authorizers.findIndex(
      (user: any) => user.user.email === this.user.email
    );
    this.finaceRequest.authorizers[findUser].status = 'CANCELLED';
    this.activities.push({
      action: `Rechazo solicitud`,
      date: new Date().getTime(),
      user: this.id_user,
    });
    const element = {
      ...this.finaceRequest,
      business: this.finaceRequest.business._id,
      ceco: this.finaceRequest.ceco._id,
      divisa_guaranteed_sum: this.finaceRequest.divisa_guaranteed_sum._id,
      divisa_main_value: this.finaceRequest.divisa_main_value._id,
      authorizers: this.finaceRequest.authorizers,
      history: this.activities,
    };
    this._finaceService
      .updateFinaceRequest(element, this.finaceRequest._id!)
      .subscribe(
        () => {
          this._tokenService.deleteToken(this.data).subscribe(
            () => {
              this._router.navigateByUrl('/approvals/approvals-request');
              this._finaceService.getUpdateFinaceRequest(element);
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
