import { User } from './User.model';
import { Business } from './Business.model';
export class Ceco {
  constructor(
    public name_large: string,
    public name_short: string,
    public key_ceco: string,
    public key_ceco_business: string,
    public user?: User,
    public business?: Business,
    public _id?: string
  ){}
}
