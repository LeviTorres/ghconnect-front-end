import { User } from './User.model';
import { environment } from '../../environments/environment';
import { Countryopen } from './Countryopen.model';

const base_url = environment.base_url

export class Business {
  constructor(
    public name: string,
    public name_short: string,
    public creation_date: string,
    public key_business: string,
    public activities?: [],
    public _id?: string,
    public address_1?: string,
    public street_1?: string,
    public address_2?: string,
    public street_2?: string,
    public country?: string,
    public polity?: string,
    public city?: string,
    public zip_code?: string,
    public tax_identification_number?: string,
    public phone_number?: string,
    public mobile_number?: string,
    public email?: string,
    public url_web?: string,
    public img?: string,
    public divisa?: Countryopen,
    public user?: User
  ){}

  get getImage(){
    if(this.img) {
      return `${ base_url }/upload/business/${ this.img }`
    }else {
      return `${ base_url }/upload/business/image`
    }
  }
}
