import { User } from './User.model';
import { Divisa } from './Divisa.model';

export class Exchange {
  constructor(
    public national_currency: Divisa,
    public foreign_currency: Divisa,
    public exchange_rate_amount: number,
    public date_exchange: number,
    public type_exchange: string,
    public user?: User,
    public _id?: string
  ){}
}
