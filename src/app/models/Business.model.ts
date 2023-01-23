import { User } from './User.model';
import { Country } from './Country.model';
import { environment } from '../../environments/environment';

const base_url = environment.base_url

export class Business {
  constructor(
    public name: string,
    public name_short: string,
    public key_business: string,
    public user?: User,
    public img?: string,
    public country?: Country,
    public _id?: string
  ){}

  get getImage(){
    if(this.img) {
      return `${ base_url }/upload/business/${ this.img }`
    }else {
      return `${ base_url }/upload/business/image`
    }
  }
}
