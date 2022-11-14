import { User } from './User.model';
import { Divisa } from './Divisa.model';


export class Country {
  constructor(
    public name: string,
    public nationality: string,
    public user?: User,
    public divisa?: Divisa,
    public _id?: string
  ){}
}
