import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProvidersService } from '../../../../services/providers.service';
import { Provider } from '../../../../models/Provider.model';

@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.scss']
})
export class EditProviderComponent implements OnInit {

  public provider!:Provider;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _providerService:ProvidersService
  ) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this.getProviders(params.provider)
      this.provider = params.provider
    })
  }

  getProviders(id: string){
    this._providerService.getProviders().subscribe((providers:Provider[]) => {

    })
  }

}
