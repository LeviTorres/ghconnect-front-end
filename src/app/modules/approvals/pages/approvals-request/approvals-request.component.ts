import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TravelRequestService } from '../../../../services/travel-request.service';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../models/User.model';
import { TravelRequest } from '../../../../models/TravelRequest.model';

@Component({
  selector: 'app-approvals-request',
  templateUrl: './approvals-request.component.html',
  styleUrls: ['./approvals-request.component.scss']
})
export class ApprovalsRequestComponent implements OnInit {

  public user!: User
  public travelRequest!: TravelRequest

  public token: string = ''

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _travelRequestService: TravelRequestService,
    private _userService: UsersService
  ) {
    this._activatedRoute.params.subscribe((params:any) => {
      this.token = params.token
      const info = JSON.parse(atob(params.token.split('.')[1]))
      this.getUser(info.uid)
      this.getTravelRequest(info.request)
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
    })
  }

  ngOnInit(): void {

  }

  updatedRequestAccept(){

   const findUser = this.travelRequest.authorizers.findIndex((user:any) => user.user === this.user.email)

    this.travelRequest.authorizers[findUser].status = 'ACCEPTED'
    console.log(this.travelRequest.authorizers[findUser].required);

    const element = {
      ...this.travelRequest,
      business: this.travelRequest.business._id,
      authorizers: this.travelRequest.authorizers
    }
    this._travelRequestService.updateTravelRequest(element, this.travelRequest._id!).subscribe((res:any) => {
      console.log('res',res);
      const updated = res.travelRequestUpdated.authorizers
      console.log('updated.length',updated.length);
      const findAllAccepted = updated.filter((travel:any) => travel.status === 'ACCEPTED')
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
      const findAllCancelled = updated.filter((travel:any) => travel.status === 'CANCELLED')
      console.log('findAllCancelled',findAllCancelled);
      if(findAllCancelled.length === updated.length) {
        const element = {
          ...this.travelRequest,
          status: 'CANCELLED',
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

  }

}

