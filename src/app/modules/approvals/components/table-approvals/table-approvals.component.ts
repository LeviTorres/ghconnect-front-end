import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-approvals',
  templateUrl: './table-approvals.component.html',
  styleUrls: ['./table-approvals.component.scss']
})
export class TableApprovalsComponent implements OnInit {

  constructor(
    private _router:Router
  ) { }

  ngOnInit(): void {
  }
  goToMenuApprovals(){
    this._router.navigateByUrl('/approvals/menu-approvals')
  }
}
