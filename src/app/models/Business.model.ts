import { User } from './User.model';
import { Country } from './Country.model';
export class Business {
  constructor(
    public name: string,
    public name_short: string,
    public key_business: string,
    public user?: User,
    public country?: Country,
    public _id?: string
  ){}
}
