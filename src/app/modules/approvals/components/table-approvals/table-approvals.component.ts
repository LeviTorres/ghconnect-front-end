import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TravelRequestService } from '../../../../services/travel-request.service';
import { TravelRequest } from '../../../../models/TravelRequest.model';

@Component({
  selector: 'app-table-approvals',
  templateUrl: './table-approvals.component.html',
  styleUrls: ['./table-approvals.component.scss']
})
export class TableApprovalsComponent implements OnInit {

  public travel_toSend: TravelRequest[] = []
  public travel_Send: TravelRequest[] = []
  public travel_passed: TravelRequest[] = []
  public travel_refused: TravelRequest[] = []
  public travel_cancelled: TravelRequest[] = []

  constructor(
    private _router:Router,
    private _travelService: TravelRequestService
  ) { }

  ngOnInit(): void {
    this.getTravelRequest()
  }

  getTravelRequest(){
    this._travelService.getTravelRequest().subscribe((data: any[]) => {
      this.travel_toSend = data.filter((travels:TravelRequest) => travels.status === 'TOSEND')
      this.travel_Send = data.filter((travels:TravelRequest) => travels.status === 'SEND')
      this.travel_passed = data.filter((travels:TravelRequest) => travels.status === 'PASSED')
      this.travel_refused = data.filter((travels:TravelRequest) => travels.status === 'REFUSED')
      this.travel_cancelled = data.filter((travels:TravelRequest) => travels.status === 'CANCELLED')
    })
  }

  goToMenuApprovals(){
    this._router.navigateByUrl('/approvals/approvals-travel/add-travel-request')
  }
}
