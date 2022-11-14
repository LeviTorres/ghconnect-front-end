import { User } from './User.model';

export class Divisa {
  constructor(
    public name: string,
    public abbreviation_divisa: string,
    public symbol: string,
    public user?: User,
    public _id?: string
  ){}
}
