import { User } from './User.model';
import { PaymentConditions } from './PaymentConditions.model';
export class Client {
  constructor(
    public key_client: string,
    public name: string,
    public nit: string,
    public third_type: string,
    public society_type: string,
    public provider_type: string,
    public phone_number: string,
    public mobile_number: string,
    public email: string,
    public status: string,
    public payment_conditions: PaymentConditions,
    public user?: User,
    public _id?: string
  ){}
}
