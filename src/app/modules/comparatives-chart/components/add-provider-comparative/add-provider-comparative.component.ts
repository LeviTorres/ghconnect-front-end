import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Provider } from 'src/app/models/Provider.model';
import { ProvidersService } from '../../../../services/providers.service';

@Component({
  selector: 'app-add-provider-comparative',
  templateUrl: './add-provider-comparative.component.html',
  styleUrls: ['./add-provider-comparative.component.scss']
})
export class AddProviderComparativeComponent implements OnInit {

  public providers:Provider[] = []

  public providerForm = this._fb.group({
    contact: ['', Validators.required],
    phone_number: ['', Validators.required],
    email: ['', Validators.required],
    pvr: ['', Validators.required],
    import: ['', Validators.required],
    total: ['', Validators.required],
    payment_method: ['', Validators.required],
    advance: ['', Validators.required],
    disponibility: ['', Validators.required],
    auxiliary_means: ['', Validators.required],
    observations: ['', Validators.required],
  })

  constructor(
    private _fb:FormBuilder,
    private _providerService: ProvidersService
  ) { }

  ngOnInit(): void {

  }

  getProviders(){
    this._providerService.getProviders().subscribe((providers:Provider[]) => {

    })
  }

  registerProviderComparativeChart(){

  }

}
