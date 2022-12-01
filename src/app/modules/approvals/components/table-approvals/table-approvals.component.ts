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

  public travel_draft: TravelRequest[] = []

  constructor(
    private _router:Router,
    private _travelService: TravelRequestService
  ) { }

  ngOnInit(): void {
    this.getTravelRequest()
  }

  getTravelRequest(){
    this._travelService.getTravelRequest().subscribe((data: any) => {
      this.travel_draft = data.filter((travels:TravelRequest) => travels.status === 'draft')
      console.log(data);
    })
  }

  goToMenuApprovals(){
    this._router.navigateByUrl('/approvals/approvals-travel/add-travel-request')
  }
}
