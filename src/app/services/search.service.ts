import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/User.model';
import { Divisa } from '../models/Divisa.model';
import { Country } from '../models/Country.model';
import { Business } from '../models/Business.model';
import { Ceco } from '../models/Ceco.model';
import { InvoiceProviders } from '../models/InvoiceProviders.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private _http: HttpClient,

  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private generateUsers(users: any[]): User[] {
    return users.map(
      user => new User(user.name, user.last_name, user.email, '', user.img, user.role, user._id)
    )
  }

  private generateDivisas(divisas: any[]): Divisa[] {
    return divisas.map(
      divisa => new Divisa(divisa.name, divisa.abbreviation_name, divisa._id)
    )
  }

  private generateCountries(countries: any[]): Country[] {
    return countries.map(
      country => new Country(country.name, country.nationality)
    )
  }

  private generateBusiness(business: any[]): Business[] {
    return business.map(
      business => new Business(business.name, business.name_short, business.key_business)
    )
  }

  private generateCecos(cecos: any[]): Ceco[] {
    return cecos.map(
      cecos => new Ceco(cecos.name_large, cecos.name_short, cecos.key_ceco, cecos.key_ceco_business)
    )
  }

  private generateInvoiceProviders(invoiceProviders: any[]): InvoiceProviders[] {
    return invoiceProviders.map(
      (invoiceProviders: InvoiceProviders) => new InvoiceProviders(invoiceProviders.ceco,
        invoiceProviders.provider,
        invoiceProviders.key_invoice,
        invoiceProviders.upload_date,
        invoiceProviders.invoice_date,
        invoiceProviders.expiration_date,
        invoiceProviders.invoice_total,
        invoiceProviders.divisa,
        invoiceProviders.description,
        invoiceProviders.movement_type,
        invoiceProviders.user,
        invoiceProviders.contract,
        invoiceProviders.status,
        invoiceProviders.flow_id,
        invoiceProviders.remesa,
        invoiceProviders._id
      )
    )
  }
  search(type: string, term: string) {
    return this._http.get<any[]>(`${base_url}/search/${type}/${term}`, this.headers)
      .pipe(
        map((resp: any) => {
          switch (type) {
            case 'users':
              return this.generateUsers(resp.resultados)
            case 'divisas':
              return this.generateDivisas(resp.resultados)
            case 'countries':
              return this.generateCountries(resp.resultados)
            case 'business':
              return this.generateBusiness(resp.resultados)
            case 'cecos':
              return this.generateCecos(resp.resultados)
            case 'invoiceProviders':
              return this.generateInvoiceProviders(resp.resultados)
            default:
              return []
          }
        })
      )
  }
}
