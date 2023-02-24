import { PaymentConditions } from './PaymentConditions.model';
import { User } from './User.model';

export class Provider {
  constructor(
    public key_provider: string,
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
    public activities?: any[],
    public followers?: any[],
    public user?: User,
    public _id?: string
  ){}
}
