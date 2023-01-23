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
import { InvoiceClient } from '../models/InvoiceClients.model';
import { Provider } from '../models/Provider.model';
import { Client } from '../models/Client.model';

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

  get tenant(): any {
    return localStorage.getItem('tenant')
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
        'tenant': this.tenant
      }
    }
  }

  private generateUsers(users: any[]): User[] {
    return users.map(
      user => new User(user.name, user.last_name, user.email, user.tenant, '', user.img, user.role, user._id)
    )
  }

  private generateDivisas(divisas: any[]): Divisa[] {
    return divisas.map(
      divisa => new Divisa(divisa.name, divisa.abbreviation_divisa, divisa.symbol, divisa.user, divisa._id)
    )
  }

  private generateCountries(countries: any[]): Country[] {
    return countries.map(
      country => new Country(country.name, country.nationality, country.user, country.divisa, country._id)
    )
  }

  private generateBusiness(business: any[]): Business[] {
    return business.map(
      business => new Business(business.name, business.name_short, business.key_business, business.user, business.img, business.country, business._id)
    )
  }

  private generateCecos(cecos: any[]): Ceco[] {
    return cecos.map(
      cecos => new Ceco(cecos.name_large, cecos.name_short, cecos.key_ceco, cecos.key_ceco_business, cecos.user, cecos.business,cecos._id)
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

  private generateInvoiceClients(invoiceClients: any[]): InvoiceClient[] {
    return invoiceClients.map(
      (invoiceClients: InvoiceClient) => new InvoiceClient(invoiceClients.ceco,
        invoiceClients.client,
        invoiceClients.key_invoice,
        invoiceClients.upload_date,
        invoiceClients.invoice_date,
        invoiceClients.expiration_date,
        invoiceClients.invoice_total,
        invoiceClients.divisa,
        invoiceClients.description,
        invoiceClients.movement_type,
        invoiceClients.user,
        invoiceClients.contract,
        invoiceClients.status,
        invoiceClients.flow_id,
        invoiceClients.remesa,
        invoiceClients._id
      )
    )
  }

  private generateProviders(providers: any[]): Provider[] {
    return providers.map(
      (providers: Provider) => new Provider(
        providers.key_provider,
        providers.name,
        providers.nit,
        providers.third_type,
        providers.society_type,
        providers.provider_type,
        providers.phone_number,
        providers.mobile_number,
        providers.email,
        providers.status,
        providers.payment_conditions,
        providers.user,
        providers._id,
      )
    )
  }

  private generateClients(clients: any[]): Client[] {
    return clients.map(
      (clients: Client) => new Client(
        clients.key_client,
        clients.name,
        clients.nit,
        clients.third_type,
        clients.society_type,
        clients.provider_type,
        clients.phone_number,
        clients.mobile_number,
        clients.email,
        clients.status,
        clients.payment_conditions,
        clients.user,
        clients._id,
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
            case 'invoiceClients':
              return this.generateInvoiceClients(resp.resultados)
            case 'providers':
              return this.generateProviders(resp.resultados)
            case 'clients':
              return this.generateClients(resp.resultados)
            default:
              return []
          }
        })
      )
  }
}
