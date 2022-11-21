import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CecosService } from '../../../../services/cecos.service';
import { Ceco } from '../../../../models/Ceco.model';
import { Business } from '../../../../models/Business.model';
import { BusinessService } from '../../../../services/business.service';
import { ContractsProviderService } from '../../../../services/contracts-provider.service';
import { ContractsProvider } from '../../../../models/ContractsProvider.model';
import { AddProviderComparativeComponent } from '../../components/add-provider-comparative/add-provider-comparative.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-comparatives-chart',
  templateUrl: './add-comparatives-chart.component.html',
  styleUrls: ['./add-comparatives-chart.component.scss']
})
export class AddComparativesChartComponent implements OnInit {

  public cecos: Ceco[] = []
  public business: Business[] = []
  public contracts:ContractsProvider[] = []
  public providers: any[] = []

  public comparativeForm = this._fb.group({
    control_id: ['', Validators.required],
    type_contract: ['', Validators.required],
    creation_date: ['', Validators.required],
    business_unit: ['', Validators.required],
    start_date: ['', Validators.required],
    final_date: ['', Validators.required],
    goal_contract: ['', Validators.required],
    business: [ '', Validators.required]
  })

  constructor(
    private _fb: FormBuilder,
    private _cecoService: CecosService,
    private _businessService: BusinessService,
    private _contractsService: ContractsProviderService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCecos()
    this.getBusiness()
    this.getContractsProvider()
    const date:any = new Date();
    this.comparativeForm.controls['creation_date'].setValue(date);
    this.comparativeForm.get('creation_date')?.disable();
  }

  getCecos(){
    this._cecoService.getCecos().subscribe((cecos: Ceco[]) => {
      this.cecos = cecos
    })
  }

  getBusiness(){
    this._businessService.getBusiness().subscribe((business: Business[]) => {
      this.business = business
    })
  }

  getContractsProvider(){
    this._contractsService.getContractsProvider().subscribe((contracts: ContractsProvider[]) => {
      this.contracts = contracts
    })
  }

  registerComparativeChart(){

  }

  addProvider(){
    let dialogRef = this._dialog.open(AddProviderComparativeComponent,{
      width: '750px',
      height: '95vh',
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((item: any) =>{
      if(item){
        this.providers.push(item);
      }
    })
  }

}
