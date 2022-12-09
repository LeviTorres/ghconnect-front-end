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
  styleUrls: ['./approvals-request.component.scss']
})
export class ApprovalsRequestComponent implements OnInit {
  public id_user:string = ''
  public user!: User
  public travelRequest!: TravelRequest
  public activities: any

  public token: string = ''
  public data: any

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _travelRequestService: TravelRequestService,
    private _userService: UsersService,
    private _tokenService: TokensService,
    private _router: Router,
    private _spinner: NgxSpinnerService
  ) {
    this._spinner.show()
    this._activatedRoute.params.subscribe((params:any) => {
      this.token = params.token
      this._tokenService.getTokens().subscribe((tokens:any[]) => {
        console.log(tokens);
        const tokensDB =tokens.find((token: any) => token.key_token === this.token)
        this.data = tokensDB
        if(!tokensDB){
          this._router.navigateByUrl('/home')
        }
        this._spinner.hide()
      })
    })
  }

  getUser(id: string){
    this._userService.getUsers().subscribe((users:any[]) => {
      this.user = users.find((user: User) => user._id === id)
    })
  }

  getTravelRequest(id: string){
    this._travelRequestService.getTravelRequest().subscribe((travelsRequest: any[]) => {
      this.travelRequest = travelsRequest.find((travelRequest: TravelRequest) => travelRequest._id === id)
      console.log(this.travelRequest);
      this.activities = this.travelRequest.history
    })
  }

  ngOnInit(): void {

  }

  updatedRequestAccept(){

   const findUser = this.travelRequest.authorizers.findIndex((user:any) => user.user === this.user.email)
    this.travelRequest.authorizers[findUser].status = 'ACCEPTED'
       this.activities.push(
         {
           action: `Aprobo solicitud`,
           date: new Date().getTime(),
           user: this.id_user,
         }
       )
    const element = {
      ...this.travelRequest,
      business: this.travelRequest.business._id,
      authorizers: this.travelRequest.authorizers,
      history: this.activities
    }
    this._travelRequestService.updateTravelRequest(element, this.travelRequest._id!).subscribe((res:any) => {
      console.log('res',res);
      const updated = res.travelRequestUpdated.authorizers
      console.log('updated.length',updated.length);
      const findAllAccepted = updated.filter((travel:any) => travel.status === 'ACCEPTED' && travel.required === true)

      console.log('findAllAccepted',findAllAccepted);
      if(findAllAccepted.length === updated.length) {
        const element = {
          ...this.travelRequest,
          status: 'PASSED',
          business: this.travelRequest.business._id,
          authorizers: this.travelRequest.authorizers
        }
        this._travelRequestService.updateTravelRequest(element,  this.travelRequest._id!).subscribe(() => {

        })
      }
    }, (error) => {
      console.log(error);
    })
  }

  updatedRequestDecline(){
    console.log(this.data);
    this._spinner.show()
    this._tokenService.deleteToken(this.data).subscribe(() => {
      this._router.navigateByUrl('/home')
      this._spinner.hide()
    })
  }

  getStatus(status: string){
    if(status === 'SEND'){
      return 'Enviado'
    }else if(status === 'PASSED'){
      return 'Aprobado'
    }else if(status === 'REFUSED'){
      return 'Rechazado'
    }else if(status === 'CANCELLED'){
      return 'Cancelado'
    }
    return
  }
}

